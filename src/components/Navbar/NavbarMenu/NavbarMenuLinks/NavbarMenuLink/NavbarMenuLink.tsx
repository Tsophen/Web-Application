import Link from "next/link";

import styles from "./NavbarMenuLink.module.css";

interface props {
  children: string
  href: string
  active?: boolean
}

const NavbarMenuLink: React.FC<props> = ({ children, href, active }) => {
  return (
    <Link href={ href }>
      <a className={ styles.navbarMenuLink + (active ? " " + styles.active : "")}>
        { children }
      </a>
    </Link>
  )
}

export default NavbarMenuLink;