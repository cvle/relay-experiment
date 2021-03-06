/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _possibleConstructorReturn3 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));

var _inherits3 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('relay-runtime'),
    RelayProfiler = _require.RelayProfiler;

/**
 * Traverse `node` splitting off deferred query fragments into separate queries.
 *
 * @internal
 */
function splitDeferredRelayQueries(node) {
  var splitter = new GraphQLSplitDeferredQueries();
  var splitQueries = {
    __nodePath__: [],
    __parent__: null,
    __refQuery__: null,
    deferred: [],
    required: null
  };
  splitter.visit(node, splitQueries);

  return buildQueries(splitQueries);
}

/**
 * Returns the requisite siblings of `node`, but filters any non-requisite
 * children of those siblings.
 */
function getRequisiteSiblings(node, parent) {
  // Get the requisite siblings.
  var siblings = parent.getChildren().filter(function (child) {
    return child !== node && child instanceof require('./RelayQuery').Field && child.isRequisite();
  });

  // Filter the non-requisite children from those siblings.
  return siblings.map(function (sibling) {
    var children = sibling.getChildren().filter(function (child) {
      return child instanceof require('./RelayQuery').Field && child.isRequisite();
    });
    var clone = sibling.clone(children);
    require('fbjs/lib/invariant')(clone, 'splitDeferredRelayQueries(): Unexpected non-scalar, requisite field.');
    return clone;
  });
}

/**
 * Traverse the parent chain of `node` wrapping it at each level until it is
 * either:
 *
 * - wrapped in a RelayQuery.Root node
 * - wrapped in a non-root node that can be split off in a "ref query" (ie. a
 *   root call with a ref param that references another query)
 *
 * Additionally ensures that any requisite sibling fields are embedded in each
 * layer of the wrapper.
 */
function wrapNode(node, nodePath) {
  for (var ii = nodePath.length - 1; ii >= 0; ii--) {
    var parent = nodePath[ii];
    if (parent instanceof require('./RelayQuery').Field && parent.getInferredRootCallName()) {
      // We can make a "ref query" at this point, so stop wrapping.
      return new (require('./RelayRefQueryDescriptor'))(node, nodePath.slice(0, ii + 1));
    }

    var siblings = getRequisiteSiblings(node, parent);
    var children = [node].concat(siblings);

    // Cast here because we know that `clone` will never return `null` (because
    // we always give it at least one child).
    node = parent.clone(children);
  }
  require('fbjs/lib/invariant')(node instanceof require('./RelayQuery').Root, 'splitDeferredRelayQueries(): Cannot build query without a root node.');
  var identifyingArg = node.getIdentifyingArg();
  var identifyingArgName = identifyingArg && identifyingArg.name || null;
  var identifyingArgValue = identifyingArg && identifyingArg.value || null;
  var identifyingArgType = identifyingArg && identifyingArg.type || require('./RelayNodeInterface').ID_TYPE;
  var metadata = {
    identifyingArgName: identifyingArgName,
    identifyingArgType: identifyingArgType,
    isAbstract: true,
    isDeferred: true,
    isPlural: false
  };
  return require('./RelayQuery').Root.build(node.getName(), node.getFieldName(), identifyingArgValue, node.getChildren(), metadata, node.getType());
}

/**
 * Returns `true` if `node` is considered "empty", which means that it contains
 * no non-generated fields, and no ref query dependencies.
 */
function isEmpty(node) {
  if (!node.canHaveSubselections()) {
    return node.isGenerated() && !node.isRefQueryDependency();
  } else {
    return node.getChildren().every(isEmpty);
  }
}

/**
 * Mutates and returns a nested `SplitQueries` structure, updating any deferred
 * "ref queries" to actually reference their contexts.
 */
function buildQueries(splitQueries) {
  if (splitQueries.required && isEmpty(splitQueries.required)) {
    splitQueries.required = null;
  }
  splitQueries.deferred = splitQueries.deferred.map(function (nestedSplitQueries) {
    var descriptor = nestedSplitQueries.__refQuery__;
    if (descriptor) {
      // Wrap the ref query node with a reference to the required query that is
      // its context.
      var context = splitQueries.required;
      if (!context) {
        // Traverse upwards looking for context.
        var parentSplitQueries = splitQueries;
        while (parentSplitQueries.__parent__) {
          context = parentSplitQueries.__parent__.required;
          if (context) {
            break;
          }
          parentSplitQueries = parentSplitQueries.__parent__;
        }
      }
      require('fbjs/lib/invariant')(context, 'splitDeferredRelayQueries(): Expected a context root query.');
      nestedSplitQueries.required = createRefQuery(descriptor, context);
    }

    return buildQueries(nestedSplitQueries);
  });
  return splitQueries;
}

/**
 * Wraps `descriptor` in a new top-level ref query.
 */
function createRefQuery(descriptor, context) {
  var node = descriptor.node;
  require('fbjs/lib/invariant')(node instanceof require('./RelayQuery').Field || node instanceof require('./RelayQuery').Fragment, 'splitDeferredRelayQueries(): Ref query requires a field or fragment.');

  // Build up JSONPath.
  var jsonPath = ['$', '*'];
  var parent = void 0;
  for (var ii = 0; ii < descriptor.nodePath.length; ii++) {
    parent = descriptor.nodePath[ii];
    if (parent instanceof require('./RelayQuery').Field) {
      jsonPath.push(parent.getSerializationKey());
      if (parent.isPlural()) {
        jsonPath.push('*');
      }
    }
  }
  require('fbjs/lib/invariant')(jsonPath.length > 2, 'splitDeferredRelayQueries(): Ref query requires a complete path.');
  var field = parent; // Flow
  var primaryKey = field.getInferredPrimaryKey();
  require('fbjs/lib/invariant')(primaryKey, 'splitDeferredRelayQueries(): Ref query requires a primary key.');
  jsonPath.push(primaryKey);

  // Create the wrapper root query.
  var root = require('./RelayQuery').Root.build(context.getName(), require('./RelayNodeInterface').NODES, require('./QueryBuilder').createBatchCallVariable(context.getID(), jsonPath.join('.')), [node], {
    identifyingArgName: require('./RelayNodeInterface').ID,
    identifyingArgType: require('./RelayNodeInterface').ID_TYPE,
    isAbstract: true,
    isDeferred: true,
    isPlural: false
  }, require('./RelayNodeInterface').NODE_TYPE);

  var result = root; // Flow
  return result;
}

/**
 * Traverses an input query, updating the passed in `SplitQueries` state object
 * to contain a nested structure representing the required and deferred portions
 * of the input query.
 */

var GraphQLSplitDeferredQueries = function (_RelayQueryTransform) {
  (0, _inherits3['default'])(GraphQLSplitDeferredQueries, _RelayQueryTransform);

  function GraphQLSplitDeferredQueries() {
    (0, _classCallCheck3['default'])(this, GraphQLSplitDeferredQueries);
    return (0, _possibleConstructorReturn3['default'])(this, _RelayQueryTransform.apply(this, arguments));
  }

  GraphQLSplitDeferredQueries.prototype.visitField = function visitField(node, splitQueries) {
    if (!node.hasDeferredDescendant()) {
      return node;
    }

    splitQueries.__nodePath__.push(node);
    var result = this.traverse(node, splitQueries);
    splitQueries.__nodePath__.pop();

    if (result && node.getInferredRootCallName()) {
      // The node is a ref query dependency; mark it as one.
      var key = node.getInferredPrimaryKey();
      var children = result.getChildren().map(function (child) {
        if (child instanceof require('./RelayQuery').Field && child.getSchemaName() === key) {
          return child.cloneAsRefQueryDependency();
        } else {
          return child;
        }
      });
      result = result.clone(children);
    }

    return result;
  };

  GraphQLSplitDeferredQueries.prototype.visitFragment = function visitFragment(node, splitQueries) {
    if (!node.getChildren().length) {
      return null;
    }

    if (node.isDeferred()) {
      var nodePath = splitQueries.__nodePath__;
      var _deferred = {
        __nodePath__: nodePath,
        __parent__: splitQueries,
        __refQuery__: null,
        deferred: [],
        required: null
      };
      var result = this.traverse(node, _deferred);
      if (result) {
        var wrapped = wrapNode(result, nodePath);
        if (wrapped instanceof require('./RelayQuery').Root) {
          _deferred.required = wrapped;
        } else if (wrapped instanceof require('./RelayRefQueryDescriptor')) {
          // for Flow
          _deferred.__refQuery__ = wrapped;
        }
      }
      if (result || _deferred.deferred.length) {
        splitQueries.deferred.push(_deferred);
      }
      return null;
    } else if (node.hasDeferredDescendant()) {
      return this.traverse(node, splitQueries);
    } else {
      return node;
    }
  };

  GraphQLSplitDeferredQueries.prototype.visitRoot = function visitRoot(node, splitQueries) {
    if (!node.hasDeferredDescendant()) {
      splitQueries.required = node;
      return node;
    } else {
      splitQueries.__nodePath__.push(node);
      var result = this.traverse(node, splitQueries);
      splitQueries.__nodePath__.pop();
      splitQueries.required = result;
      return result;
    }
  };

  return GraphQLSplitDeferredQueries;
}(require('./RelayQueryTransform'));

module.exports = RelayProfiler.instrument('splitDeferredRelayQueries', splitDeferredRelayQueries);