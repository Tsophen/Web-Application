import Logo from "../../Logo/Logo";

import styles from "./FooterColumnMain.module.css";

interface props {}

const FooterColumnCopyright: React.FC<props> = () => {
  return (
    <div className={ styles.footerColumnMain }>
      <Logo color="#f8f8f2" />
      <h4 className={ styles.catchphrase }>The next generation of online privacy - fast, clean, secured.</h4>
    </div>
  )
}

export default FooterColumnCopyright;