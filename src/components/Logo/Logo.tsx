import Link from "next/link";

import styles from "./Logo.module.css";

interface props {
  color?: string
}

const Logo: React.FC<props> = ({ color }) => {
  return (
    <Link href="/">
      <a className={styles.logo_container}>
        <h1 className={styles.logo} style={color ? { color: color } : {}}>Start<span>Up</span></h1>
      </a>
    </Link>
  )
}

export default Logo;