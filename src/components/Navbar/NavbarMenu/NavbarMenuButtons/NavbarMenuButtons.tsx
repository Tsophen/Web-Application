import { Styles, Types, Sizes } from "../../../Button/Button";
import LinkButton from "../../../Button/LinkButton";

import styles from "./NavbarMenuButtons.module.css";

interface props {
    loginButton?: boolean
    signupButton?: boolean
}

const NavbarMenuButtons: React.FC<props> = ({ loginButton, signupButton }) => {
    return (
        <div className={ styles.navbarMenuButtons }>
            { loginButton && <LinkButton href="/login" buttonStyle={ Styles.OUTLINE } buttonType={ Types.ROUNDED } buttonSize={ Sizes.SMALL }>Log In</LinkButton> }
            { signupButton && <LinkButton href="/signup" buttonStyle={ Styles.SOLID } buttonType={ Types.ROUNDED } buttonSize={ Sizes.SMALL }>Sign Up</LinkButton> }
        </div>
    )
}

export default NavbarMenuButtons;