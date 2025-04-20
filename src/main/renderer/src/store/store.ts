// src/store/store.ts
import { atom } from "recoil";

// Session data 
export const sessionState = atom<{
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  avatar?: string;
  role?: 'Admin' | 'Clerk' | 'Manager'
} | null>({
  key: 'session',
  default: null,
});

export const isAdminState = atom<boolean>({
  key: 'isadmin',
  default: false,
})

// Farmer data
export const farmersState = atom<{                  
    firstName: string;
    lastName: string;
    id: number;
    gender: string;
    phone: number;
    avatar: string;
    totalDeliveries: number;}[]>({
  key: 'farmer',
  default: [],
});