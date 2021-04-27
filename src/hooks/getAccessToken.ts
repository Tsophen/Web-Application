import { AccessToken } from "../components/SessionComponent";

import execute, { Endpoints } from "../config/requester";

import IHookResponse from "./IHookResponse";

interface GetAccessTokenResponse extends IHookResponse {}

/**
 * Generate an Access Token using the refresh token cookie
 * 
 * @returns   Returns an Access Token object
 */
const getAccessToken = (): Promise<GetAccessTokenResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await execute(Endpoints.auth.refreshToken.link, Endpoints.auth.refreshToken.method, { mode: "cors", credentials: "include" });
      if(!response || !response.ok) return reject();
      
      let data = await response.json();
      if(!data || !data.success) return reject();

      const accessToken: AccessToken = data.data.accessToken;

      return resolve({ accessToken });
    } catch(exception) {
      return reject();
    }
  });
}

export default getAccessToken;