import { ipcMain, BrowserWindow } from "electron";

export const registerPrinterHandler = () => {
  ipcMain.handle("get-printers", async () => {
    try {
      const win = BrowserWindow.getFocusedWindow();
      if (!win) return [];
      return await win.webContents.getPrintersAsync();
    } catch (err) {
      console.error("Error getting printers:", err);
      return [];
    }
  });

  ipcMain.handle("test-print", async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;

    const receiptData =
      "Receipt\n" +
      "Item 1          $10.00\n" +
      "Item 2          $5.00\n" +
      "------------------\n" +
      "Total           $15.00\n" +
      "Thank you!\n\n";

    win.webContents.print(
      {
        silent: true,
        deviceName: "POS Printer 80250 Series",
        printBackground: true,
      },
      (success, failureReason) => {
        if (!success) {
          console.error("Failed to print receipt:", failureReason);
        } else {
          console.log("Receipt printed successfully!");
        }
      }
    );
  });
};
