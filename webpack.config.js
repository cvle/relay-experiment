"use strict";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

/* Plugins */
const uglifyPlugin = new UglifyJsPlugin({
  uglifyOptions: {
    output: { comments: false },
    mangle: true,
    sourceMap: true,
  },
});
const additionalPlugins = process.env.NODE_ENV === "production" ? [uglifyPlugin] : [];
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/* Babel */
const reactPresets = process.env.NODE_ENV === "production" ? ["@babel/react", "react-optimize"] : ["@babel/react"];
const envPreset = ["@babel/env", { "targets": "last 2 versions, ie 11", "modules": false }];
const babelOptions = {
  "presets": [envPreset, reactPresets],
  "plugins": [[require("./vendor/babel-plugin-relay"), { "artifactDirectory": "./src/client/__generated__" }]],
};

const extensions = [".ts", ".tsx", ".js"];

/* Config */
const config = {
  entry: ["@babel/polyfill", "./src/client/app.tsx"],
  devtool: "sourcemap",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  resolve: {
    extensions,
    plugins: [new TsconfigPathsPlugin({ extensions })]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: path.resolve(__dirname, "../node_modules"),
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader?modules&importLoaders=1",
          "postcss-loader"
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "app.js",
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "src/client/index.html" },
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    ...additionalPlugins,
  ],
};

module.exports = config;
