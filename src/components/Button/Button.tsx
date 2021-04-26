import styles from "./Button.module.css";

class CSSClass {
  public cssName: String;
  public cssClass: String;

  constructor(cssName: String, cssClass: String) {
    this.cssName = cssName;
    this.cssClass = cssClass;
  }
}

class Style extends CSSClass {}
class Type extends CSSClass {}
class Size extends CSSClass {}

interface StyleObject { [key: string]: Style }
interface TypeObject { [key: string]: Type }
interface SizeObject { [key: string]: Size }

const Styles: StyleObject = {
  SOLID: new Style("SOLID", styles.btnSolid),
  OUTLINE: new Style("OUTLINE", styles.btnOutline)
}

const Types: TypeObject = {
  NORMAL: new Type("NORMAL", ""),
  ROUNDED: new Type("ROUNDED", styles.btnRounded)
}

const Sizes: SizeObject = {
  SMALL: new Size("SMALL", styles.btnSmall),
  MEDIUM: new Size("MEDIUM", styles.btnMedium),
  LARGE: new Size("LARGE", styles.btnLarge)
}

interface props {
  children?: any
  onClick?: (event: React.FormEvent) => void
  href?: string
  buttonStyle?: Style
  buttonType?: Type
  buttonSize?: Size
  disabled?: boolean
}

export { Styles, Types, Sizes };
export default props;