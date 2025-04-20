interface AppSettings {
    general: {
        theme: 'dark' | 'light'
    };
    farm: {
        currentSeason: string;
        currentHarvest: string;
    };
    printing: {
        defaultReceiptPrinter: string;
        defaultReportPrinter: string;
    }
}