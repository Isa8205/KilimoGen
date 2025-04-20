import fileEncryption from "@/main/utils/fileEncryption";
import fs from "fs";
export function getImageBase64(filePath: string, key: string): string | null {
  if (filePath) {
    const buffer = fs.readFileSync(filePath);
    const decryptedBuffer = fileEncryption.decryptFile(buffer, key);
    const bufferString = decryptedBuffer.toString("base64");

    return bufferString;
  }

  return null;
}
