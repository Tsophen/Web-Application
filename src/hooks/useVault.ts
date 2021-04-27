import { useEffect, useState } from "react";

import crypto from "crypto";

import { HookStatus } from "../config/status";
import { AccessToken } from "./useSession";

import loadVault from "../fetches/loadVault";

const encryptionAlgorithm = "aes-256-ctr";

const useVault = (accessToken: AccessToken, encryptionKey: string) => {
  const [vaultStatus, setVaultStatus] = useState<HookStatus>(HookStatus.LOADING);
  const [encryptedVault, setEncryptedVault] = useState<EncryptedVault | undefined>(undefined);
  const [decryptedVault, setDecryptedVault] = useState<DecryptedVault | undefined>(undefined);

  const fetchVault = async () => {
    try {
      if(!accessToken || !encryptionKey)
        return setVaultStatus(HookStatus.FAILED);

      const loadVaultResponse = await loadVault(accessToken);
      const encryptedVault = loadVaultResponse.encryptedVault;
      const decryptedVault = decrypt(encryptedVault, encryptionKey);

      accessToken = loadVaultResponse.accessToken;
      setEncryptedVault(encryptedVault);
      setDecryptedVault(decryptedVault);

      setVaultStatus(HookStatus.DONE);
    } catch(exception) {
      console.error(exception);
      setVaultStatus(HookStatus.FAILED);
    }
  }

  useEffect(() => {
    fetchVault();
  }, []);

  return { vaultStatus, encryptedVault, decryptedVault, accessToken }
}

/**
 * Encrypts a decrypted vault
 * 
 * @param vault           Vault to encrypt
 * @param encryptionKey   Encryption key to use
 * @returns               Encrypted vault
 */
const encrypt = (vault: DecryptedVault, encryptionKey: string): EncryptedVault => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(vault)), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex")
  }
}

/**
 * Decrypts an encrypted vault
 * 
 * @param vault           Vault to decrypt
 * @param encryptionKey   Encryption key to use
 * @returns               Decrypted vault
 */
const decrypt = (vault: EncryptedVault, encryptionKey: string): DecryptedVault => {
  try {
    const decipher = crypto.createDecipheriv(encryptionAlgorithm, encryptionKey, Buffer.from(vault.iv, "hex"));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(vault.content, "hex")), decipher.final()]);
  
    return JSON.parse(decrpyted.toString());
  } catch(exception) {
    return { vault: [], notes: [], documents: [] };
  }
}

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

export default useVault;
export { encrypt, decrypt }
