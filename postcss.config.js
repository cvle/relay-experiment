const precss = require('precss');
const autoprefixer = require('autoprefixer');
const variables = require('./src/client/ui/theme/variables');
const fontMagician = require('postcss-font-magician');
const kebabCase = require('lodash/kebabCase');
const mapKeys = require('lodash/mapKeys');
const flat = require('flat');

const flatKebabVariables = mapKeys(flat(variables, {delimiter: '-'}), (_, k) => kebabCase(k));

module.exports = {
  plugins: [
    precss({ variables: flatKebabVariables }),
    fontMagician(),
    autoprefixer,
  ],
};
