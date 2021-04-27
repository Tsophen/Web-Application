import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";

import { __brand__ } from "../config/global";

import { PageStatus, HookStatus } from "../config/status";
import useSession, { onSessionFail, AccessToken } from "../hooks/useSession";
import { decrypt, DecryptedVault, EncryptedVault, VaultItemType } from "../hooks/useVault";

import loadVault from "../fetches/loadVault";
import updateVault from "../fetches/updateVault";

interface props {}

const Dashboard: React.FC<props> = () => {
  const location = useRouter();

  const {sessionStatus, encryptionKey, accessToken: sessionAccessToken} = useSession();

  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.LOADING);
  const [accessToken, setAccessToken] = useState<AccessToken | undefined>(undefined);

  const [encryptedVault, setEncryptedVault] = useState<EncryptedVault | undefined>(undefined);
  const [decryptedVault, setDecryptedVault] = useState<DecryptedVault | undefined>(undefined);

  if(sessionStatus === HookStatus.FAILED) {
    onSessionFail(location);
    return <></>;
  }

  useEffect(() => {
    if(sessionStatus === HookStatus.DONE) {
      setAccessToken(sessionAccessToken);
  
      const fetch = async () => {
        try {
          if(!sessionAccessToken || !encryptionKey) return onSessionFail(location);
  
          const loadVaultResponse = await loadVault(sessionAccessToken);
          const encryptedVault = loadVaultResponse.encryptedVault;
          const decryptedVault = decrypt(encryptedVault, encryptionKey);
  
          setAccessToken(loadVaultResponse.accessToken);
          setEncryptedVault(encryptedVault);
          setDecryptedVault(decryptedVault);

          setPageStatus(PageStatus.DONE);
        } catch(exception) {
          setPageStatus(PageStatus.FAILED);

          return onSessionFail(location);
        }
      }
  
      fetch();
    }
  }, [sessionStatus]);

  const insertItemToVault = async (item: object, type: VaultItemType) => {
    try {
      setPageStatus(PageStatus.SAVING);
  
      if(!encryptionKey || !accessToken || !decryptedVault) return onSessionFail(location);
        
      const newDecryptedVault: DecryptedVault = decryptedVault;
      switch(type) {
        case VaultItemType.VAULT:
          newDecryptedVault.vault.push(item);
          break;
      }
    
      const updateVaultResponse = await updateVault(encryptionKey, newDecryptedVault, accessToken);
      const encryptedVault = updateVaultResponse.encryptedVault;
  
      setEncryptedVault(encryptedVault);
      setAccessToken(updateVaultResponse.accessToken);
      setPageStatus(PageStatus.DONE);
    } catch(exception) {
      setPageStatus(PageStatus.FAILED);
        
      return onSessionFail(location);
    }
  }

  return (
    <Layout title={ `Dashboard - ${__brand__}` }>
      <section>
        {
          (pageStatus === PageStatus.LOADING || sessionStatus === HookStatus.LOADING) ?
            <h1>Loading...</h1>
          :
            (pageStatus === PageStatus.SAVING) ?
              <h1>Saving...</h1>
            :
              <>
                <button style={ { width: "100px", height: "100px", background: "red" } } onClick={ () => { decryptedVault && insertItemToVault({ name: "facebook" }, VaultItemType.VAULT); } }></button>
                <button style={ { width: "100px", height: "100px", background: "green" } } onClick={ () => console.log(encryptedVault) }></button>
                <button style={ { width: "100px", height: "100px", background: "yellow" } } onClick={ () => console.log(decryptedVault) }></button>
                <button style={ { width: "100px", height: "100px", background: "blue" } } onClick={ () => console.log(accessToken) }></button>
              </>
        }
      </section>
    </Layout>
  )
}

export default Dashboard;