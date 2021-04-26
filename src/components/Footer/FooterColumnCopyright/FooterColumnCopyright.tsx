import styles from "./FooterColumnCopyright.module.css";

interface props {}

const FooterColumnCopyright: React.FC<props> = () => {
  return (
    <div className={ styles.FooterColumnCopyright }>
      <h4>Icons made by <span><a href="https://feathericons.com/">Feather</a></span> under the <a href="https://github.com/feathericons/feather/blob/master/LICENSE">MIT</a> License.</h4>
      <h4>© 2021 <span>Tsophen</span>. All Rights Reserved.</h4>
    </div>
  )
}

export default FooterColumnCopyright;