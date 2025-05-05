import { AppDataSource } from "@/main/database/src/data-source";
import { ipcMain } from "electron";

ipcMain.handle("check-db", async () => {
    return AppDataSource.isInitialized;
  });