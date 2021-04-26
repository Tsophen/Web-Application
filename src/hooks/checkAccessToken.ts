import { AccessToken } from "../components/SessionComponent";

import IHookResponse from "./IHookResponse";
import getAccessToken from "./getAccessToken";

interface CheckAccessTokenResponse extends IHookResponse {}

/**
 * Checks an Access Token and if it has expired, generates a new one
 * 
 * @param accessToken   Access Token to check
 * @returns             Promise
 */
const checkAccessToken = async (accessToken: AccessToken): Promise<CheckAccessTokenResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      if(accessToken.expires > Date.now()) 
        return resolve({ accessToken});
      
      accessToken = (await getAccessToken()).accessToken;

      return resolve({ accessToken });
    } catch(exception) {
      return reject();
    }
  });
}

export default checkAccessToken;