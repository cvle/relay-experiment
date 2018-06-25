const path = require('path');

module.exports = {
  extends: "../.babelrc.js",
  plugins: [
    ["@coral-forks/babel-plugin-relay", { artifactDirectory:  path.resolve(__dirname, "./__generated__") }]
  ],
}
