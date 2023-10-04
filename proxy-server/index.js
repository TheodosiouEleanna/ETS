const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(
  "/",
  createProxyMiddleware({
    target: "https://translate.google.com", // target host
    changeOrigin: true, // needed for virtual hosted sites
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*"; // Add this line to set the CORS header
    },
    pathRewrite: {
      "^/": "/", // rewrite path
    },
  })
);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
