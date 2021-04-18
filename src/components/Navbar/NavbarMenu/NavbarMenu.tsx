import NavbarMenuLinks from "./NavbarMenuLinks/NavbarMenuLinks";
import NavbarMenuButtons from "./NavbarMenuButtons/NavbarMenuButtons";

import styles from "./NavbarMenu.module.css";

interface props {
  toggled: boolean
}

const NavbarMenu: React.FC<props> = ({ toggled }) => {
  return (
    <div className={styles.navbarMenuContainer + (toggled ? " " + styles.active : "") }>
      <NavbarMenuLinks />

      <NavbarMenuButtons loginButton={ true } signupButton={ true } />
    </div>
  )
}

export default NavbarMenu;