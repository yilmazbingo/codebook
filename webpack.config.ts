// const path = require("path");
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import webpack from "webpack";
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const config: webpack.Configuration = {
  mode: "development",
  target: "web",
  entry: ["regenerator-runtime/runtime", "./src/index.tsx"],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "build"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
    alias: {
      // add as many aliases as you like!
      components: path.resolve(__dirname, "src/components"),
    },
    fallback: {
      // path: require.resolve("path-browserify"),
      fs: false,
      assert: require.resolve("assert/"),
      os: require.resolve("os-browserify/browser"),
      constants: require.resolve("constants-browserify"),
    },
  },
  devtool: "eval-cheap-source-map",
  module: {
    rules: [
      { test: /\.(ts|tsx)/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[contenthash].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true,
    overlay: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "esBUild",
      template: "src/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "assets", to: "assets" }],
    }),
    new MonacoWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
      React: "react",
    }),
  ],
};

export default config;
