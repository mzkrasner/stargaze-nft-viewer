import { Mulish } from "next/font/google";
import "@/styles/globals.css";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/layout/Footer";
const font = Mulish({ subsets: ["latin"] });
import { type AppType } from "next/app";
import Head from "next/head";
import { EmbedChainInfos } from "@/utils/config";
import "@/styles/globals.css";
import { GrazProvider, configureGraz } from "graz";

const options = configureGraz({
  defaultChain: EmbedChainInfos[0],
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <GrazProvider grazOptions={options}>
      <main className={font.className}>
        <Head>
          <link rel="icon" href="/logo.png" />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:image" content="/logo.png" />
        </Head>
        <ThemeProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </ThemeProvider>
      </main>
    </GrazProvider>
  );
};

export default MyApp;
