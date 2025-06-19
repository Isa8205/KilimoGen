import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
import { InventoryTransaction } from "@/main/database/src/entities/InventoryTransaction";
import { getImageBase64 } from "@/main/utils/getImageBase64";
import { saveFile } from "@/main/utils/saveFile";
import { ipcMain } from "electron";

export default function registerInventoryHandlers(app: Electron.App) {
  ipcMain.handle("get-inventory", async (_event) => {
    const querriedItems = await AppDataSource.getRepository(InventoryItem)
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
      if (item.image) {
        const imageString = getImageBase64(item.image, process.env.SECRET_KEY!);
        (item.image as any) = imageString;
      }
      return item;
    });

    const res = { passed: true, items: items };
    return res;
  });

  ipcMain.handle("inventory:add-item", async (_event, itemData) => {
    try {
      const {
        itemName,
        category,
        quantity,
        description,
        image,
        unit,
        unitWeight,
        clerkId
      } = itemData;

      const inventoryRepository = AppDataSource.getRepository(InventoryItem);
      const inventoryTransactionRepository = AppDataSource.getRepository(InventoryTransaction)
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerk = await clerkRepository.findOneBy({ id: Number(clerkId) });

      const inventoryItem = new InventoryItem();
      inventoryItem.itemName = itemName;
      inventoryItem.category = category;
      inventoryItem.unit = unit;
      inventoryItem.unitWeight = "20ml"
      inventoryItem.description = description;
      inventoryItem.dateReceived = new Date();
      (inventoryItem.receivedBy as Clerk | null) = clerk;
      image.data.length > 0 && (inventoryItem.image = saveFile(image, "Inventory/images"));

      const inventoryTransaction = new InventoryTransaction
      inventoryTransaction.item = inventoryItem;
      inventoryTransaction.note = "Initial Stock"
      inventoryTransaction.quantity = quantity
      inventoryTransaction.updateType = "allocation"
      inventoryTransaction.updatedAt = new Date();
      (inventoryTransaction.clerk as Clerk | null) = clerk

      await inventoryRepository.save(inventoryItem);
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

      const inventoryTransactionRepository = AppDataSource.getRepository(InventoryTransaction);
      const intentoryItemRepository = AppDataSource.getRepository(InventoryItem)
      const clerkRepository = AppDataSource.getRepository(Clerk)
      const clerk = await clerkRepository.findOneBy({id: Number(clerkId)})
      const inventoryItem = await intentoryItemRepository.findOneBy({id: Number(itemId)})

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
}

ipcMain.handle("inventory:remove", async (_event, itemId) => {
  try {
    const inventoryRepository = AppDataSource.getRepository(InventoryItem);
    const item = await inventoryRepository.findOneBy({ id: itemId });

    if (!item) {
      return { passed: false, message: "Item not found" };
    }

    await inventoryRepository.remove(item);
    return { passed: true, message: "Item removed successfully" };
  } catch (err) {
    console.error(err);
    return { passed: false, message: "Failed to remove item", error: err };
  }
});
