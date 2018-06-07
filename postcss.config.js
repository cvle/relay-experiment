const precss = require('precss');
const autoprefixer = require('autoprefixer');
const variables = require('./src/client/ui/theme/variablesKebabCase');
const fontMagician = require('postcss-font-magician');

module.exports = {
  plugins: [
    precss({ variables }),
    fontMagician(),
    autoprefixer,
  ],
};
