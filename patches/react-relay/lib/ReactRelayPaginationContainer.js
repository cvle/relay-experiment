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

var _defineProperty3 = _interopRequireDefault(require('babel-runtime/helpers/defineProperty'));

var _extends4 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayContainerUtils'),
    getComponentName = _require.getComponentName,
    getReactComponent = _require.getReactComponent;

var _require2 = require('./ReactRelayContainerProfiler'),
    profileContainer = _require2.profileContainer;

var _require3 = require('relay-runtime'),
    ConnectionInterface = _require3.ConnectionInterface,
    RelayConcreteNode = _require3.RelayConcreteNode,
    RelayProfiler = _require3.RelayProfiler,
    Observable = _require3.Observable;

var containerContextTypes = {
  relay: require('./RelayPropTypes').Relay
};

var FORWARD = 'forward';

/**
 * Extends the functionality of RelayFragmentContainer by providing a mechanism
 * to load more data from a connection.
 *
 * # Configuring a PaginationContainer
 *
 * PaginationContainer accepts the standard FragmentContainer arguments and an
 * additional `connectionConfig` argument:
 *
 * - `Component`: the component to be wrapped/rendered.
 * - `fragments`: an object whose values are `graphql` fragments. The object
 *   keys determine the prop names by which fragment data is available.
 * - `connectionConfig`: an object that determines how to load more connection
 *   data. Details below.
 *
 * # Loading More Data
 *
 * Use `props.relay.hasMore()` to determine if there are more items to load.
 *
 * ```
 * hasMore(): boolean
 * ```
 *
 * Use `props.relay.isLoading()` to determine if a previous call to `loadMore()`
 * is still pending. This is convenient for avoiding duplicate load calls.
 *
 * ```
 * isLoading(): boolean
 * ```
 *
 * Use `props.relay.loadMore()` to load more items. This will return null if
 * there are no more items to fetch, otherwise it will fetch more items and
 * return a Disposable that can be used to cancel the fetch.
 *
 * `pageSize` should be the number of *additional* items to fetch (not the
 * total).
 *
 * ```
 * loadMore(pageSize: number, callback: ?(error: ?Error) => void): ?Disposable
 * ```
 *
 * A complete example:
 *
 * ```
 * class Foo extends React.Component {
 *   ...
 *   _onEndReached() {
 *     if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
 *       return;
 *     }
 *     this.props.relay.loadMore(10);
 *   }
 *   ...
 * }
 * ```
 *
 * # Connection Config
 *
 * Here's an example, followed by details of each config property:
 *
 * ```
 * ReactRelayPaginationContainer.createContainer(
 *   Component,
 *   {
 *     user: graphql`fragment FriendsFragment on User {
 *       friends(after: $afterCursor first: $count) @connection {
 *         edges { ... }
 *         pageInfo {
 *           startCursor
 *           endCursor
 *           hasNextPage
 *           hasPreviousPage
 *         }
 *       }
 *     }`,
 *   },
 *   {
 *     direction: 'forward',
 *     getConnectionFromProps(props) {
 *       return props.user && props.user.friends;
 *     },
 *     getFragmentVariables(vars, totalCount) {
 *       // The component presumably wants *all* edges, not just those after
 *       // the cursor, so notice that we don't set $afterCursor here.
 *       return {
 *         ...vars,
 *         count: totalCount,
 *       };
 *     },
 *     getVariables(props, {count, cursor}, fragmentVariables) {
 *       return {
 *         ...RelayFBCompatQueryConstants.get(),
 *         id: props.user.id,
 *         afterCursor: cursor,
 *         count,
 *       },
 *     },
 *     query: graphql`
 *       query FriendsQuery($id: ID!, $afterCursor: ID, $count: Int!) {
 *         node(id: $id) {
 *           ...FriendsFragment
 *         }
 *       }
 *     `,
 *   }
 * );
 * ```
 *
 * ## Config Properties
 *
 * - `direction`: Either "forward" to indicate forward pagination using
 *   after/first, or "backward" to indicate backward pagination using
 *   before/last.
 * - `getConnectionFromProps(props)`: PaginationContainer doesn't magically know
 *   which connection data you mean to fetch more of (a container might fetch
 *   multiple connections, but can only paginate one of them). This function is
 *   given the fragment props only (not full props), and should return the
 *   connection data. See the above example that returns the friends data via
 *   `props.user.friends`.
 * - `getFragmentVariables(previousVars, totalCount)`: Given the previous variables
 *   and the new total number of items, get the variables to use when reading
 *   your fragments. Typically this means setting whatever your local "count"
 *   variable is to the value of `totalCount`. See the example.
 * - `getVariables(props, {count, cursor})`: Get the variables to use when
 *   fetching the pagination `query`. You may determine the root object id from
 *   props (see the example that uses `props.user.id`) and may also set whatever
 *   variables you use for the after/first/before/last calls based on the count
 *   and cursor.
 * - `query`: A query to use when fetching more connection data. This should
 *   typically reference one of the container's fragment (as in the example)
 *   to ensure that all the necessary fields for sub-components are fetched.
 */

function createGetConnectionFromProps(metadata) {
  var path = metadata.path;
  require('fbjs/lib/invariant')(path, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getConnectionFromProps function.');
  return function (props) {
    var data = props[metadata.fragmentName];
    for (var i = 0; i < path.length; i++) {
      if (!data || typeof data !== 'object') {
        return null;
      }
      data = data[path[i]];
    }
    return data;
  };
}

function createGetFragmentVariables(metadata) {
  var countVariable = metadata.count;
  require('fbjs/lib/invariant')(countVariable, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getFragmentVariables function.');
  return function (prevVars, totalCount) {
    return (0, _extends4['default'])({}, prevVars, (0, _defineProperty3['default'])({}, countVariable, totalCount));
  };
}

function findConnectionMetadata(fragments) {
  var foundConnectionMetadata = null;
  var isRelayModern = false;
  for (var _fragmentName in fragments) {
    var fragment = fragments[_fragmentName];
    var connectionMetadata = fragment.metadata && fragment.metadata.connection;
    // HACK: metadata is always set to `undefined` in classic. In modern, even
    // if empty, it is set to null (never undefined). We use that knowlege to
    // check if we're dealing with classic or modern
    if (fragment.metadata !== undefined) {
      isRelayModern = true;
    }
    if (connectionMetadata) {
      require('fbjs/lib/invariant')(connectionMetadata.length === 1, 'ReactRelayPaginationContainer: Only a single @connection is ' + 'supported, `%s` has %s.', _fragmentName, connectionMetadata.length);
      require('fbjs/lib/invariant')(!foundConnectionMetadata, 'ReactRelayPaginationContainer: Only a single fragment with ' + '@connection is supported.');
      foundConnectionMetadata = (0, _extends4['default'])({}, connectionMetadata[0], {
        fragmentName: _fragmentName
      });
    }
  }
  require('fbjs/lib/invariant')(!isRelayModern || foundConnectionMetadata !== null, 'ReactRelayPaginationContainer: A @connection directive must be present.');
  return foundConnectionMetadata || {};
}

function toObserver(observerOrCallback) {
  return typeof observerOrCallback === 'function' ? {
    error: observerOrCallback,
    complete: observerOrCallback,
    unsubscribe: function unsubscribe(subscription) {
      typeof observerOrCallback === 'function' && observerOrCallback();
    }
  } : observerOrCallback || {};
}

function createContainerWithFragments(Component, fragments, connectionConfig) {
  var ComponentClass = getReactComponent(Component);
  var componentName = getComponentName(Component);
  var containerName = 'Relay(' + componentName + ')';

  var metadata = findConnectionMetadata(fragments);

  var getConnectionFromProps = connectionConfig.getConnectionFromProps || createGetConnectionFromProps(metadata);

  var direction = connectionConfig.direction || metadata.direction;
  require('fbjs/lib/invariant')(direction, 'ReactRelayPaginationContainer: Unable to infer direction of the ' + 'connection, possibly because both first and last are provided.');

  var getFragmentVariables = connectionConfig.getFragmentVariables || createGetFragmentVariables(metadata);

  var Container = function (_React$Component) {
    (0, _inherits3['default'])(Container, _React$Component);

    function Container(props, context) {
      (0, _classCallCheck3['default'])(this, Container);

      var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

      _this._handleFragmentDataUpdate = function () {
        var profiler = RelayProfiler.profile('ReactRelayPaginationContainer.handleFragmentDataUpdate');
        _this.setState({ data: _this._resolver.resolve() }, profiler.stop);
      };

      _this._hasMore = function () {
        var connectionData = _this._getConnectionData();
        return !!(connectionData && connectionData.hasMore && connectionData.cursor);
      };

      _this._isLoading = function () {
        return !!_this._refetchSubscription;
      };

      _this._refetchConnection = function (totalCount, observerOrCallback, refetchVariables) {
        var paginatingVariables = {
          count: totalCount,
          cursor: null,
          totalCount: totalCount
        };
        var fetch = _this._fetchPage(paginatingVariables, toObserver(observerOrCallback), { force: true }, refetchVariables);

        return { dispose: fetch.unsubscribe };
      };

      _this._loadMore = function (pageSize, observerOrCallback, options) {
        var observer = toObserver(observerOrCallback);
        var connectionData = _this._getConnectionData();
        if (!connectionData) {
          Observable.create(function (sink) {
            return sink.complete();
          }).subscribe(observer);
          return null;
        }
        var totalCount = connectionData.edgeCount + pageSize;
        if (options && options.force) {
          return _this._refetchConnection(totalCount, observerOrCallback);
        }

        var _ConnectionInterface$ = ConnectionInterface.get(),
            END_CURSOR = _ConnectionInterface$.END_CURSOR,
            START_CURSOR = _ConnectionInterface$.START_CURSOR;

        var cursor = connectionData.cursor;
        require('fbjs/lib/warning')(cursor, 'ReactRelayPaginationContainer: Cannot `loadMore` without valid `%s` (got `%s`)', direction === FORWARD ? END_CURSOR : START_CURSOR, cursor);
        var paginatingVariables = {
          count: pageSize,
          cursor: cursor,
          totalCount: totalCount
        };
        var fetch = _this._fetchPage(paginatingVariables, observer, options);
        return { dispose: fetch.unsubscribe };
      };

      var relay = assertRelayContext(context.relay);
      var createFragmentSpecResolver = relay.environment.unstable_internal.createFragmentSpecResolver;

      _this._isARequestInFlight = false;
      _this._localVariables = null;
      _this._refetchSubscription = null;
      _this._references = [];
      _this._resolver = createFragmentSpecResolver(relay, containerName, fragments, props, _this._handleFragmentDataUpdate);
      _this._relayContext = {
        environment: _this.context.relay.environment,
        variables: _this.context.relay.variables
      };
      _this.state = {
        data: _this._resolver.resolve(),
        relayProp: _this._buildRelayProp(relay)
      };
      return _this;
    }

    /**
     * When new props are received, read data for the new props and subscribe
     * for updates. Props may be the same in which case previous data and
     * subscriptions can be reused.
     */


    Container.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      var context = require('fbjs/lib/nullthrows')(nextContext);
      var relay = assertRelayContext(context.relay);
      var _relay$environment$un = relay.environment.unstable_internal,
          createFragmentSpecResolver = _relay$environment$un.createFragmentSpecResolver,
          getDataIDsFromObject = _relay$environment$un.getDataIDsFromObject;

      var prevIDs = getDataIDsFromObject(fragments, this.props);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);

      // If the environment has changed or props point to new records then
      // previously fetched data and any pending fetches no longer apply:
      // - Existing references are on the old environment.
      // - Existing references are based on old variables.
      // - Pending fetches are for the previous records.
      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !require('fbjs/lib/areEqual')(prevIDs, nextIDs)) {
        this._release();
        this._localVariables = null;
        this._relayContext = {
          environment: relay.environment,
          variables: relay.variables
        };
        this._resolver = createFragmentSpecResolver(relay, containerName, fragments, nextProps, this._handleFragmentDataUpdate);
        this.setState({ relayProp: this._buildRelayProp(relay) });
      } else if (!this._localVariables) {
        this._resolver.setProps(nextProps);
      }
      var data = this._resolver.resolve();
      if (data !== this.state.data) {
        this.setState({ data: data });
      }
    };

    Container.prototype.componentWillUnmount = function componentWillUnmount() {
      this._release();
    };

    Container.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
      // Short-circuit if any Relay-related data has changed
      if (nextContext.relay !== this.context.relay || nextState.data !== this.state.data || nextState.relayProp !== this.state.relayProp) {
        return true;
      }
      // Otherwise, for convenience short-circuit if all non-Relay props
      // are scalar and equal
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var _key = keys[ii];
        if (!fragments.hasOwnProperty(_key) && !require('./isScalarAndEqual')(nextProps[_key], this.props[_key])) {
          return true;
        }
      }
      return false;
    };

    Container.prototype._buildRelayProp = function _buildRelayProp(relay) {
      return {
        hasMore: this._hasMore,
        isLoading: this._isLoading,
        loadMore: this._loadMore,
        refetchConnection: this._refetchConnection,
        environment: relay.environment
      };
    };

    /**
     * Render new data for the existing props/context.
     */


    Container.prototype._getConnectionData = function _getConnectionData() {
      // Extract connection data and verify there are more edges to fetch
      var props = (0, _extends4['default'])({}, this.props, this.state.data);
      var connectionData = getConnectionFromProps(props);
      if (connectionData == null) {
        return null;
      }

      var _ConnectionInterface$2 = ConnectionInterface.get(),
          EDGES = _ConnectionInterface$2.EDGES,
          PAGE_INFO = _ConnectionInterface$2.PAGE_INFO,
          HAS_NEXT_PAGE = _ConnectionInterface$2.HAS_NEXT_PAGE,
          HAS_PREV_PAGE = _ConnectionInterface$2.HAS_PREV_PAGE,
          END_CURSOR = _ConnectionInterface$2.END_CURSOR,
          START_CURSOR = _ConnectionInterface$2.START_CURSOR;

      require('fbjs/lib/invariant')(typeof connectionData === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return `null` or a plain object with %s and %s properties, got `%s`.', componentName, EDGES, PAGE_INFO, connectionData);
      var edges = connectionData[EDGES];
      var pageInfo = connectionData[PAGE_INFO];
      if (edges == null || pageInfo == null) {
        return null;
      }
      require('fbjs/lib/invariant')(Array.isArray(edges), 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Array, got `%s`.', componentName, EDGES, edges);
      require('fbjs/lib/invariant')(typeof pageInfo === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Object, got `%s`.', componentName, PAGE_INFO, pageInfo);
      var hasMore = direction === FORWARD ? pageInfo[HAS_NEXT_PAGE] : pageInfo[HAS_PREV_PAGE];
      var cursor = direction === FORWARD ? pageInfo[END_CURSOR] : pageInfo[START_CURSOR];
      if (typeof hasMore !== 'boolean' || edges.length !== 0 && typeof cursor === 'undefined') {
        require('fbjs/lib/warning')(false, 'ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. ' + 'Be sure to fetch %s (got `%s`) and %s (got `%s`).', PAGE_INFO, componentName, direction === FORWARD ? HAS_NEXT_PAGE : HAS_PREV_PAGE, hasMore, direction === FORWARD ? END_CURSOR : START_CURSOR, cursor);
        return null;
      }
      return {
        cursor: cursor,
        edgeCount: edges.length,
        hasMore: hasMore
      };
    };

    Container.prototype._fetchPage = function _fetchPage(paginatingVariables, observer, options, refetchVariables) {
      var _this2 = this;

      var _assertRelayContext = assertRelayContext(this.context.relay),
          environment = _assertRelayContext.environment;

      var _environment$unstable = environment.unstable_internal,
          createOperationSelector = _environment$unstable.createOperationSelector,
          getRequest = _environment$unstable.getRequest,
          getVariablesFromObject = _environment$unstable.getVariablesFromObject;

      var props = (0, _extends4['default'])({}, this.props, this.state.data);
      var fragmentVariables = getVariablesFromObject(this._relayContext.variables, fragments, this.props);
      fragmentVariables = (0, _extends4['default'])({}, fragmentVariables, refetchVariables);
      var fetchVariables = connectionConfig.getVariables(props, {
        count: paginatingVariables.count,
        cursor: paginatingVariables.cursor
      },
      // Pass the variables used to fetch the fragments initially
      fragmentVariables);
      require('fbjs/lib/invariant')(typeof fetchVariables === 'object' && fetchVariables !== null, 'ReactRelayPaginationContainer: Expected `getVariables()` to ' + 'return an object, got `%s` in `%s`.', fetchVariables, componentName);
      fetchVariables = (0, _extends4['default'])({}, fetchVariables, refetchVariables);
      this._localVariables = fetchVariables;

      var cacheConfig = options ? { force: !!options.force } : undefined;
      if (cacheConfig && options && options.rerunParamExperimental) {
        cacheConfig.rerunParamExperimental = options.rerunParamExperimental;
      }
      var request = getRequest(connectionConfig.query);
      if (request.kind === RelayConcreteNode.BATCH_REQUEST) {
        throw new Error('ReactRelayPaginationContainer: Batch request not yet ' + 'implemented (T22954884)');
      }
      var operation = createOperationSelector(request, fetchVariables);

      var refetchSubscription = null;

      // Immediately retain the results of the query to prevent cached
      // data from being evicted
      var reference = environment.retain(operation.root);
      this._references.push(reference);

      if (this._refetchSubscription) {
        this._refetchSubscription.unsubscribe();
      }

      var onNext = function onNext(payload, complete) {
        _this2._relayContext = {
          environment: _this2.context.relay.environment,
          variables: (0, _extends4['default'])({}, _this2.context.relay.variables, fragmentVariables)
        };
        var prevData = _this2._resolver.resolve();
        _this2._resolver.setVariables(getFragmentVariables(fragmentVariables, paginatingVariables.totalCount));
        var nextData = _this2._resolver.resolve();

        // Workaround slightly different handling for connection in different
        // core implementations:
        // - Classic core requires the count to be explicitly incremented
        // - Modern core automatically appends new items, updating the count
        //   isn't required to see new data.
        //
        // `setState` is only required if changing the variables would change the
        // resolved data.
        // TODO #14894725: remove PaginationContainer equal check
        if (!require('fbjs/lib/areEqual')(prevData, nextData)) {
          _this2.setState({ data: nextData }, complete);
        } else {
          complete();
        }
      };

      var cleanup = function cleanup() {
        if (_this2._refetchSubscription === refetchSubscription) {
          _this2._refetchSubscription = null;
          _this2._isARequestInFlight = false;
        }
      };

      this._isARequestInFlight = true;
      refetchSubscription = environment.execute({ operation: operation, cacheConfig: cacheConfig }).mergeMap(function (payload) {
        return Observable.create(function (sink) {
          onNext(payload, function () {
            sink.next(); // pass void to public observer's `next`
            sink.complete();
          });
        });
      })
      // use do instead of finally so that observer's `complete` fires after cleanup
      ['do']({
        error: cleanup,
        complete: cleanup,
        unsubscribe: cleanup
      }).subscribe(observer || {});

      this._refetchSubscription = this._isARequestInFlight ? refetchSubscription : null;

      return refetchSubscription;
    };

    Container.prototype._release = function _release() {
      this._resolver.dispose();
      this._references.forEach(function (disposable) {
        return disposable.dispose();
      });
      this._references.length = 0;
      if (this._refetchSubscription) {
        this._refetchSubscription.unsubscribe();
        this._refetchSubscription = null;
        this._isARequestInFlight = false;
      }
    };

    Container.prototype.getChildContext = function getChildContext() {
      return { relay: this._relayContext };
    };

    Container.prototype.render = function render() {
      if (ComponentClass) {
        return require('react').createElement(ComponentClass, (0, _extends4['default'])({}, this.props, this.state.data, {
          // TODO: Remove the string ref fallback.
          ref: this.props.componentRef || 'component',
          relay: this.state.relayProp
        }));
      } else {
        // Stateless functional, doesn't support `ref`
        return require('react').createElement(Component, (0, _extends4['default'])({}, this.props, this.state.data, {
          relay: this.state.relayProp
        }));
      }
    };

    return Container;
  }(require('react').Component);

  profileContainer(Container, 'ReactRelayPaginationContainer');
  Container.contextTypes = containerContextTypes;
  Container.displayName = containerName;

  return Container;
}

function assertRelayContext(relay) {
  require('fbjs/lib/invariant')(require('./isRelayContext')(relay), 'ReactRelayPaginationContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
  return relay;
}

/**
 * Wrap the basic `createContainer()` function with logic to adapt to the
 * `context.relay.environment` in which it is rendered. Specifically, the
 * extraction of the environment-specific version of fragments in the
 * `fragmentSpec` is memoized once per environment, rather than once per
 * instance of the container constructed/rendered.
 */
function createContainer(Component, fragmentSpec, connectionConfig) {
  var Container = require('./buildReactRelayContainer')(Component, fragmentSpec, function (ComponentClass, fragments) {
    return createContainerWithFragments(ComponentClass, fragments, connectionConfig);
  });
  /* $FlowFixMe(>=0.53.0) This comment suppresses an error
   * when upgrading Flow's support for React. Common errors found when
   * upgrading Flow's React support are documented at
   * https://fburl.com/eq7bs81w */
  Container.childContextTypes = containerContextTypes;
  return Container;
}

module.exports = { createContainer: createContainer, createContainerWithFragments: createContainerWithFragments };