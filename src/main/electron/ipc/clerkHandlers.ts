import "dotenv/config";
import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { ipcMain } from "electron";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import fileEncryption from "@/main/utils/fileEncryption";

const registerClerkHandlers = (app: Electron.App) => {
  ipcMain.handle("get-clerks", async () => {
    try {
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerks = await clerkRepository.find();

      const data = clerks.map((clerk) => {
        if (clerk.avatar) {
          const buffer = fs.readFileSync(clerk.avatar)
          const decryptedBuffer = fileEncryption.decryptFile(buffer, process.env.SECRET_KEY!)
          const imageBuffer = decryptedBuffer.toString("base64")
          return {...clerk, avatar: imageBuffer}
        }else {
          return clerk
        }
      })
      return data;
    } catch (err) {
      console.error("Error getting clerks:", err);
      return [];
    }
  })
  
  ipcMain.handle("add-clerk", async (event, clerkData) => {
    try {
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
        console.log("Saved the file here", filePath);
        profilePath = filePath;
      }
  
      // Hashing of the password
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(clerkData.password, saltRounds);
  
      const clerkRepository = AppDataSource.getRepository(Clerk);
      const clerk = new Clerk();
      clerk.firstName = clerkData.firstName;
      clerk.middleName = clerkData.middleName;
      clerk.lastName = clerkData.lastName;
      clerk.username = clerkData.username;
      clerk.email = clerkData.email;
      clerk.phone = clerkData.phone;
      clerk.gender = clerkData.gender;
      clerk.password = hashPassword;
      clerk.avatar = profilePath;
  
      const res = await clerkRepository.save(clerk);
      console.log(res);
      return { passed: true, message: "Clerk added successfully" };
    } catch (err) {
      console.log(err);
      return { passed: false, message: "Failed. Check details and try again" };
    }
  });
};

export default registerClerkHandlers