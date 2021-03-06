/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayTestSchema
 * 
 * @format
 */

'use strict';

var _require = require('graphql'),
    buildASTSchema = _require.buildASTSchema,
    parse = _require.parse;

module.exports = buildASTSchema(parse(require('fs').readFileSync(require('./RelayTestSchemaPath'), 'utf8'), { assumeValid: true }));