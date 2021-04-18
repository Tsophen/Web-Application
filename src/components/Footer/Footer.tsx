import Link from "next/link";
import { useRouter } from "next/router";

import FooterColumnCopyright from "./FooterColumnCopyright/FooterColumnCopyright";
import FooterColumnMain from "./FooterColumnMain/FooterColumnMain";
import FooterColumn from "./FooterColumn/FooterColumn";

import styles from "./Footer.module.css";

interface props {}

const Footer: React.FC<props> = () => {
  let path = useRouter().pathname;

  return (
    <footer className={ styles.footer }>
      <div className={ styles.footerWrapper }>
        <div className={ styles.footerContainer }>
          <FooterColumnMain />

          <div className={ styles.placeholder }></div>

          <FooterColumn title="Explore">
            <ul>
              <li><Link href="/"><a className={ (path === "/" ? styles.active : "") }>Home</a></Link></li>
              <li><Link href="/packages"><a className={ (path === "/packages" ? styles.active : "") }>Packages </a></Link></li>
              <li><Link href="/downloads"><a className={ (path === "/downloads" ? styles.active : "") }>Downloads</a></Link></li>
              <li><Link href="/blog"><a className={ (path === "/blog" ? styles.active : "") }>Blog</a></Link></li>
              <li><Link href="/support"><a className={ (path === "/support" ? styles.active : "") }>Support</a></Link></li>
            </ul>
          </FooterColumn>
          <FooterColumn title="Social">
            <ul>
              <li><Link href="#"><a>Instagram</a></Link></li>
              <li><Link href="#"><a>Twitter</a></Link></li>
              <li><Link href="#"><a>LinkedIn</a></Link></li>
            </ul>
          </FooterColumn>
          <FooterColumn title="Legal">
            <ul>
              <li><Link href="#"><a>Terms of Service</a></Link></li>
              <li><Link href="#"><a>Privacy Policy</a></Link></li>
              <li><Link href="#"><a>Cookie Preferences</a></Link></li>
            </ul>
          </FooterColumn>
          <FooterColumn title="How We Work">
            <ul>
              <li><Link href="#"><a>Overview</a></Link></li>
            </ul>
          </FooterColumn>

          <FooterColumnCopyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
