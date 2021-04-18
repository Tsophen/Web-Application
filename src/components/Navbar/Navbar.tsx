import { useEffect, useState } from "react"
import { useRouter } from "next/router";

import Logo from "../Logo/Logo";
import NavbarMenu from "./NavbarMenu/NavbarMenu";
import NavbarMenuIcon from "./NavbarMenuIcon/NavbarMenuIcon";

import styles from "./Navbar.module.css";

interface props {}

const Navbar: React.FC<props> = () => {
  const [menuToggled, setMenuToggled] = useState(false);
  const location = useRouter();

  // Function to toggle the menu on/off for mobile layouts
  const toggleMenu = () => setMenuToggled(!menuToggled);

  // Toggling off the menu whenever the current location changes
  useEffect(() => setMenuToggled(false), [location]);
  
  return (
    <header className={styles.header}>
      <div className={styles.navbarWrapper}>
        <div className={styles.navbarContainer}>
          <Logo />

          <NavbarMenu toggled={ menuToggled } />

          <NavbarMenuIcon toggled={ menuToggled } toggleMenu={ toggleMenu } />
        </div>
      </div>
    </header>
  )
}

export default Navbar;