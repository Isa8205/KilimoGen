import { ipcMain, BrowserWindow } from "electron";

export const registerPrinterHandlers = (win: Electron.BrowserWindow) => {
  ipcMain.handle("get-printers", async () => {
    try {
      if (!win) return [];
      return await win.webContents.getPrintersAsync();
    } catch (err) {
      console.error("Error getting printers:", err);
      return [];
    }
  });
};
