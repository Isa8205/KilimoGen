import { AppDataSource } from "@/main/database/src/data-source";
import { Report } from "@/main/database/src/entities/Report";
import { ipcMain } from "electron";
import fs from "fs";
import path from "path";

export default function registerReportHandlers(app: Electron.App) {
    ipcMain.handle("report:get-all", async() => {
        try {
            const reportRepository = AppDataSource.getRepository(Report)
            const reports = await reportRepository.find()
            return {passed: true, reports: reports}
        } catch (err) {
            console.error("Error getting reports: ", err)
            return {passed: false, message: 'Failed to get reports. Try again', reports: []}
        }
    })

    ipcMain.handle("report:save-fs", async(event, id) => {
        try {
            const reportRepository = AppDataSource.getRepository(Report)
            const report = await reportRepository.findOneBy({id: id})
            if (!report) {
                return {passed: false, message: 'Report not found'}
            }
            const filePath = report.filePath
            if (!filePath) {
                return {passed: false, message: 'File path not found for the report'}
            }
            const documentsPath = path.join(app.getPath("documents"), 'Kilimogen', 'reports')
            // Ensure the directory exists
            await fs.promises.mkdir(documentsPath, { recursive: true });

            fs.copyFileSync(filePath, path.join(documentsPath, `${report.reportName.split('\/').pop()}.pdf`))
            return {passed: true, message: `Report saved successfully to ${documentsPath}`}
        } catch (err) {
            console.error("Error saving report: ", err)
            return {passed: false, message: 'Failed to save report. Try again'}
        }
    })
}