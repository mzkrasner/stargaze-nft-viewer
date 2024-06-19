const config = {
  siteUrl: "https://stargaze-nft-viewer.netlify.app",
  exclude: ["/icon.svg", "/apple-icon.png", "/manifest.webmanifest", "/tags/*"],
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};

export default config;
