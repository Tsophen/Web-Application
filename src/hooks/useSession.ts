import { useEffect, useState } from "react";
import { NextRouter } from "next/router";

import { HookStatus } from "../config/status";

import getAccessToken from "../fetches/getAccessToken";
import loadEncryptionKey from "../fetches/loadEncryptionKey";

/**
 * A React hook to use a session
 * This hook loads an encryption key and an access token. If it fails, the function returns undefined & a status of FAILED.
 * 
 * @returns status of the session fetch, encryption key & access token 
 */
const useSession = () => {
  const [sessionStatus, setSessionStatus] = useState<HookStatus>(HookStatus.LOADING);
  const [encryptionKey, setEncryptionKey] = useState<string | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<AccessToken | undefined>(undefined);

  const fetchSession = async () => {
    try {
      let encryptionKey = await loadEncryptionKey(sessionStorage);
      let accessToken = (await getAccessToken()).accessToken;
  
      setEncryptionKey(encryptionKey);
      setAccessToken(accessToken);
      setSessionStatus(HookStatus.DONE);
    } catch(exception) {
      console.error(exception);
      setSessionStatus(HookStatus.FAILED);
    }HookStatus
  }

  useEffect(() => {
    fetchSession();
  }, []);

  return { sessionStatus, encryptionKey, accessToken }
}

/**
 * When a certain aspect of the session fails we log out the user and redirect them to the login page
 * 
 * @param location   NextRouter to use to redirect the user
 */
const onSessionFail = (location: NextRouter) => {
  logOut(sessionStorage, document);

  location.push({ pathname: "/login", query: { error: "You must log in to access this resource!" } });
}

/**
 * Logs out a user - deletes their encryption key & refresh token cookies
 * 
 * @param sessionStorage   Storage to use to delete the encryption key
 * @param document         Document to use to delete the refresh token
 */
const logOut = (sessionStorage: Storage, document: Document) => {
  sessionStorage.removeItem("ek");
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export interface AccessToken {
  accessToken: string
  expires: number
}

export default useSession;
export { onSessionFail, logOut };