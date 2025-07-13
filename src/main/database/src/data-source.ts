import 'reflect-metadata'
import { Advance } from "@/main/database/src/entities/Advance";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { Delivery } from "@/main/database/src/entities/Delivery";
import { CalendarEvent } from "@/main/database/src/entities/Event";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { Harvest } from "@/main/database/src/entities/Harverst";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
import { Manager } from "@/main/database/src/entities/Manager";
import { Notification } from "@/main/database/src/entities/Notification";
import { Season } from "@/main/database/src/entities/Seasons";
import { Session } from "@/main/database/src/entities/Session";
import { DataSource } from "typeorm";
import { Report } from '@/main/database/src/entities/Report';
import { InventoryTransaction } from '@/main/database/src/entities/InventoryTransaction';
import { StorageFacility } from '@/main/database/src/entities/StorageFacility';
import { User } from '@/main/database/src/entities/auth/User';
import { Role } from '@/main/database/src/entities/auth/Role';
import { config } from 'dotenv';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

config();

const dbPath = path.join(app.getPath("userData"), "db")
// Ensure the directory exists
app.on('ready', () => {
  fs.mkdirSync(dbPath, { recursive: true });
});
const dbFilePath = path.join(dbPath, 'db.sqlite');

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbFilePath,
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  driver: require('better-sqlite3'),
  entities: [
    User,
    Role,
    Advance,
    Clerk,
    Delivery,
    CalendarEvent,
    Farmer,
    Harvest,
    InventoryItem,
    Notification,
    Season,
    Session,
    Manager,
    Report,
    InventoryTransaction,
    StorageFacility
  ],
  migrations: [],
  subscribers: [],
});
