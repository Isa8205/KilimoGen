import fileEncryption from "@/main/utils/fileEncryption";
import { app } from "electron";
import fs from "fs";
import path from "path";

export function saveFile(fileData: {type?: string, data: Uint8Array, name?: string}, saveDir: string): string {

      const filename = Date.now().toString();
      let profilePath = "";
        const savePath = path.join(
          app.getPath("userData"),
          `uploads/${saveDir}`
        );
        const buffer = Buffer.from(fileData.data);
        const encryptedBuffer = fileEncryption.encryptFile(buffer, process.env.SECRET_KEY!);
  
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath, { recursive: true });
        }
  
        const filePath = path.join(savePath, `${filename}.png`);
        fs.writeFileSync(filePath, encryptedBuffer);
        console.log("Saved the file here", filePath);
        profilePath = filePath;

        return profilePath
    }