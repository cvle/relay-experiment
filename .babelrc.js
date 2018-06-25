module.exports = {
  presets: [
    ["@babel/env", { targets: "last 2 versions, ie 11", modules: false }],
    "@babel/react"
  ],
  plugins: [
    "@babel/syntax-dynamic-import",
    ["@coral-forks/babel-plugin-relay", { artifactDirectory:  "./src/core/client/stream/__generated__" }]
  ],
  env: {
    "production": {
      "plugins": [],
    },
  },
}
