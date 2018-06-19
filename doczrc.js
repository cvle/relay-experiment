const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const extensions = [".ts", ".tsx", ".js"];

export default {
  title: "Talk 5.0",
  source: "./src",
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
    return config
  }
}
