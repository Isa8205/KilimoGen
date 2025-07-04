import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { BrowserWindow, ipcMain } from "electron";
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
import { User } from "@/main/database/src/entities/auth/User";
import { Role } from "@/main/database/src/entities/auth/Role";
import fileEncryption from "@/main/utils/fileEncryption";
import path from "path";
import fs from "fs";

export const registerAuthHandlers = (currentUser: any, app: Electron.App) => {
  const userRepository = AppDataSource.getRepository(User);
  const roleRepository = AppDataSource.getRepository(Role);

  ipcMain.handle("check-session", async () => {
    try {
      const id: any = await getSessionCookie();
      const sessionRepository = AppDataSource.getRepository(Session);
      if (id) {
        const data: any = await sessionRepository.findOneBy({ id: id });
        const user = JSON.parse(data?.data)
        Object.assign(currentUser, user);        
        return {user: user, message: `Welcome back ${user.firstName}`}
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
      const fetchedUser = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.role", "role")
        .where("user.username = :username", { username: data.username })
        .orWhere("user.email = :email", { email: data.username })
        .getOne();

      const user = fetchedUser;
      const islegit = await bcrypt.compare(data.password, user!.password);

      if (islegit) {

        const userData = {
          id: user!.id,
          firstName: user!.firstName,
          lastName: user!.lastName,
          email: user!.email,
          username: user!.username,
          avatar: getImageBase64(user!.avatar, process.env.SECRET_KEY!),
          role: user?.role?.name
        };

        const token = uuidv4();
        createSession(token, userData);
        setSessionCookie(token);

        // Change the current-user object
        Object.assign(currentUser, userData);

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

  ipcMain.handle("auth:register-clerk", async (event, clerkData) => {
    try {
      const role = await roleRepository.findOneBy({name: "Clerk"})
      const filename = Date.now().toString();
      let profilePath = "";
      if (clerkData.avatar.data.length > 0) {
        const savePath = path.join(
          app.getPath("userData"),
          `uploads/data/Clerks`
        );
        const buffer = Buffer.from(clerkData.avatar.data);
        const encryptedBuffer = fileEncryption.encryptFile(buffer, process.env.SECRET_KEY!);
  
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }
  
        const filePath = path.join(savePath, `${filename}.png`);
        fs.writeFileSync(filePath, encryptedBuffer);
        profilePath = filePath;
      }
  
      // Hashing of the password
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(clerkData.password, saltRounds);

      const clerk = new User();
      clerk.firstName = clerkData.firstName;
      clerk.middleName = clerkData.middleName;
      clerk.lastName = clerkData.lastName;
      clerk.username = clerkData.username;
      clerk.email = clerkData.email;
      clerk.phone = clerkData.phone;
      clerk.gender = clerkData.gender;
      clerk.password = hashPassword;
      clerk.avatar = profilePath;
      clerk.role = role!

      await userRepository.save(clerk)

      return { message: "Clerk added successfully", passed: true };
    } catch (err) {
      console.log(err);
      return { message: "Failed to add clerk", passed: false };
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
