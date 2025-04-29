interface response {
  passed: boolean;
  message: string;
}

declare global {
  interface Window {
    api: {
      addClerk: (clerkData: any) => Promise<responseType>;
      addEvent: (eventData: any) => Promise<any>;
      checkDb: () => promise<any>;
      getPrinters: () => Promise<any>;
    };
    electron: {
      invoke: (channel: string, data?: any) => promise<response>
    }
  }
}

export {};
