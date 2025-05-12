import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
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
        "inventory.productName",
        "inventory.category",
        "inventory.quantity",
        "inventory.description",
        "inventory.weight",
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

  ipcMain.handle("add-inventory", async (_event, itemData) => {
    try {
      const {
        productName,
        category,
        quantity,
        description,
        weight,
        dateReceived,
        image,
      } = itemData;

      const inventoryRepository = AppDataSource.getRepository(InventoryItem);
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerk = await clerkRepository.findOneBy({ id: 1 });

      const inventory = new InventoryItem();
      inventory.productName = productName;
      inventory.category = category;
      inventory.quantity = parseInt(quantity);
      inventory.description = description;
      inventory.weight = weight;
      inventory.dateReceived = new Date(dateReceived);
      (inventory.receivedBy as Clerk | null) = clerk;
      image.data.length > 0 &&
        (inventory.image = saveFile(image, "Inventory/images"));

      await inventoryRepository.save(inventory);
      const res = { passed: true, message: "Inventory added successfully" };
      return res;
    } catch (err) {
      console.error(err);
      const res = { passed: false, message: "Failed. Try again", error: err };
      return res;
    }
  });
}
