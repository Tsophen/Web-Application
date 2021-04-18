import React from "react";

import props, { Styles, Types, Sizes } from "./Button";

import styles from "./Button.module.css";

const EventButton: React.FC<props> = ({ children, onClick, buttonStyle = Styles.SOLID, buttonType = Types.ROUNDED, buttonSize = Sizes.SMALL, disabled = false }) => {
  return (
    <button className={ styles.btn + " " + buttonStyle.cssClass + " " + buttonType.cssClass + " " +  buttonSize.cssClass + " " + (disabled ? "disabled" : "") } onClick={ (onClick ? onClick : undefined) } disabled={ disabled }>
      { children }
    </button>
  )
}

export default EventButton;