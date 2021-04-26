import { ReactSVG } from "react-svg";

import styles from "./IconInput.module.css";

interface props {
  startSvgSource: string
  endSvgSource?: string
  startSvgOnClick?: () => void
  endSvgOnClick?: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  focus?: boolean
  inputType: string
  inputId: string
  inputPlaceholder: string
}

const IconInput: React.FC<props> = ({ startSvgSource, endSvgSource, startSvgOnClick, endSvgOnClick, onChange, focus, inputType, inputId, inputPlaceholder }) => {
  return (
    <div className={ styles.iconInput }>
      <ReactSVG className={ styles.start + (startSvgOnClick ? " " + styles.clickable : "") } src={ startSvgSource } onClick={ startSvgOnClick } />
      
      <input className={ focus ? "focus" : "" } onChange={ onChange } type={ inputType } id={ inputId } placeholder={ inputPlaceholder } />

      { endSvgSource && <ReactSVG className={ styles.end + (endSvgOnClick ? " " + styles.clickable : "") } src={ endSvgSource } onClick={ endSvgOnClick } /> }
    </div>
  )
}

export default IconInput;