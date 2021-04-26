// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

import SessionComponent, { SessionComponentProps, SessionComponentState } from "../components/SessionComponent";
import Layout from "../components/Layout";

import { __brand__ } from "../config/global";
import { useEffect } from "react";
import { decrypt, DecryptedVault, EncryptedVault, VaultItemType } from "../config/vault";
import loadVault from "../hooks/loadVault";
import updateVault from "../hooks/updateVault";

// import Layout from "../components/Layout";

// import loadEncryptionKey from "../hooks/loadEncryptionKey";
// import getAccessToken from "../hooks/getAccessToken";
// import loadVault from "../hooks/loadVault";

// import { decrypt, DecryptedVault, EncryptedVault, VaultItemType } from "../config/vault";
// import { __brand__ } from "../config/global";
// import { AccessToken, logOut } from "../config/session";
// import updateVault from "../hooks/updateVault";

// const Dashboard = () => {
//   const location = useRouter();

//   const [status, setStatus] = useState<string>("idle");
  
//   const [accessToken, setAccessToken] = useState<AccessToken>();
//   const [encryptedVault, setEncryptedVault] = useState<EncryptedVault>();
//   const [decryptedVault, setDecryptedVault] = useState<DecryptedVault>();
//   const [encryptionKey, setEncryptionKey] = useState<string>();

//   const onFail = () => {
//     logOut(sessionStorage, document);
//     location.push({ pathname: "/login", query: { error: "You must log in to access this resource!" } });
//   }

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         setStatus("loading");
  
//         let encryptionKey = await loadEncryptionKey();
//         setEncryptionKey(encryptionKey);
  
//         let accessToken = await getAccessToken();
//         setAccessToken(accessToken);
  
//         let encryptedVault = await loadVault(accessToken.accessToken);
//         setEncryptedVault(encryptedVault);
//         setDecryptedVault(decrypt(encryptedVault, encryptionKey));
  
//         setStatus("done");
//       } catch(exception) {
//         return onFail();
//       }
//     }

//     fetch();
//   }, []);

//   const insertItemToVault = async (item: Object, type: VaultItemType) => {
//     try {
//       setStatus("saving");

//       if(!encryptionKey || encryptionKey === null || !accessToken || !decryptedVault) return setStatus("failed");
  
//       let newDecryptedVault: DecryptedVault | undefined = undefined;
  
//       if(type === VaultItemType.PASSWORD) {
//         newDecryptedVault = decryptedVault;
//         newDecryptedVault.vault.push(item);
  
//         setDecryptedVault(newDecryptedVault);
//       }
  
//       if(!newDecryptedVault) return setStatus("failed");
  
//       const newEncryptedVault = await updateVault(encryptionKey, accessToken, setAccessToken, newDecryptedVault);
  
//       setEncryptedVault(newEncryptedVault);

//       setStatus("done");
//     } catch(exception) {
//       setStatus("failed");
//     }
//   }

//   return (
//     <Layout title={ `Dashboard - ${__brand__}` }>
//       <section>
//         {
//           (status === "loading") ?
//             <h1>Loading...</h1>
//           :
//             (status === "saving") ?
//               <h1>Saving...</h1>
//             :
//               <>
//                 <button style={ { width: "100px", height: "100px", background: "red" } } onClick={ () => { decryptedVault && insertItemToVault({ name: "facebook" }, VaultItemType.PASSWORD); } }></button>
//                 <button style={ { width: "100px", height: "100px", background: "green" } } onClick={ () => console.log(encryptedVault) }></button>
//                 <button style={ { width: "100px", height: "100px", background: "yellow" } } onClick={ () => console.log(decryptedVault) }></button>
//                 <button style={ { width: "100px", height: "100px", background: "blue" } } onClick={ () => console.log(accessToken) }></button>
//               </>
//         }
//       </section>
//     </Layout>
//   )
// }

// export default Dashboard;

interface DashboardProps extends SessionComponentProps {}

interface DashboardState extends SessionComponentState {
  encryptedVault: EncryptedVault | undefined
  decryptedVault: DecryptedVault | undefined
}

export default class Dashboard extends SessionComponent<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);

    this.state = { ...super.state, encryptedVault: undefined, decryptedVault: undefined };
  }

  async componentDidMount() {
    try {
      await super.fetch();

      if(!this.state.accessToken || !this.state.encryptionKey) return super.onFail();

      this.setState({ ...this.state, status: "loading" });

      const loadVaultResponse = await loadVault(this.state.accessToken);
      const encryptedVault = loadVaultResponse.encryptedVault;
      const decryptedVault = decrypt(encryptedVault, this.state.encryptionKey);

      this.setState({ ...this.state, status: "done", accessToken: loadVaultResponse.accessToken, encryptedVault, decryptedVault });
    } catch(exception) {
      return super.onFail();
    }
  }

  private async insertItemToVault(item: object, type: VaultItemType): Promise<EncryptedVault> {
    return new Promise(async (resolve, reject) => {
      try {
        this.setState({ ...this.state, status: "saving" });
  
        if(!this.state.encryptionKey || !this.state.accessToken || !this.state.decryptedVault) return super.onFail();
        
        const newDecryptedVault: DecryptedVault = this.state.decryptedVault;
        switch(type) {
          case VaultItemType.PASSWORD:
            newDecryptedVault.vault.push(item);
            break;
        }
    
        const updateVaultResponse = await updateVault(this.state.encryptionKey, newDecryptedVault, this.state.accessToken);
        const encryptedVault = updateVaultResponse.encryptedVault;
  
        this.setState({ ...this.state, status: "done", encryptedVault, accessToken: updateVaultResponse.accessToken });

        return resolve(encryptedVault);
      } catch(exception) {
        this.setState({ ...this.state, status: "failed" });
        
        return reject();
      }
    });
  }

  public render() {
    return (

      // TODO:
      // if(accessToken):
      //   Layout (navbar-type: search [otherwise: menu])
      //   Buttons (Sing-out [otherwise: Log In, Sign Up])
      <Layout title={ `Dashboard - ${__brand__}` }>
        <section>
          {
            (this.state.status === "loading") ?
              <h1>Loading...</h1>
            :
              (this.state.status === "saving") ?
                <h1>Saving...</h1>
              :
                <>
                  <button style={ { width: "100px", height: "100px", background: "red" } } onClick={ () => { this.state.decryptedVault && this.insertItemToVault({ name: "facebook" }, VaultItemType.PASSWORD); } }></button>
                  <button style={ { width: "100px", height: "100px", background: "green" } } onClick={ () => console.log(this.state.encryptedVault) }></button>
                  <button style={ { width: "100px", height: "100px", background: "yellow" } } onClick={ () => console.log(this.state.decryptedVault) }></button>
                  <button style={ { width: "100px", height: "100px", background: "blue" } } onClick={ () => console.log(this.state.accessToken) }></button>
                </>
          }
        </section>
      </Layout>
    )
  }
}