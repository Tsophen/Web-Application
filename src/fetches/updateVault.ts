import execute, { Endpoints } from "../config/requester";

import IFetchResponse from "./IFetchResponse";
import checkAccessToken from "./checkAccessToken";

import { AccessToken } from "../hooks/useSession";
import { DecryptedVault, encrypt, EncryptedVault } from "../hooks/useVault";

interface UpdateVaultResponse extends IFetchResponse {
  encryptedVault: EncryptedVault;
}

/**
 * Updates a vault of a specific user through an Access Token
 * If the Access Token is not valid anymore, it generates a new one
 * 
 * @param encryptionKey    Key to use to encrypt the vault
 * @param decryptedVault   Decrypted Vault to encrypt and then save
 * @param accessToken      Access Token to use in the request
 * @param setAccessToken   A method to update the Access Token if the previous one was not valid anymore
 * @returns                A Promise object resolved with the encrypted vault
 */
const updateVault = (encryptionKey: string, decryptedVault: DecryptedVault, accessToken: AccessToken): Promise<UpdateVaultResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!encryptionKey || encryptionKey === null || !accessToken) return reject();

      const encryptedVault = encrypt(decryptedVault, encryptionKey);

      const newAccessToken = (await checkAccessToken(accessToken)).accessToken;
      if(!newAccessToken) return reject();

      let headers = { "content-type": "application/json", "X-Token": `Bearer ${newAccessToken.accessToken}` };
      const body = JSON.stringify({ vault: encryptedVault });

      let response = await execute(Endpoints.users.vault.update.link, Endpoints.users.vault.update.method, { headers, body, credentials: "include" });
      if(!response || !response.ok) return reject();

      let data = await response.json();
      if(!data || !data.success) return reject();
      
      return resolve({ accessToken: newAccessToken, encryptedVault });
    } catch(exception) {
      return reject();
    }
  });
}

export default updateVault;