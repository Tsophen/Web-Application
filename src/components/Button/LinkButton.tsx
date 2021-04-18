import Link from "next/link";

import props, { Styles, Types, Sizes } from "./Button";

import styles from "./Button.module.css";

const LinkButton: React.FC<props> = ({ children, href, buttonStyle = Styles.SOLID, buttonType = Types.ROUNDED, buttonSize = Sizes.SMALL }) => {
  return (
    <Link href={ (href ? href : "") }>
      <a className={ styles.btn + " " + buttonStyle.cssClass + " " + buttonType.cssClass + " " + buttonSize.cssClass }>
        { children }
      </a>
    </Link>
  )
}

export default LinkButton;
