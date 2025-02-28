// src/store/store.ts
import { atom } from "recoil";

// Session data 
export const sessionState = atom<{
  id?: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
} | null>({
  key: 'session',
  default: null,
});

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