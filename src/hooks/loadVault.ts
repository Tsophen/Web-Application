import { AccessToken } from "../components/SessionComponent";

import { EncryptedVault } from "../config/vault";
import execute, { Endpoints } from "../config/requester";

import IHookResponse from "./HookResponse";
import checkAccessToken from "./checkAccessToken";

interface LoadVaultResponse extends IHookResponse {
  encryptedVault: EncryptedVault
}

/**
 * Loads a vault of a specific user through an Access Token
 * If the Access Token is not valid anymore, it generates a new one
 * 
 * @param accessToken      Access Token to use in the request
 * @param setAccessToken   A method to update the Access Token if the previous one was not valid anymore 
 * @returns                A Promise object resolved with the encrypted vault
 */
const loadVault = (accessToken: AccessToken): Promise<LoadVaultResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newAccessToken = (await checkAccessToken(accessToken)).accessToken;
      if(!newAccessToken) return reject();

      const headers = { "content-type": "application/json", "X-Token": `Bearer ${newAccessToken.accessToken}` };
      const response = await execute(Endpoints.users.vault.load.link, Endpoints.users.vault.load.method, { headers });
      if(!response || !response.ok) return reject();

      const data = await response.json();
      if(!data || !data.success) return reject();

      return resolve({ accessToken: newAccessToken, encryptedVault: data.data });
    } catch(exception) {
      return reject();
    }
  });
}

export default loadVault;