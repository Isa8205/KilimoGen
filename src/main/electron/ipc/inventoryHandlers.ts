import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
import { InventoryTransaction } from "@/main/database/src/entities/InventoryTransaction";
import getSessionUser from "@/main/electron/session/getSessionUser";
import { getImageBase64 } from "@/main/utils/getImageBase64";
import { saveFile } from "@/main/utils/saveFile";
import { ipcMain } from "electron";

export default function registerInventoryHandlers(app: Electron.App, currentUser: any) {
  const inventoryItemRepository = AppDataSource.getRepository(InventoryItem);
  const clerkRepository = AppDataSource.getRepository(Clerk)
  const inventoryTransactionRepository = AppDataSource.getRepository(InventoryTransaction)

  ipcMain.handle("get-inventory", async (_event) => {
    const querriedItems = await inventoryItemRepository.find({relations: ['receivedBy', 'transactions']})

    const items = querriedItems.map((item) => {
      if (item.images) {
        const imageList = item.images.split(";");
        const imageString = getImageBase64(imageList[0], process.env.SECRET_KEY!);
        if (imageString) {
          (item.images as any) = imageString
        }
      }

      if (item.transactions) {
        const currentQuantity = item.transactions.reduce((acc: number, transaction: InventoryTransaction) => {
          if (transaction.updateType === "restock") {
            return acc + transaction.quantity
          } else if (transaction.updateType === "allocation") {
            return acc - transaction.quantity
          }
          return acc
        }, 0)

        if (currentQuantity) item.currentQuantity = currentQuantity;
      }
      return item;
    });

    const res = { passed: true, items: items };
    return res;
  });

  ipcMain.handle("inventory:get-item-data", async (_event, id) => {
    try {

      if (!id) return { passed: false, message: "Failed. Provide the item id", itemData: []}

      const fetchResult = await inventoryItemRepository
        .createQueryBuilder("item")
        .leftJoinAndSelect("item.receivedBy", "receivedBy")
        .leftJoinAndSelect("item.transactions", "transaction")
        .leftJoin("transaction.clerk", "transactionReceivedBy")
        .addOrderBy("transaction.updatedAt", "DESC")
        .select([
          "item.id",
          "item.itemName",
          "item.category",
          "item.unit",
          "item.location",
          "item.zone",
          "item.origin",
          "item.minStock",
          "item.maxStock",
          "item.description",
          "item.unitWeight",
          "item.dateReceived",
          "receivedBy.firstName",
          "receivedBy.lastName",

          "transaction.id",
          "transaction.note",
          "transaction.quantity",
          "transaction.updatedAt",
          "transaction.updateType",

          "transactionReceivedBy.id",
          "transactionReceivedBy.firstName",
          "transactionReceivedBy.lastName",
        ])
        .where("item.id = :id", { id: Number(id) })
        .getOneOrFail()
        
        if (fetchResult?.images) {
          const imageList = fetchResult.images.split(";");
          const imageString = imageList.map((image) => getImageBase64(image, process.env.SECRET_KEY!));
          if (imageString) {
            (fetchResult.images as any) = imageString;
          }
        }
        if (fetchResult?.transactions) {
          const currentStock = fetchResult.transactions.reduce((acc: number, transaction: InventoryTransaction) => {
            if (transaction.updateType === "restock") {
              return acc + transaction.quantity
            } else if (transaction.updateType === "allocation") {
              return acc - transaction.quantity
            }
            return acc
          }, 0)
          fetchResult.currentQuantity = currentStock;
        }

      return { passed: true, item: fetchResult }
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

      if (!currentUser) return {passed: false, message: "Please ensure you are logged in!"}
      const clerk = await clerkRepository.findOneBy({ id: currentUser.id });

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
      inventoryItem.origin = origin;
      inventoryItem.batchNumber = batchNumber;
      (inventoryItem.receivedBy as Clerk | null) = clerk;
      // Save the images and get the image strings
      if (images.length > 0) {
        let imagesArray: string[] = [];
        images.forEach((image: any) => {
          const imageString = saveFile(image, "Inventory/images");
          imagesArray.push(imageString);
        });
        inventoryItem.images = imagesArray.join(";");
      }

      const inventoryTransaction = new InventoryTransaction
      inventoryTransaction.item = inventoryItem;
      inventoryTransaction.note = "Initial Stock"
      inventoryTransaction.quantity = quantity
      inventoryTransaction.updateType = "restock";
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
      const allowedActions = ["restock", "allocation"]
      const { itemId, quantity, updateType, updateReason} = itemData;

      if (!allowedActions.includes(updateType)) {
        return {passed: false, message: "Only restock and allocate action permitted"}
      }

      if (!currentUser) return { passed: false, message: "You should be logged in as a clerk"};

      const inventoryTransaction = new InventoryTransaction;
      inventoryTransaction.quantity = quantity;
      inventoryTransaction.note = updateReason;
      inventoryTransaction.updateType = updateType;
      inventoryTransaction.updatedAt = new Date();
      (inventoryTransaction.clerk as any) = await clerkRepository.findOneBy({ id: currentUser.id });
      (inventoryTransaction.item as InventoryItem | null) = await inventoryItemRepository.findOneBy({ id: itemId });

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

