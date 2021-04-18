import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

type props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = "Brand Name" }: props) => (
  <>
    <Head>
      <title>{title}</title>

      <meta charSet="utf-8" />

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Navbar />
    {children}
    <Footer />
  </>
)

export default Layout
