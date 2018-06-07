const variables = require('./variables');
const kebabCase = require('lodash/kebabCase');
const mapKeys = require('lodash/mapKeys');

module.exports = mapKeys(variables, (_, k) => kebabCase(k));
