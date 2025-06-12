import { AppDataSource } from "@/main/database/src/data-source";
import { Delivery } from "@/main/database/src/entities/Delivery";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
import { ipcMain } from "electron";

export default function registerAdminHandlers (app: Electron.App) {
    ipcMain.handle("admin:get-overview", async (event, data) => {
        const farmerRepository = AppDataSource.getRepository(Farmer)
        const deliveryRepository = AppDataSource.getRepository(Delivery)
        const inventoryRepository = AppDataSource.getRepository(InventoryItem)

        const overview = {
            farmers: await farmerRepository.count(),
            deliveries: await deliveryRepository.count(),
            inventory: await inventoryRepository.count(),
        }
        return { passed: true, data: overview };
    });
}