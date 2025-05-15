import { AppSettings } from "@/types/appSettings"

const defaultSettings: AppSettings = {
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

const getSettings = (): AppSettings => {
    try {
        const raw = localStorage.getItem('userSettings');
        if (!raw) {
            localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
            return defaultSettings;
        }

        const parsed = JSON.parse(raw);

        // OPTIONAL: Merge with defaults to fill in any missing keys
        const merged: AppSettings = {
            general: { ...defaultSettings.general, ...parsed.general },
            printing: { ...defaultSettings.printing, ...parsed.printing },
            farm: { ...defaultSettings.farm, ...parsed.farm },
        };

        return merged;

    } catch (err) {
        console.warn("Failed to parse userSettings from localStorage. Resetting to defaults.", err);
        localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
        return defaultSettings;
    }
};

export {getSettings}