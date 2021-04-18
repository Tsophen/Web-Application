import React from "react"

import styles from "./NavbarMenuIcon.module.css";

interface props {
  toggled: boolean,
  toggleMenu: () => void
}

const NavbarMenuIcon: React.FC<props> = ({ toggled, toggleMenu }) => {
  return (
    <div className={ styles.navbarMenuIconContainer } onClick={ () => toggleMenu() }>
      <div className={ styles.navbarMenuIcon + (toggled ? " " + styles.active : "") }><div></div></div>
    </div>
  )
}

export default NavbarMenuIcon;