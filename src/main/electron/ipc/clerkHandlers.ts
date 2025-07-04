import "dotenv/config";
import { AppDataSource } from "@/main/database/src/data-source";
import { ipcMain } from "electron";
import fs from "fs";
import fileEncryption from "@/main/utils/fileEncryption";
import { User } from "@/main/database/src/entities/auth/User";

const registerClerkHandlers = (app: Electron.App) => {
  const userRepository = AppDataSource.getRepository(User)

  ipcMain.handle("clerks:get-all", async () => {
    try {
      const clerks = await userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .select([
        "user.id",
        "user.firstName",
        "user.lastName",
        "user.email",
        "user.avatar",
        "user.phone"
      ])
      .where("role.name = :roleName", {roleName: "Clerk"})
      .getMany()

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
};

export default registerClerkHandlers