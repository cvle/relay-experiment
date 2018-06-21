const path = require("path");
const fs = require("fs");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const extensions = [".ts", ".tsx", ".js"];
// const stringify = require('json-stringify-safe');

export default {
  title: "Talk 5.0",
  source: "./src",
  typescript: true,
  modifyBundlerConfig: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader?modules&importLoaders=1",
        "postcss-loader"
      ],
    });
    config.resolve.plugins = [new TsconfigPathsPlugin({ extensions })];
    // fs.writeFileSync(path.resolve(__dirname, "tmp"), stringify(config, null, 2));
    return config
  }
}
