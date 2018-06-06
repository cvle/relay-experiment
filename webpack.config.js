"use strict";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;
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

/* Babel */
const reactPresets = process.env.NODE_ENV === "production" ? ["@babel/react", "react-optimize"] : ["@babel/react"];
const envPreset = ["@babel/env", { "targets": "last 2 versions, ie 11", "modules": false }];
const babelOptions = { "presets": [envPreset, reactPresets] };

/* Config */
const config = {
  entry: ["@babel/polyfill", "./src/app.tsx"],
  devtool: "sourcemap",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
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
    ],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "",
    filename: "app.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};

module.exports = config;
