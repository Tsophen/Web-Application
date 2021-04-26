import Layout from "../components/Layout";

import { __brand__ } from "../config/global";

import styles from "../styles/404.module.css";

const NotFound = () => {
  return (
    <Layout title={ `404 - ${__brand__}` }>
      <section className={ styles.notFound }>
        <div className={ styles.text }>
          <h1 className={ styles.title }>Oops!</h1>
          <h2 className={ styles.subTitle }>We couldn't find the page you were looking for :(</h2>
        </div>
      </section>
    </Layout>
  )
}
  
export default NotFound;