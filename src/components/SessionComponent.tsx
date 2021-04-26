import { useRouter } from "next/router";
import { Component } from "react";

import loadEncryptionKey from "../hooks/loadEncryptionKey";
import getAccessToken from "../hooks/getAccessToken";
import { Props, State } from "react-svg";

export default class SessionComponent<props extends SessionComponentProps, state extends SessionComponentState> extends Component<props, state> {
  constructor(props: props) {
    super(props);

    this.state = { ...super.state, status: "idle", encryptionKey: undefined, accessToken: undefined }
  }

  public onFail() {
    const location = useRouter();

    this.logOut(sessionStorage, document);
    location.push({ pathname: "/login", query: { error: "You must log in to access this resource!" } });
  }

  public logOut(sessionStorage: Storage, document: Document) {
    sessionStorage.removeItem("ek");
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  public async fetch(): Promise<void> {
    return new Promise(async(resolve, reject) => {
      try {
        this.setState({ ...this.state, status: "loading" });
  
        let encryptionKey = await loadEncryptionKey(sessionStorage);
        let accessToken = await getAccessToken();
  
        this.setState({ ...this.state, status: "done", encryptionKey: encryptionKey, accessToken: accessToken });
        return resolve();
      } catch(exception) {
        return reject();
      }
    });
  }

  public render() {
    return (<></>);
  }
}

export interface SessionComponentProps extends Props {}

export interface SessionComponentState extends State {
  status: string
  encryptionKey: string | undefined
  accessToken: AccessToken | undefined
}

export interface AccessToken {
  accessToken: string
  expires: number
}