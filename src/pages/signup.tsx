import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { pbkdf2 } from "crypto";

import Layout from "../components/Layout";
import { Sizes, Styles, Types } from "../components/Button/Button";
import EventButton from "../components/Button/EventButton";
import IconInput from "../components/IconInput/IconInput";

import { socialLinks, __brand__ } from "../config/global";
import execute, { Endpoints } from "../config/requester";

import styles from "../styles/SignUp.module.css";

interface props {}

const SignUp: React.FC<props> = () => {
  const location = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirm, setConfirm] = useState("");
  const [reminder, setReminder] = useState("");

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [disableButton, setDisableButton] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const togglePassword = () => setPasswordHidden(!passwordHidden);
  const handleConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => setConfirm(event.target.value);
  const handleReminderChange = (event: React.ChangeEvent<HTMLInputElement>) => setReminder(event.target.value);

  useEffect(() => {
    if(location.query.error)
      setError(location.query.error.toString());
  }, []);

  const signup = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(undefined);
    setSuccess(undefined);
    
    if(email.length === 0 || name.length === 0 || password.length === 0 || confirm.length === 0)
      return setError("Please fill all required fields");
    else if(password !== confirm)
      return setError("Passwords do not match");
    else if(password === reminder)
      return setError("Your reminder cannot be equal to your password");

    /** Disabling the register button, resetting the error & success fields */
    setDisableButton(true);
    setError(undefined);
    setSuccess(undefined);

    /** Hashing the password with 100,000 iterations to get the encryptionKey, then another signle iteration to get the vaultKey */
    pbkdf2(email + password, email, 100000, 16, "sha512", async (err, derivedKey) => {
      if(err)
        throw err;

      const encryptionKey = derivedKey.toString("hex");

      pbkdf2(encryptionKey, password, 1, 16, "sha512", async (err, derivedKey) => {
        if(err)
          throw err;

        const vaultKey = derivedKey.toString("hex");
  
        const body = JSON.stringify({
          email: email,
          name: name,
          password: vaultKey + "",
          reminder: reminder
        });

        /** Executing the request, enabling the button and if we had success redirecting the user to the login page */
        const response = await execute(Endpoints.users.create.link, Endpoints.users.create.method, { body: body, mode: "cors" });

        setDisableButton(false);

        if(!response)
          return setError("Could not communicate with the server!");

        const data = await response.json();

        if(!response.ok)
          return setError(data.message);
        
        setSuccess(data.message + ". Redirecting...");
        location.push("/login");
      });
    });
  }

  return (
    <Layout title={ `Sign Up - ${__brand__}` }>
      <section className={ styles.signup }>
        <div className={ styles.signupWrapper }>

          <div className={ styles.info }>
            <h1>It's time to protect yourself.</h1>
            <div className={ styles.social }>
              <h3>Follow us on</h3>
              <div className={ styles.icons }>
                <a href={socialLinks.instagram}><img src="/icons/instagram.svg" alt="instagram-logo"/></a>
                <a href={socialLinks.twitter}><img src="/icons/twitter.svg" alt="twitter-logo"/></a>
              </div>
            </div>
          </div>

          <div className={ styles.form }>
            <form id="signup-form">

              <IconInput startSvgSource="icons/mail.svg" onChange={ handleEmailChange } inputType="email" inputId="email" inputPlaceholder="Email Address" />
              <IconInput startSvgSource="icons/user.svg" onChange={ handleNameChange } inputType="text" inputId="name" inputPlaceholder="Full Name" />
              <IconInput startSvgSource="icons/lock.svg" endSvgSource="icons/eye.svg" endSvgOnClick={ togglePassword } onChange={ handlePasswordChange } inputType={ passwordHidden ? "password" : "text" } inputId="password" inputPlaceholder="Master Password" />
              <IconInput startSvgSource="icons/check-square.svg" onChange={ handleConfirmChange } inputType="password" inputId="confirm" inputPlaceholder="Confirm Password" />
              <IconInput startSvgSource="icons/edit-3.svg" onChange={ handleReminderChange } inputType="text" inputId="reminder" inputPlaceholder="Password Reminder" />

              { error && <p className="error">{ error }</p> }
              { success && <p className="success">{ success }</p> }

              <EventButton onClick={ signup } buttonStyle={ Styles.SOLID } buttonType={ Types.ROUNDED } buttonSize={ Sizes.SMALL } disabled={ disableButton }>Sign Up</EventButton>
              <p>By completing this form, you agree to the <span><Link href="/terms"><a>Terms</a></Link></span> and <span><Link href="/privacy_policy"><a>Privacy Policy</a></Link></span>.</p>
            </form>
          </div>
          
        </div>
      </section>
    </Layout>
  )
}

export default SignUp;