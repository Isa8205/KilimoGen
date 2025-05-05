import { AppDataSource } from "@/main/database/src/data-source";
import { Notification } from "@/main/database/src/entities/Notification";
import { ipcMain } from "electron";

export default function registerNotificationHandlers() {
    ipcMain.handle("get-notifications", async() => {
        try {
            const notificationRepository = AppDataSource.getRepository(Notification)
            const notifications = notificationRepository.find()

            return {passed: true, data: notifications}
        } catch (err) {
            console.error("Error in notification: ", err)
            return {passed: false, message: 'Failed to get nofications. Try again', data: []}
        }
    })
}