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
const reactPresets = process.env.NODE_ENV === "production" ? ["@babel/react" /*, "react-optimize"*/] : ["@babel/react"];
const envPreset = ["@babel/env", { "targets": "last 2 versions, ie 11", "modules": false }];
const babelOptions = {
  "presets": [envPreset, ...reactPresets],
  "plugins": ["@babel/syntax-dynamic-import", [require("./vendor/babel-plugin-relay"), { "artifactDirectory": "./src/client/stream/__generated__" }]],
};

/* i18n */
const i18n = {
  pathToLocales: path.resolve(__dirname, "./locales"),

  // Default locale if non could be negotiated.
  defaultLocale: 'en-US',

  // Fallback locale if a translation was not found.
  // If not set, will use the text that is already
  // in the code base.
  fallbackLocale: 'en-US',

  // Common fluent files are always included in the locale bundles.
  commonFiles: ['framework.ftl', 'common.ftl'],

  // Locales that come with the main bundle. Others are loaded on demand.
  bundled: ['en-US'],

  // All available locales can be loadable on demand.
  // To restrict available locales set:
  // availableLocales: ['en-US']
};

const extensions = [".ts", ".tsx", ".js"];

/* Config */
const config = {
  entry: ["@babel/polyfill", "./src/client/stream/entry.tsx"],
  devtool: "sourcemap",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  resolve: {
    extensions,
    plugins: [new TsconfigPathsPlugin({ extensions })]
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, './loaders'),
    ],
  },
  module: {
    rules: [
      {
        test: path.resolve(__dirname, "./src/client/stream/locales.ts"),
        use: [
          {
            loader: 'locales-loader',
            options: {
              ...i18n,
              // Target specifies the prefix for fluent files to be loaded.
              // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
              target: 'stream',
            }
          },
        ],
      },
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
        test: /\.ftl$/,
        exclude: path.resolve(__dirname, "../node_modules"),
        use: [
          "raw-loader"
        ],
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
    chunkFilename: '[name].bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "src/client/stream/index.html" },
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
