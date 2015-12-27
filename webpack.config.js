module.exports = {
  context: __dirname + "/app",
  entry: "./index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  resolve: {
    root: __dirname + "/app",
    alias: {
      lib: "libs",
      device: "libs/browser",
      url: "libs/url",
      module: "modules"
    },
    extensions: ["", ".js"]
  },
  devtool: "eval"
};
