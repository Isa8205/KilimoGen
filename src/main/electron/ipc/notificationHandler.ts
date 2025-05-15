import { AppDataSource } from "@/main/database/src/data-source";
import { Notification } from "@/main/database/src/entities/Notification";
import { ipcMain } from "electron";

export default function registerNotificationHandlers() {
    ipcMain.handle("get-notifications", async() => {
        try {
            const notificationRepository = AppDataSource.getRepository(Notification)
            const notifications = await notificationRepository.find()

            return {passed: true, notifications: notifications}
        } catch (err) {
            console.error("Error in notification: ", err)
            return {passed: false, message: 'Failed to get nofications. Try again', notifications: []}
        }
    })

    ipcMain.handle("notification:mark-as-read", async(event, id: string) => {
        try {
            const notificationRepository = AppDataSource.getRepository(Notification)
            const notification = await notificationRepository.findOneBy({id: parseInt(id)})
            if (notification) {
                notification.seen = true
                await notificationRepository.save(notification)
                return {passed: true, message: 'Notification marked as read'}
            } else {
                return {passed: false, message: 'Notification not found'}
            }
        } catch (err) {
            console.error("Error in notification: ", err)
            return {passed: false, message: 'Failed to mark notification as read. Try again'}
        }
    })
}