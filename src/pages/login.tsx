import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { pbkdf2 } from "crypto";

import Layout from "../components/Layout";
import { Sizes, Styles, Types } from "../components/Button/Button";
import EventButton from "../components/Button/EventButton";
import IconInput from "../components/IconInput/IconInput";

import { __brand__ } from "../config/global";
import { ErrorMessage } from "../config/Interfaces";
import execute, { Endpoints } from "../config/requester";

import styles from "../styles/LogIn.module.css";

interface props {}

const LogIn: React.FC<props> = () => {
  const location = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<ErrorMessage | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [disableButton, setDisableButton] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  useEffect(() => {
    if(location.query.error)
      setError({ message: location.query.error, focus: [] as string[] });
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setError(undefined);
    setSuccess(undefined);

    if(email.length === 0 || password.length === 0)
      return setError({ message: "Please fill all required fields", focus: ["email", "password"] });

    /** Disabling the login button, resetting the error & success fields */
    setDisableButton(true);
    setError({ message: "", focus: [] });
    setSuccess("");

    /** Hashing the password with 100,000 iterations to get the encryptionKey, then another signle iteration to get the vaultKey */
    pbkdf2(email + password, email, 100000, 16, "sha512", async (err, derivedKey) => {
      if(err)
        throw err;

      const encryptionKey = derivedKey.toString("hex");

      pbkdf2(encryptionKey, password, 1, 16, "sha512", async (err, derivedKey) => {
        if(err)
          throw err;

        const vaultKey = derivedKey.toString("hex");
        sessionStorage.setItem("ek", encryptionKey);
  
        const body = JSON.stringify({
          email: email,
          password: vaultKey + ""
        });

        /** Executing the request, enabling the button and if we had success, setting the token & redirecting the user to the dashboard page */
        const response = await execute(Endpoints.auth.login.link, Endpoints.auth.login.method, { body: body, mode: "cors", credentials: "include" });
        setDisableButton(false);

        if(!response)
          return setError({ message: "Could not communicate with the server!", focus: [] });

        const data = await response.json();
        if(!response.ok)
          return setError({ message: data.message, focus: [] });

        setSuccess(data.message + ". Redirecting...");
        location.push("/dashboard");
      });
    });
  }
  
  return (
    <Layout title={ `Log In - ${__brand__}` }>
      <section className={ styles.login }>
        <div className={ styles.loginWrapper }>

          <div className={ styles.form }>
            <form id="login-form">

              <IconInput startSvgSource="icons/mail.svg" focus={ error && error.focus.includes("email") } onChange={ handleEmailChange } inputType="email" inputId="email" inputPlaceholder="Email Address" />
              <IconInput startSvgSource="icons/lock.svg" focus={ error && error.focus.includes("password") } onChange={ handlePasswordChange } inputType="password" inputId="password" inputPlaceholder="Master Password" />

              { error && <p className="error">{ error.message }</p> }
              { success && <p className="success">{ success }</p> }

              <EventButton onClick={ login } buttonStyle={ Styles.SOLID } buttonType={ Types.ROUNDED } buttonSize={ Sizes.SMALL } disabled={ disableButton }>Log In</EventButton>

              <div className={ styles.options }>
                <div className={ styles.recover }>
                  <Link href="/recover"><a>Forgot Password?</a></Link>
                </div>
              </div>
            </form>
          </div>
          
          <div className={ styles.info }>
            <h1>Retrieve your encrypted data!</h1>
            <div className={ styles.social }>
              <h3>Follow us on</h3>
              <a href="https://facebook.com"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1365px-Facebook_f_logo_%282019%29.svg.png" alt="facebook-logo" /></a>
              <a href="https://instagram.com"><img src="https://i.pinimg.com/originals/43/85/a5/4385a5479214954fa9fab6f1a778623f.png" alt="instagram-logo" /></a>
              <a href="https://twitter.com"><img src="https://upload.wikimedia.org/wikipedia/he/thumb/a/a3/Twitter_bird_logo.svg/1200px-Twitter_bird_logo.svg.png" alt="twitter-logo"/></a>
            </div>
          </div>
          
        </div>
      </section>
    </Layout>
  )
}

export default LogIn;