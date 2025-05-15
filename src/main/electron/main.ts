// ------------------------
// 📁 Electron Main Process (TypeScript)
// ------------------------
import "reflect-metadata"
import dotenv from "dotenv";
import {
  app,
  BrowserWindow,
  ipcMain,
} from "electron";
import path from "path";
import url from "url";
import { AppDataSource } from "../database/src/data-source";
import registerClerkHandlers  from "@/main/electron/ipc/clerkHandlers";
import { registerAuthHandlers } from "@/main/electron/ipc/authHandlers";
import { registerFarmerHandlers } from "@/main/electron/ipc/farmerHandlers";
import registerDeliveryHandlers from "@/main/electron/ipc/deliveryHandler";
import registerHarvestHandlers from "@/main/electron/ipc/harvestHandlers";
import registerSeasonHandlers from "@/main/electron/ipc/seasonHandlers";
import registerNotificationHandlers from "@/main/electron/ipc/notificationHandler";
import { registerCalenderHandlers } from "@/main/electron/ipc/calendarHandler";
import registerInventoryHandlers from "@/main/electron/ipc/inventoryHandlers";
import { registerPrinterHandlers } from "@/main/electron/ipc/printHandlers";
import registerSettingsHandlers from "@/main/electron/ipc/settingsHandlers";


dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const NODE_ENV = process.env.NODE_ENV;

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(async () => {
  await AppDataSource.initialize();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "assets/icon.ico"),
    frame: false,
    titleBarStyle: "hidden", // For macOS
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      devTools: NODE_ENV === "development",
    },
  });

  if (NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../renderer/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Window handlers
  ipcMain.handle("window-minimize", () => {
    mainWindow?.minimize();
  });
  ipcMain.handle("window-maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize()
      return false
    }

    mainWindow?.maximize();
    return true
  });
  ipcMain.handle("window-close", () => {
    mainWindow?.close();
  });
  // Register all the ipc handlers
  registerAuthHandlers()
  registerDeliveryHandlers()
  registerHarvestHandlers()
  registerSeasonHandlers()
  registerCalenderHandlers()
  registerClerkHandlers(app)
  registerFarmerHandlers()
  registerInventoryHandlers(app)
  registerPrinterHandlers(mainWindow)
  registerSettingsHandlers(app)
  registerNotificationHandlers()
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});