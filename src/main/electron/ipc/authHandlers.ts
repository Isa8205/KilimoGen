import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { ipcMain } from "electron";
import bcrypt from "bcrypt";
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

export const registerAuthHandlers = (currentUser: any) => {

  ipcMain.handle("check-session", async () => {
    try {
      const id: any = await getSessionCookie();
      const sessionRepository = AppDataSource.getRepository(Session);
      if (id) {
        const data: any = await sessionRepository.findOneBy({ id: id });
        const user = JSON.parse(data?.data)
        Object.assign(currentUser, user);        return {user: user, message: `Welcome back ${user.firstName}`}
      }  else {
        return {user: false, message: 'No session available'}
      }
    } catch (err) {
      console.log("Error retreiving session: ", err);
    }
  });

  // --------------------------
  //  Clerk related logic
  // --------------------------
  ipcMain.handle("user-login", async (event, data) => {
    try {
      let role = "Clerk";
      let fetchedUser: Clerk[] | Manager[] | null = null;
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const managerRepository = AppDataSource.getRepository(Manager);

      fetchedUser = await clerkRepository.find({ where: { username: data.username } }) || await clerkRepository.find({ where: { email: data.email }});

      if (fetchedUser.length === 0) {
        fetchedUser = await managerRepository.find({ where: { username: data.username } }) || await managerRepository.find({ where: { email: data.email }});
        role = "Manager"
      }

      const user = fetchedUser[0];
      const islegit = await bcrypt.compare(data.password, user!.password);

      if (islegit) {

        const userData = {
          id: user!.id,
          firstName: user!.firstName,
          lastName: user!.lastName,
          email: user!.email,
          username: user!.username,
          avatar: getImageBase64(user!.avatar, process.env.SECRET_KEY!),
          role: fetchedUser[0] instanceof Clerk ? "Clerk" : "Manager",
        };

        const token = uuidv4();
        createSession(token, userData);
        setSessionCookie(token);

        return { message: "Login successfull", passed: islegit, user: userData };
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
