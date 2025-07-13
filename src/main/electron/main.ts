// ------------------------
// 📁 Electron Main Process (TypeScript)
// ------------------------
import "reflect-metadata";
import dotenv from "dotenv";
import { app, BrowserWindow, ipcMain } from "electron";
import path, { join } from "path";
import fs from "fs";
import { AppDataSource } from "../database/src/data-source";
import registerClerkHandlers from "@/main/electron/ipc/clerkHandlers";
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
import registerAdvanceHandlers from "@/main/electron/ipc/advanceHandlers";
import registerReportHandlers from "@/main/electron/ipc/reportHandlers";
import registerAdminHandlers from "@/main/electron/ipc/adminHandlers";
import registerStoreHandlers from "@/main/electron/ipc/storeHandlers";

// Point the better-sqlite3 module to the correct path
// Only intercept better-sqlite3
import Module from "module";
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id: string) {
  if (id === "better-sqlite3") {
    const base = __dirname;
    const unpacked = base.includes("app.asar")
      ? base.replace("app.asar", "app.asar.unpacked")
      : base;

    const fullPath = path.join(
      unpacked,
      "../../../node_modules/better-sqlite3/build/Release/better_sqlite3.node"
    );

    if (fs.existsSync(fullPath)) {
      return require(fullPath);
    } else {
      console.warn(`Fallback failed: ${fullPath} not found`);
    }
  }
  return originalRequire.call(this, id);
};

dotenv.config();
const NODE_ENV = process.env.NODE_ENV;
const user: any = {};

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  await AppDataSource.initialize();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "assets/icon.ico"),
    frame: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  if (NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  // Window handlers
  ipcMain.handle("window-minimize", () => {
    mainWindow?.minimize();
  });
  ipcMain.handle("window-maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
      return false;
    }

    mainWindow?.maximize();
    return true;
  });
  ipcMain.handle("window-close", () => {
    mainWindow?.close();
  });
  // Register all the ipc handlers
  registerAuthHandlers(user, app);
  registerDeliveryHandlers(user);
  registerHarvestHandlers();
  registerSeasonHandlers();
  registerCalenderHandlers();
  registerClerkHandlers(app);
  registerFarmerHandlers();
  registerInventoryHandlers(app, user);
  registerPrinterHandlers(mainWindow);
  registerSettingsHandlers(app);
  registerNotificationHandlers();
  registerAdvanceHandlers();
  registerReportHandlers(app);
  registerAdminHandlers(app);
  registerStoreHandlers(user);
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

export { user };
