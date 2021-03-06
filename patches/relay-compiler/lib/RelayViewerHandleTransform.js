/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayViewerHandleTransform
 * @format
 */

'use strict';

// TODO T21875029 ../../../relay-runtime/util/RelayDefaultHandleKey

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayDefaultHandleKey'),
    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

var _require2 = require('graphql'),
    GraphQLObjectType = _require2.GraphQLObjectType;

var _require3 = require('./GraphQLCompilerPublic'),
    IRTransformer = _require3.IRTransformer,
    SchemaUtils = _require3.SchemaUtils;

var getRawType = SchemaUtils.getRawType;


var ID = 'id';
var VIEWER_HANDLE = 'viewer';
var VIEWER_TYPE = 'Viewer';

/**
 * A transform that adds a "viewer" handle to all fields whose type is `Viewer`.
 */
function relayViewerHandleTransform(context) {
  var viewerType = context.serverSchema.getType(VIEWER_TYPE);
  if (viewerType == null || !(viewerType instanceof GraphQLObjectType) || viewerType.getFields()[ID] != null) {
    return context;
  }
  return IRTransformer.transform(context, {
    LinkedField: visitLinkedField
  });
}

function visitLinkedField(field) {
  var transformedNode = this.traverse(field);
  if (getRawType(field.type).name !== VIEWER_TYPE) {
    return transformedNode;
  }
  var handles = transformedNode.handles;
  var viewerHandle = {
    name: VIEWER_HANDLE,
    key: DEFAULT_HANDLE_KEY,
    filters: null
  };

  if (handles && !handles.find(function (handle) {
    return handle.name === VIEWER_HANDLE;
  })) {
    handles = [].concat((0, _toConsumableArray3['default'])(handles), [viewerHandle]);
  } else if (!handles) {
    handles = [viewerHandle];
  }
  return handles !== transformedNode.handles ? (0, _extends3['default'])({}, transformedNode, { handles: handles }) : transformedNode;
}

module.exports = {
  transform: relayViewerHandleTransform
};