import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
import { InventoryTransaction } from "@/main/database/src/entities/InventoryTransaction";
import getSessionUser from "@/main/electron/session/getSessionUser";
import { getImageBase64 } from "@/main/utils/getImageBase64";
import { saveFile } from "@/main/utils/saveFile";
import { ipcMain } from "electron";

export default function registerInventoryHandlers(app: Electron.App) {
  let user: Clerk | null = null;
  getSessionUser().then((sessionUser) => {
    user = sessionUser;
  });
  const inventoryItemRepository = AppDataSource.getRepository(InventoryItem);
  const clerkRepository = AppDataSource.getRepository(Clerk)
  const inventoryTransactionRepository = AppDataSource.getRepository(InventoryTransaction)
  ipcMain.handle("get-inventory", async (_event) => {
    const querriedItems = await inventoryItemRepository
      .createQueryBuilder("inventory")
      .leftJoinAndSelect("inventory.receivedBy", "receivedBy")
      .select([
        "inventory.id",
        "inventory.itemName",
        "inventory.category",
        "inventory.unitWeight",
        "inventory.description",
        "inventory.unit",
        "inventory.dateReceived",
        "receivedBy.id",
        "receivedBy.firstName",
        "receivedBy.lastName",
        "inventory.image",
      ])
      .getMany();

    const items = querriedItems.map((item) => {
      if (item.images) {
        const imageString = getImageBase64(item.images[0], process.env.SECRET_KEY!);
        (item.images as any) = imageString;
      }
      return item;
    });

    const res = { passed: true, items: items };
    return res;
  });

  ipcMain.handle("inventory:get-item-data", async (_event, id) => {
    try {

      if (!id) return { passed: false, message: "Failed. Provide the id", itemData: []}

      const dbItem = await inventoryItemRepository.findOneBy({ id: id })
      const currentStock = dbItem?.transactions.reduce((acc: number, transaction: InventoryTransaction) => {
        if (transaction.updateType === "allocation") {
          return acc - transaction.quantity
        } else if (transaction.updateType === "restock") {
          return acc + transaction.quantity
        }

        return acc
      }, 0)
      return { passed: true, itemData: {currentStock: currentStock, item: dbItem} }
    } catch (err) {
      console.error(err)
      return { passed: false, message: "Encountered an error while geting data", itemData: []}
    }
  })

  ipcMain.handle("inventory:add-item", async (_event, itemData) => {
    try {
      const {
        name,
        category,
        quantity,
        unitWeight,
        unit,
        location,
        zone,
        minStock,
        maxStock,
        description,
        batchNumber,
        origin,
        images,
      } = itemData;

      if (!user) return {passed: false, message: "Please ensure you are logged in!"}
      const clerk = await clerkRepository.findOneBy({ id: user.id });

      const inventoryItem = new InventoryItem();
      inventoryItem.itemName = name;
      inventoryItem.category = category;
      inventoryItem.unit = unit;
      inventoryItem.unitWeight = Number(unitWeight);
      inventoryItem.description = description;
      inventoryItem.dateReceived = new Date();
      inventoryItem.location = location;
      inventoryItem.zone = zone;
      inventoryItem.minStock = minStock;
      inventoryItem.maxStock = maxStock;
      inventoryItem.supplier = origin;
      inventoryItem.batchNumber = batchNumber;
      (inventoryItem.receivedBy as Clerk | null) = clerk;
      // Save the images and get the image strings
      if (images.data.length > 0) {
        let imagesArray: string[] = [];
        images.data.forEach((image: any) => {
          const imageString = saveFile({data: image}, "Inventory/images");
          imagesArray.push(imageString);
        });
        inventoryItem.images = imagesArray.join(";");
      }

      const inventoryTransaction = new InventoryTransaction
      inventoryTransaction.item = inventoryItem;
      inventoryTransaction.note = "Initial Stock"
      inventoryTransaction.quantity = quantity
      inventoryTransaction.updateType = "allocation"
      inventoryTransaction.updatedAt = new Date();
      (inventoryTransaction.clerk as Clerk | null) = clerk

      await inventoryItemRepository.save(inventoryItem);
      await inventoryTransactionRepository.save(inventoryTransaction)
      const res = { passed: true, message: "Inventory added successfully" };
      return res;
    } catch (err) {
      console.error(err);
      const res = { passed: false, message: "Failed. Try again", error: err };
      return res;
    }
  });

  ipcMain.handle("inventory:stock-update", async (_event, itemData) => {
    try {
      const allowedActions = ["restock", "allocate"]
      const { itemId, quantity, action, note, clerkId} = itemData;

      if (!allowedActions.includes(action)) {
        return {passed: false, message: "Only restock and allocate action permitted"}
      }
      const clerk = await clerkRepository.findOneBy({id: Number(clerkId)})
      const inventoryItem = await inventoryItemRepository.findOneBy({id: Number(itemId)})

      if (!clerk) return { passed: false, message: "You should be logged in as a clerk"};

      const inventoryTransaction = new InventoryTransaction;
      inventoryTransaction.quantity = quantity;
      inventoryTransaction.note = note;
      inventoryTransaction.updateType = action;
      inventoryTransaction.updatedAt = new Date();
      (inventoryTransaction.clerk as Clerk | null) = clerk;
      (inventoryTransaction.item as InventoryItem | null) = inventoryItem;

      await inventoryTransactionRepository.save(inventoryTransaction)
      return { passed: true, message: "Transaction successfull" };
    } catch (err) {
      console.error(err);
      return { passed: false, message: "Failed to update item", error: err };
    }
  });

  ipcMain.handle("inventory:remove", async (_event, itemId) => {
    try {
      const item = await inventoryItemRepository.findOneBy({ id: itemId });
  
      if (!item) {
        return { passed: false, message: "Item not found" };
      }
  
      await inventoryItemRepository.remove(item);
      return { passed: true, message: "Item removed successfully" };
    } catch (err) {
      console.error(err);
      return { passed: false, message: "Failed to remove item", error: err };
    }
  });
}

