import { useRouter } from "next/router";

import NavbarMenuLink from "./NavbarMenuLink/NavbarMenuLink";

import styles from "./NavbarMenuLinks.module.css";

interface props {}

const NavbarMenuLinks: React.FC<props> = () => {
  let path = useRouter().pathname;

  return (
    <div className={ styles.navbarMenuLinks }>
      <ul>
        <NavbarMenuLink href="/" active={ path === "/" }>Home</NavbarMenuLink>
        <NavbarMenuLink href="/packages" active={ path === "/packages" }>Packages</NavbarMenuLink>
        <NavbarMenuLink href="/downloads" active={ path === "/downloads" }>Downloads</NavbarMenuLink>
        <NavbarMenuLink href="/blog" active={ path === "/blog" }>Blog</NavbarMenuLink>
        <NavbarMenuLink href="/support" active={ path === "/support" }>Support</NavbarMenuLink>
      </ul>
    </div>
  )
}

export default NavbarMenuLinks;
