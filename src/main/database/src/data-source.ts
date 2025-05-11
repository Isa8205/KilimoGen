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

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  synchronize: true,
  logging: false,
  entities: [
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
  ],
  migrations: [],
  subscribers: [],
});
