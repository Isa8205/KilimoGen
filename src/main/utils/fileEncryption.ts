import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const normalizeKey = (key: string) => {
    return crypto.createHash('sha256').update(key).digest();
}

function encryptFile(data: Buffer, key: string): Buffer {
    const normlaizedKey = normalizeKey(key);
    const iv = crypto.randomBytes(16);  // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv(algorithm, normlaizedKey, iv);
    
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    
    // Return the IV + encrypted data (so we can decrypt it later)
    return Buffer.concat([iv, encrypted]);
  }

  function decryptFile(encryptedData: Buffer, key: string): Buffer {
    const normalizedKey = normalizeKey(key);  // Normalize the key to 32 bytes
    const iv = encryptedData.subarray(0, 16);   // Extract the IV from the first 16 bytes of the encrypted data
    const encryptedContent = encryptedData.subarray(16); // The rest is the encrypted content

    const decipher = crypto.createDecipheriv(algorithm, normalizedKey, iv);

    // Decrypt the data
    try {
        const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
        return decrypted;  // Return the decrypted data
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;  // Handle any decryption failures (wrong padding, etc.)
    }
}
export default {encryptFile, decryptFile}