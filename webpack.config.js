const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/main.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "swc-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".js"],
  },
  mode: "development",
  externals: [nodeExternals()],
  output: {
    filename: "start.js",
    path: path.resolve(__dirname, "dist"),
  },
};
