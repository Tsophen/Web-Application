import styles from "./FooterColumn.module.css";

interface props {
  children: any
  title: string
}

const FooterColumn: React.FC<props> = ({ children, title }) => {
  return (
    <div className={ styles.footerColumn }>
      <h4 className={ styles.title }>{ title }</h4>
      { children }
    </div>
  )
}

export default FooterColumn;