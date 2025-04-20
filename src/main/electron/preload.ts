import { contextBridge, ipcRenderer } from 'electron';

// Custom Types
interface UserData {
  name: string;
  email: string;
}

interface ClerkData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profile: {
    name: string;
    data: ArrayBuffer;
  };
}

interface EventData {
  title: string;
  date: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  otherLocation?: string;
}

interface ClerkLoginResult {
  success: boolean;
  message: string;
  token?: string;
}

interface ClerkAddResult {
  message: string;
}

interface SessionData {
  name: string;
  email: string;
  profile: string;
}

contextBridge.exposeInMainWorld('electron', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke: (channel: string, data?: any) => ipcRenderer.invoke(channel, data)
  

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('api', {
  // Print related stuff
  getPrinters: (): Promise<Electron.PrinterInfo[]> => ipcRenderer.invoke('get-printers'),
  testPrint: (): Promise<void> => ipcRenderer.invoke('test-print'),

  // DB Check
  checkDb: (): Promise<boolean> => ipcRenderer.invoke('check-db'),

  // Users
  fetchUsers: (): Promise<UserData[]> => ipcRenderer.invoke('fetch-users'),
  addUsers: (userData: UserData): Promise<string> => ipcRenderer.invoke('add-users', userData),

  // Clerk management
  addClerk: (clerkData: ClerkData): Promise<void> => ipcRenderer.invoke('add-clerk', clerkData),
  onUploadResult: (callback: (result: ClerkAddResult) => void): void => {
    ipcRenderer.on('clerk-added', (_event, result) => callback(result));
  },

  // Login management
  clerkLogin: (clerkData: { email: string; password: string }): Promise<ClerkLoginResult> => ipcRenderer.invoke('clerk-login', clerkData),
  onClerkLogin: (callback: (result: ClerkLoginResult) => void): void => {
    ipcRenderer.on('login-status', (_event, result) => callback(result));
  },

  // Session validation
  validateSession: (cookie: string): Promise<SessionData> => ipcRenderer.invoke('check-session', cookie),

  // Events
  addEvent: (eventData: EventData): Promise<{ passed: boolean; message: string }> => ipcRenderer.invoke('add-event', eventData),
});
