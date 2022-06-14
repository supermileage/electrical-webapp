module.exports = {
  siteMetadata: {
    title: `Electrical Webapp Frontend`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [`gatsby-theme-material-ui`],
  proxy: {
      prefix: "/api",
      url: "http://140.238.154.56"
    }
}
