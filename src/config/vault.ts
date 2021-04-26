import crypto from "crypto";

const encryptionAlgorithm = "aes-256-ctr";

export enum VaultItemType {
  VAULT,
  NOTE
}

export interface EncryptedVault {
  iv: string
  content: string
}

export interface DecryptedVault {
  vault: Object[]
  notes: Object[]
  documents: Object[]
};

const encrypt = (data: DecryptedVault, encryptionKey: string): EncryptedVault => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex")
  }
}

const decrypt = (data: EncryptedVault, encryptionKey: string): DecryptedVault => {
  try {
    const decipher = crypto.createDecipheriv(encryptionAlgorithm, encryptionKey, Buffer.from(data.iv, "hex"));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(data.content, "hex")), decipher.final()]);
  
    return JSON.parse(decrpyted.toString());
  } catch(exception) {
    return { vault: [], notes: [], documents: [] };
  }
}

export { encrypt, decrypt }