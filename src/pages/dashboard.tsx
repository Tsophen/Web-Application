import SessionComponent, { SessionComponentProps, SessionComponentState } from "../components/SessionComponent";
import Layout from "../components/Layout";

import { decrypt, DecryptedVault, EncryptedVault, VaultItemType } from "../config/vault";
import { __brand__ } from "../config/global";

import loadVault from "../hooks/loadVault";
import updateVault from "../hooks/updateVault";

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

      this.setState({ ...this.state, status: "loading" });

      if(!this.state.accessToken || !this.state.encryptionKey) return super.onFail();

      const loadVaultResponse = await loadVault(this.state.accessToken);
      const encryptedVault = loadVaultResponse.encryptedVault;
      const decryptedVault = decrypt(encryptedVault, this.state.encryptionKey);

      this.setState({ ...this.state, status: "done", accessToken: loadVaultResponse.accessToken, encryptedVault, decryptedVault });
    } catch(exception) {
      // return super.onFail();
    }
  }

  private async insertItemToVault(item: object, type: VaultItemType): Promise<EncryptedVault> {
    return new Promise(async (resolve, reject) => {
      try {
        this.setState({ ...this.state, status: "saving" });
  
        if(!this.state.encryptionKey || !this.state.accessToken || !this.state.decryptedVault) return super.onFail();
        
        const newDecryptedVault: DecryptedVault = this.state.decryptedVault;
        switch(type) {
          case VaultItemType.VAULT:
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
                  <button style={ { width: "100px", height: "100px", background: "red" } } onClick={ () => { this.state.decryptedVault && this.insertItemToVault({ name: "facebook" }, VaultItemType.VAULT); } }></button>
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