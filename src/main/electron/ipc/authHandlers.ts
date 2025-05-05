import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { ipcMain, session } from "electron";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import fileEncryption from "@/main/utils/fileEncryption";
import { v4 as uuidv4 } from "uuid";
import { createSession, destroySession } from "@/main/electron/session/sessinStore";
import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/main/electron/session/cookieManager";
import { Session } from "@/main/database/src/entities/Session";
import { Manager } from "@/main/database/src/entities/Manager";
import { getImageBase64 } from "@/main/utils/getImageBase64";

export const registerAuthHandlers = () => {

  ipcMain.handle("check-session", async () => {
    try {
      const id: any = await getSessionCookie();
      const sessionRepository = AppDataSource.getRepository(Session);
      if (id) {
        const data: any = await sessionRepository.findOneBy({ id: id });
        const user = JSON.parse(data?.data)
        return {user: user, message: `Welcome back ${user.firstName}`}
      }  else {
        return {user: false, message: 'No session availabel'}
      }
    } catch (err) {
      console.log("Error retreiving session: ", err);
    }
  });

  // --------------------------
  //  Clerk related logic
  // --------------------------
  ipcMain.handle("clerk-login", async (event, data) => {
    try {
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerk =
        (await clerkRepository.findOneBy({ username: data.username })) ||
        (await clerkRepository.findOneBy({ email: data.email }));

      if (!clerk) {
        return { message: "The user was not found!", success: false };
      }

      const islegit = await bcrypt.compare(data.password, clerk.password);

      if (islegit) {

        const user = {
          id: clerk.id,
          firstName: clerk.firstName,
          lastName: clerk.lastName,
          email: clerk.email,
          avatar: getImageBase64(clerk.avatar, process.env.SECRET_KEY!),
          role: "clerk",
        };

        const token = uuidv4();
        createSession(token, user);
        setSessionCookie(token);

        return { message: "Login successfull", passed: islegit, user: user };
      } else {
        return {
          message: "Invalid details! Check and try again.",
          passed: islegit,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        message: "Encountered an error on logging in! Try again",
        passed: false,
      };
    }
  });

  ipcMain.handle("register-clerk", async (event, data) => {
    try {
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerk = clerkRepository.create(data);
      await clerkRepository.save(clerk);
      return { message: "Clerk added successfully", success: true };
    } catch (err) {
      console.log(err);
      return { message: "Failed to add clerk", success: false };
    }
  });
  // --------------------------
  // End Clerk related logic
  // --------------------------

  // --------------------------
  //  Admin related logic
  // --------------------------

  ipcMain.handle('manager-login', async (event, data) => {
    try {
      const managerRepository = AppDataSource.getRepository(Manager);
      const manager = await managerRepository.findOneBy({ email: data.email });

      if (!manager) {
        return { message: "The user was not found!", success: false };
      }

      const islegit = await bcrypt.compare(data.password, manager.password);
      if (islegit) {
        const token = uuidv4()
        const user = {
          firstName: manager.firstName,
          lastName: manager.lastName,
          email: manager.email,
          avatar: getImageBase64(manager.avatar, process.env.SECRET_KEY!),
          token: token,
        };

        return { message: "Login successfull", success: islegit, user: user };
      }

      return { message: "Login successfull", success: islegit };
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  ipcMain.handle("admin-register", async (event, data) => {
    try {
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerk = clerkRepository.create(data);
      await clerkRepository.save(clerk);
      return { message: "Clerk added successfully", success: true };
    } catch (err) {
      console.log(err);
      return { message: "Failed to add clerk", success: false };
    }
  });

  // --------------------------
  // End Admin related logic
  // --------------------------

  // --------------------------
  // Logout logic
  // --------------------------
  ipcMain.handle('logout', async() => {
    try {
      const id: any = await getSessionCookie()
      const sessionRepository = AppDataSource.getRepository(Session)
      if (id) {
        clearSessionCookie()
        destroySession(id)
        await sessionRepository.softDelete({id: id})
        return {passed: true, message: 'Logout successfull!'}
      }
    } catch (err) {
      console.error("Error logging out", err)
      return {passed: false, message: "Error during logout. Try again"}
    }
  })
};
