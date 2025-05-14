interface response {
  passed: boolean;
  message: string;
}

declare global {
  interface Window {
    api: {
      window: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
      }
    };
    electron: {
      invoke: (channel: string, data?: any) => promise<response>
    }
  }
}

export {};
