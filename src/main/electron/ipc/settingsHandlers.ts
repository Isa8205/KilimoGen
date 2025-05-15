import { ipcMain } from "electron";
import path from "path";
import fs from "fs";

const defaultSettings = {
  general: {
    theme: "light",
  },
  printing: {
    defaultReceiptPrinter: "",
    defaultReportPrinter: "",
  },
  farm: {
    currentSeason: "",
    currentHarvest: "",
  },
};


export default function registerSettingsHandlers(app: Electron.App) {
    const settingsDir = path.join(app.getPath("appData"), ".config", "settings");
    const settingsPath = path.join(settingsDir, "settings.json");

    ipcMain.handle("set-settings", (event, newSettings) => {
        try {
          const merged = {
            general: { ...defaultSettings.general, ...newSettings.general },
            printing: { ...defaultSettings.printing, ...newSettings.printing },
            farm: { ...defaultSettings.farm, ...newSettings.farm },
          };
      
          fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2), "utf-8");
          return { success: true };
        } catch (error) {
          console.error("Error saving settings:", error);
          return { success: false, error };
        }
      });
      
      ipcMain.handle("get-settings", () => {
        try {
      
          if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
          }
      
          if (!fs.existsSync(settingsPath)) {
            fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), "utf-8");
            return defaultSettings;
          }
      
          const data = fs.readFileSync(settingsPath, "utf-8");
      
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (error) {
            console.warn("Invalid settings file. Resetting to defaults.");
            fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), "utf-8");
            return defaultSettings;
          }
      
          const merged = {
            general: { ...defaultSettings.general, ...parsed.general },
            printing: { ...defaultSettings.printing, ...parsed.printing },
            farm: { ...defaultSettings.farm, ...parsed.farm },
          };
      
          return merged;
      
        } catch (error) {
          console.error("Error reading settings file:", error);
          return defaultSettings;
        }
      });
      
}
