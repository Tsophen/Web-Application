import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "../components/Layout";

import { pbkdf2 } from "crypto";

import { Endpoints } from "../config/global";
// TODO: save tokens
import execute from "../config/requester";

import EventButton from "../components/Button/EventButton";
import IconInput from "../components/IconInput/IconInput";

import { Sizes, Styles, Types } from "../components/Button/Button";

import styles from "../styles/LogIn.module.css";

interface props {}

const SignUp: React.FC<props> = () => {
  const location = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({ message: "", focus: [] as string[] });
  const [success, setSuccess] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);


  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if(email.length === 0 || password.length === 0)
      return setError({ message: "Please fill all required fields", focus: ["email", "name", "password", "confirm"] });

    /** Disabling the login button, resetting the error & success fields */
    setDisableButton(true);
    setError({ message: "", focus: [] });
    setSuccess("");

    /** Hashing the password with 100,000 iterations to get the encryptionKey, then another signle iteration to get the vaultKey */
    pbkdf2(email + password, email, 100000, 64, "sha512", async (err, derivedKey) => {
      if(err)
        throw err;

      const encryptionKey = derivedKey.toString("hex");

      pbkdf2(encryptionKey, password, 1, 64, "sha512", async (err, derivedKey) => {
        if(err)
          throw err;

        const vaultKey = derivedKey.toString("hex");
  
        const body = JSON.stringify({
          email: email,
          password: vaultKey + ""
        });

        /** Executing the request, enabling the button and if we had success, setting the token & redirecting the user to the dashboard page */
        const response = await execute(Endpoints.auth.accessToken.link, Endpoints.auth.accessToken.method, undefined, body);
        setDisableButton(false);

        if(!response)
          return setError({ message: "Could not communicate with the server!", focus: [] });

        const data = await response.json();
        if(!response.ok)
          return setError({ message: data.message, focus: [] });

        // Tokens.accessToken = data.data.accessToken;
        setSuccess(data.message + ". Redirecting...");
        setTimeout(() => location.push("/dashboard"), 2000);
      });
    });
  }

  return (
    <Layout title="Log In | Brand Name">
      <section className={ styles.login }>
        <div className={ styles.loginWrapper }>

          <div className={ styles.from }>
            <form id="login-form">

              <IconInput startSvgSource="icons/mail.svg" onChange={ handleEmailChange } inputType="email" inputId="email" inputPlaceholder="Email Address" />
              <IconInput startSvgSource="icons/lock.svg" onChange={ handlePasswordChange } inputType="password" inputId="password" inputPlaceholder="Master Password" />

              <p className={`error ${error.message.length === 0 ? "hidden" : ""}`}>{ error.message }</p>
              <p className={`success ${success.length === 0 ? "hidden" : ""}`}>{ success }</p>

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

export default SignUp;