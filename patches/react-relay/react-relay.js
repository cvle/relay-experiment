/**
 * Relay v1.5.0-artsy.5
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("fbjs/lib/invariant"), require("relay-runtime"), require("react"), require("babel-runtime/helpers/classCallCheck"), require("fbjs/lib/areEqual"), require("fbjs/lib/sprintf"), require("babel-runtime/helpers/inherits"), require("babel-runtime/helpers/possibleConstructorReturn"), require("prop-types"), require("babel-runtime/helpers/extends"), require("fbjs/lib/nullthrows"), require("fbjs/lib/warning"), require("babel-runtime/helpers/defineProperty"), require("fbjs/lib/mapObject"));
	else if(typeof define === 'function' && define.amd)
		define(["fbjs/lib/invariant", "relay-runtime", "react", "babel-runtime/helpers/classCallCheck", "fbjs/lib/areEqual", "fbjs/lib/sprintf", "babel-runtime/helpers/inherits", "babel-runtime/helpers/possibleConstructorReturn", "prop-types", "babel-runtime/helpers/extends", "fbjs/lib/nullthrows", "fbjs/lib/warning", "babel-runtime/helpers/defineProperty", "fbjs/lib/mapObject"], factory);
	else if(typeof exports === 'object')
		exports["ReactRelay"] = factory(require("fbjs/lib/invariant"), require("relay-runtime"), require("react"), require("babel-runtime/helpers/classCallCheck"), require("fbjs/lib/areEqual"), require("fbjs/lib/sprintf"), require("babel-runtime/helpers/inherits"), require("babel-runtime/helpers/possibleConstructorReturn"), require("prop-types"), require("babel-runtime/helpers/extends"), require("fbjs/lib/nullthrows"), require("fbjs/lib/warning"), require("babel-runtime/helpers/defineProperty"), require("fbjs/lib/mapObject"));
	else
		root["ReactRelay"] = factory(root["fbjs/lib/invariant"], root["relay-runtime"], root["react"], root["babel-runtime/helpers/classCallCheck"], root["fbjs/lib/areEqual"], root["fbjs/lib/sprintf"], root["babel-runtime/helpers/inherits"], root["babel-runtime/helpers/possibleConstructorReturn"], root["prop-types"], root["babel-runtime/helpers/extends"], root["fbjs/lib/nullthrows"], root["fbjs/lib/warning"], root["babel-runtime/helpers/defineProperty"], root["fbjs/lib/mapObject"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_17__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_30__, __WEBPACK_EXTERNAL_MODULE_31__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

	/**
	 * The public interface to React Relay.
	 */
	module.exports = {
	  QueryRenderer: __webpack_require__(24),

	  MutationTypes: __webpack_require__(2).MutationTypes,
	  RangeOperations: __webpack_require__(2).RangeOperations,

	  commitLocalUpdate: __webpack_require__(2).commitLocalUpdate,
	  commitMutation: __webpack_require__(2).commitMutation,
	  createFragmentContainer: __webpack_require__(21).createContainer,
	  createPaginationContainer: __webpack_require__(22).createContainer,
	  createRefetchContainer: __webpack_require__(25).createContainer,
	  fetchQuery: __webpack_require__(2).fetchQuery,
	  graphql: __webpack_require__(2).graphql,
	  requestSubscription: __webpack_require__(2).requestSubscription
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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

	var RelayPropTypes = {
	  Container: function Container(props, propName, componentName) {
	    var component = props[propName];
	    if (component == null) {
	      return new Error(__webpack_require__(8)('Required prop `%s` was not specified in `%s`.', propName, componentName));
	    } else if (!__webpack_require__(28)(component)) {
	      return new Error(__webpack_require__(8)('Invalid prop `%s` supplied to `%s`, expected a RelayContainer.', propName, componentName));
	    }
	    return null;
	  },
	  Environment: function Environment(props, propName, componentName) {
	    var context = props[propName];
	    if (!__webpack_require__(18)(context) || !__webpack_require__(19)(context)) {
	      return new Error(__webpack_require__(8)('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object conforming to the `RelayEnvironment` interface.', propName, componentName, context));
	    }
	    return null;
	  },


	  QueryConfig: __webpack_require__(12).shape({
	    name: __webpack_require__(12).string.isRequired,
	    params: __webpack_require__(12).object.isRequired,
	    queries: __webpack_require__(12).object.isRequired
	  }),

	  ClassicRelay: function ClassicRelay(props, propName, componentName) {
	    var relay = props[propName];
	    if (!__webpack_require__(5)(relay) || !__webpack_require__(18)(relay.environment)) {
	      return new Error(__webpack_require__(8)('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with a classic `environment` implementation and `variables`.', propName, componentName, relay));
	    }
	    return null;
	  },
	  Relay: function Relay(props, propName, componentName) {
	    var relay = props[propName];
	    if (!__webpack_require__(5)(relay)) {
	      return new Error(__webpack_require__(8)('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with an `environment` and `variables`.', propName, componentName, relay));
	    }
	    return null;
	  }
	};

	module.exports = RelayPropTypes;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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

	/**
	 * Determine if the input is a plain object that matches the `RelayContext`
	 * type defined in `RelayEnvironmentTypes`.
	 */
	function isRelayContext(context) {
	  return typeof context === 'object' && context !== null && !Array.isArray(context) && __webpack_require__(19)(context.environment) && __webpack_require__(29)(context.variables);
	}

	module.exports = isRelayContext;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

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

	/**
	 * @internal
	 *
	 * Helper for checking if this is a React Component
	 * created with React.Component or React.createClass().
	 */

	function isReactComponent(component) {
	  return !!(component && typeof component.prototype === 'object' && component.prototype && component.prototype.isReactComponent);
	}

	function getReactComponent(Component) {
	  if (isReactComponent(Component)) {
	    return Component;
	  } else {
	    return null;
	  }
	}

	function getComponentName(Component) {
	  var name = void 0;
	  var ComponentClass = getReactComponent(Component);
	  if (ComponentClass) {
	    name = ComponentClass.displayName || ComponentClass.name;
	  } else if (typeof Component === 'function') {
	    // This is a stateless functional component.
	    name = Component.displayName || Component.name || 'StatelessComponent';
	  } else {
	    name = 'ReactElement';
	  }
	  return String(name);
	}

	function getContainerName(Component) {
	  return 'Relay(' + getComponentName(Component) + ')';
	}

	module.exports = {
	  getComponentName: getComponentName,
	  getContainerName: getContainerName,
	  getReactComponent: getReactComponent
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _require = __webpack_require__(2),
	    RelayProfiler = _require.RelayProfiler;

	function profileContainer(Container, containerName) {
	  /* $FlowFixMe(>=0.53.0) This comment suppresses an error
	   * when upgrading Flow's support for React. Common errors found when
	   * upgrading Flow's React support are documented at
	   * https://fburl.com/eq7bs81w */
	  RelayProfiler.instrumentMethods(Container.prototype, {
	    constructor: containerName + '.prototype.constructor',
	    componentWillReceiveProps: containerName + '.prototype.componentWillReceiveProps',
	    componentWillUnmount: containerName + '.prototype.componentWillUnmount',
	    shouldComponentUpdate: containerName + '.prototype.shouldComponentUpdate'
	  });
	}

	module.exports = { profileContainer: profileContainer };

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _require = __webpack_require__(9),
	    getComponentName = _require.getComponentName,
	    getContainerName = _require.getContainerName;

	var containerContextTypes = {
	  relay: __webpack_require__(4).Relay
	};

	/**
	 * Creates a component class whose instances adapt to the
	 * `context.relay.environment` in which they are rendered and which have the
	 * necessary static methods (`getFragment()` etc) to be composed within classic
	 * `Relay.Containers`.
	 */
	function buildReactRelayContainer(ComponentClass, fragmentSpec, createContainerWithFragments) {
	  // Sanity-check user-defined fragment input
	  var containerName = getContainerName(ComponentClass);
	  __webpack_require__(26)(getComponentName(ComponentClass), fragmentSpec);

	  // Memoize a container for the last environment instance encountered
	  var environment = void 0;
	  var Container = void 0;
	  function ContainerConstructor(props, context) {
	    if (Container == null || context.relay.environment !== environment) {
	      environment = context.relay.environment;
	      if (true) {
	        var _require2 = __webpack_require__(2),
	            isRelayModernEnvironment = _require2.isRelayModernEnvironment;

	        if (!isRelayModernEnvironment(environment)) {
	          throw new Error('RelayModernContainer: Can only use Relay Modern component ' + (containerName + ' in a Relay Modern environment!\n') + 'When using Relay Modern and Relay Classic in the same ' + 'application, ensure components use Relay Compat to work in ' + 'both environments.\n' + 'See: http://facebook.github.io/relay/docs/relay-compat.html');
	        }
	      }
	      var getFragmentFromTag = environment.unstable_internal.getFragment;

	      var _fragments = __webpack_require__(31)(fragmentSpec, getFragmentFromTag);
	      Container = createContainerWithFragments(ComponentClass, _fragments);
	    }
	    /* $FlowFixMe(>=0.53.0) This comment suppresses an
	     * error when upgrading Flow's support for React. Common errors found when
	     * upgrading Flow's React support are documented at
	     * https://fburl.com/eq7bs81w */
	    return new Container(props, context);
	  }
	  ContainerConstructor.contextTypes = containerContextTypes;
	  ContainerConstructor.displayName = containerName;

	  if (true) {
	    ContainerConstructor.__ComponentClass = ComponentClass;
	    // Classic container static methods.
	    ContainerConstructor.getFragment = function getFragmentOnModernContainer() {
	      throw new Error('RelayModernContainer: ' + containerName + '.getFragment() was called on ' + 'a Relay Modern component by a Relay Classic or Relay Compat ' + 'component.\n' + 'When using Relay Modern and Relay Classic in the same ' + 'application, ensure components use Relay Compat to work in ' + 'both environments.\n' + 'See: http://facebook.github.io/relay/docs/relay-compat.html');
	    };
	  }

	  return ContainerConstructor;
	}

	module.exports = buildReactRelayContainer;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule isScalarAndEqual
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * A fast test to determine if two values are equal scalars:
	 * - compares scalars such as booleans, strings, numbers by value
	 * - compares functions by identity
	 * - returns false for complex values, since these cannot be cheaply tested for
	 *   equality (use `areEquals` instead)
	 */

	function isScalarAndEqual(valueA, valueB) {
	  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
	}

	module.exports = isScalarAndEqual;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_16__;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_17__;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

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

	/**
	 * Determine if a given value is an object that implements the `RelayEnvironment`
	 * interface.
	 */

	function isClassicRelayEnvironment(environment) {
	  return typeof environment === 'object' && environment !== null && typeof environment.applyMutation === 'function' && typeof environment.sendMutation === 'function' && typeof environment.forceFetch === 'function' && typeof environment.getFragmentResolver === 'function' && typeof environment.getStoreData === 'function' && typeof environment.primeCache === 'function';
	}

	module.exports = isClassicRelayEnvironment;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

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

	/**
	 * Determine if a given value is an object that implements the `Environment`
	 * interface defined in `RelayEnvironmentTypes`.
	 */

	function isRelayEnvironment(environment) {
	  return typeof environment === 'object' && environment !== null &&
	  // TODO: add applyMutation/sendMutation once ready in both cores
	  typeof environment.check === 'function' && typeof environment.lookup === 'function' && typeof environment.retain === 'function' && typeof environment.sendQuery === 'function' && typeof environment.execute === 'function' && typeof environment.subscribe === 'function';
	}

	module.exports = isRelayEnvironment;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _extends3 = _interopRequireDefault(__webpack_require__(16));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(11));

	var _inherits3 = _interopRequireDefault(__webpack_require__(10));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(9),
	    getComponentName = _require.getComponentName,
	    getReactComponent = _require.getReactComponent;

	var _require2 = __webpack_require__(13),
	    profileContainer = _require2.profileContainer;

	var _require3 = __webpack_require__(2),
	    RelayProfiler = _require3.RelayProfiler;

	var containerContextTypes = {
	  relay: __webpack_require__(4).Relay
	};

	/**
	 * Composes a React component class, returning a new class that intercepts
	 * props, resolving them with the provided fragments and subscribing for
	 * updates.
	 */
	function createContainerWithFragments(Component, fragments) {
	  var ComponentClass = getReactComponent(Component);
	  var componentName = getComponentName(Component);
	  var containerName = 'Relay(' + componentName + ')';

	  var Container = function (_React$Component) {
	    (0, _inherits3['default'])(Container, _React$Component);

	    function Container(props, context) {
	      (0, _classCallCheck3['default'])(this, Container);

	      var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

	      _this._handleFragmentDataUpdate = function () {
	        var data = _this._resolver.resolve();
	        var profiler = RelayProfiler.profile('ReactRelayFragmentContainer.handleFragmentDataUpdate');
	        _this.setState({
	          data: data,
	          relayProp: (0, _extends3['default'])({}, _this.state.relayProp, {
	            isLoading: _this._resolver.isLoading()
	          })
	        }, profiler.stop);
	      };

	      var relay = assertRelayContext(context.relay);
	      var createFragmentSpecResolver = relay.environment.unstable_internal.createFragmentSpecResolver;

	      _this._resolver = createFragmentSpecResolver(relay, containerName, fragments, props, _this._handleFragmentDataUpdate);
	      _this.state = {
	        data: _this._resolver.resolve(),
	        relayProp: {
	          isLoading: _this._resolver.isLoading(),
	          environment: relay.environment
	        }
	      };
	      return _this;
	    }

	    /**
	     * When new props are received, read data for the new props and subscribe
	     * for updates. Props may be the same in which case previous data and
	     * subscriptions can be reused.
	     */


	    Container.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
	      var context = __webpack_require__(17)(nextContext);
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
	      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !__webpack_require__(7)(prevIDs, nextIDs)) {
	        this._resolver.dispose();
	        this._resolver = createFragmentSpecResolver(relay, containerName, fragments, nextProps, this._handleFragmentDataUpdate);
	        var _relayProp = {
	          isLoading: this._resolver.isLoading(),
	          environment: relay.environment
	        };
	        this.setState({ relayProp: _relayProp });
	      } else {
	        this._resolver.setProps(nextProps);
	      }
	      var data = this._resolver.resolve();
	      if (data !== this.state.data) {
	        this.setState({
	          data: data,
	          relayProp: {
	            isLoading: this._resolver.isLoading(),
	            environment: relay.environment
	          }
	        });
	      }
	    };

	    Container.prototype.componentWillUnmount = function componentWillUnmount() {
	      this._resolver.dispose();
	    };

	    Container.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
	      // Short-circuit if any Relay-related data has changed
	      if (nextContext.relay !== this.context.relay || nextState.data !== this.state.data) {
	        return true;
	      }
	      // Otherwise, for convenience short-circuit if all non-Relay props
	      // are scalar and equal
	      var keys = Object.keys(nextProps);
	      for (var ii = 0; ii < keys.length; ii++) {
	        var _key = keys[ii];
	        if (!fragments.hasOwnProperty(_key) && !__webpack_require__(15)(nextProps[_key], this.props[_key])) {
	          return true;
	        }
	      }
	      return false;
	    };

	    /**
	     * Render new data for the existing props/context.
	     */


	    Container.prototype.render = function render() {
	      if (ComponentClass) {
	        return __webpack_require__(3).createElement(ComponentClass, (0, _extends3['default'])({}, this.props, this.state.data, {
	          // TODO: Remove the string ref fallback.
	          ref: this.props.componentRef || 'component',
	          relay: this.state.relayProp
	        }));
	      } else {
	        // Stateless functional, doesn't support `ref`
	        return __webpack_require__(3).createElement(Component, (0, _extends3['default'])({}, this.props, this.state.data, {
	          relay: this.state.relayProp
	        }));
	      }
	    };

	    return Container;
	  }(__webpack_require__(3).Component);

	  profileContainer(Container, 'ReactRelayFragmentContainer');
	  Container.contextTypes = containerContextTypes;
	  Container.displayName = containerName;

	  return Container;
	}

	function assertRelayContext(relay) {
	  __webpack_require__(1)(__webpack_require__(5)(relay), 'ReactRelayFragmentContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
	  return relay;
	}

	/**
	 * Wrap the basic `createContainer()` function with logic to adapt to the
	 * `context.relay.environment` in which it is rendered. Specifically, the
	 * extraction of the environment-specific version of fragments in the
	 * `fragmentSpec` is memoized once per environment, rather than once per
	 * instance of the container constructed/rendered.
	 */
	function createContainer(Component, fragmentSpec) {
	  return __webpack_require__(14)(Component, fragmentSpec, createContainerWithFragments);
	}

	module.exports = { createContainer: createContainer, createContainerWithFragments: createContainerWithFragments };

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(11));

	var _inherits3 = _interopRequireDefault(__webpack_require__(10));

	var _defineProperty3 = _interopRequireDefault(__webpack_require__(30));

	var _extends4 = _interopRequireDefault(__webpack_require__(16));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(9),
	    getComponentName = _require.getComponentName,
	    getReactComponent = _require.getReactComponent;

	var _require2 = __webpack_require__(13),
	    profileContainer = _require2.profileContainer;

	var _require3 = __webpack_require__(2),
	    ConnectionInterface = _require3.ConnectionInterface,
	    RelayConcreteNode = _require3.RelayConcreteNode,
	    RelayProfiler = _require3.RelayProfiler,
	    Observable = _require3.Observable;

	var containerContextTypes = {
	  relay: __webpack_require__(4).Relay
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
	  __webpack_require__(1)(path, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getConnectionFromProps function.');
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
	  __webpack_require__(1)(countVariable, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getFragmentVariables function.');
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
	      __webpack_require__(1)(connectionMetadata.length === 1, 'ReactRelayPaginationContainer: Only a single @connection is ' + 'supported, `%s` has %s.', _fragmentName, connectionMetadata.length);
	      __webpack_require__(1)(!foundConnectionMetadata, 'ReactRelayPaginationContainer: Only a single fragment with ' + '@connection is supported.');
	      foundConnectionMetadata = (0, _extends4['default'])({}, connectionMetadata[0], {
	        fragmentName: _fragmentName
	      });
	    }
	  }
	  __webpack_require__(1)(!isRelayModern || foundConnectionMetadata !== null, 'ReactRelayPaginationContainer: A @connection directive must be present.');
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
	  __webpack_require__(1)(direction, 'ReactRelayPaginationContainer: Unable to infer direction of the ' + 'connection, possibly because both first and last are provided.');

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
	        __webpack_require__(20)(cursor, 'ReactRelayPaginationContainer: Cannot `loadMore` without valid `%s` (got `%s`)', direction === FORWARD ? END_CURSOR : START_CURSOR, cursor);
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
	      var context = __webpack_require__(17)(nextContext);
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
	      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !__webpack_require__(7)(prevIDs, nextIDs)) {
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
	        if (!fragments.hasOwnProperty(_key) && !__webpack_require__(15)(nextProps[_key], this.props[_key])) {
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

	      __webpack_require__(1)(typeof connectionData === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return `null` or a plain object with %s and %s properties, got `%s`.', componentName, EDGES, PAGE_INFO, connectionData);
	      var edges = connectionData[EDGES];
	      var pageInfo = connectionData[PAGE_INFO];
	      if (edges == null || pageInfo == null) {
	        return null;
	      }
	      __webpack_require__(1)(Array.isArray(edges), 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Array, got `%s`.', componentName, EDGES, edges);
	      __webpack_require__(1)(typeof pageInfo === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Object, got `%s`.', componentName, PAGE_INFO, pageInfo);
	      var hasMore = direction === FORWARD ? pageInfo[HAS_NEXT_PAGE] : pageInfo[HAS_PREV_PAGE];
	      var cursor = direction === FORWARD ? pageInfo[END_CURSOR] : pageInfo[START_CURSOR];
	      if (typeof hasMore !== 'boolean' || edges.length !== 0 && typeof cursor === 'undefined') {
	        __webpack_require__(20)(false, 'ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. ' + 'Be sure to fetch %s (got `%s`) and %s (got `%s`).', PAGE_INFO, componentName, direction === FORWARD ? HAS_NEXT_PAGE : HAS_PREV_PAGE, hasMore, direction === FORWARD ? END_CURSOR : START_CURSOR, cursor);
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
	      __webpack_require__(1)(typeof fetchVariables === 'object' && fetchVariables !== null, 'ReactRelayPaginationContainer: Expected `getVariables()` to ' + 'return an object, got `%s` in `%s`.', fetchVariables, componentName);
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
	        if (!__webpack_require__(7)(prevData, nextData)) {
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
	        return __webpack_require__(3).createElement(ComponentClass, (0, _extends4['default'])({}, this.props, this.state.data, {
	          // TODO: Remove the string ref fallback.
	          ref: this.props.componentRef || 'component',
	          relay: this.state.relayProp
	        }));
	      } else {
	        // Stateless functional, doesn't support `ref`
	        return __webpack_require__(3).createElement(Component, (0, _extends4['default'])({}, this.props, this.state.data, {
	          relay: this.state.relayProp
	        }));
	      }
	    };

	    return Container;
	  }(__webpack_require__(3).Component);

	  profileContainer(Container, 'ReactRelayPaginationContainer');
	  Container.contextTypes = containerContextTypes;
	  Container.displayName = containerName;

	  return Container;
	}

	function assertRelayContext(relay) {
	  __webpack_require__(1)(__webpack_require__(5)(relay), 'ReactRelayPaginationContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
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
	  var Container = __webpack_require__(14)(Component, fragmentSpec, function (ComponentClass, fragments) {
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

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var NETWORK_ONLY = 'NETWORK_ONLY';
	var STORE_THEN_NETWORK = 'STORE_THEN_NETWORK';
	var DataFromEnum = {
	  NETWORK_ONLY: NETWORK_ONLY,
	  STORE_THEN_NETWORK: STORE_THEN_NETWORK
	};

	var ReactRelayQueryFetcher = function () {
	  function ReactRelayQueryFetcher() {
	    (0, _classCallCheck3['default'])(this, ReactRelayQueryFetcher);
	    this._selectionReferences = [];
	  }

	  // results of the root fragment;

	  /**
	   * `fetch` fetches the data for the given operation.
	   * If a result is immediately available synchronously, it will be synchronously
	   * returned by this function.
	   *
	   * Otherwise, the fetched result will be communicated via the `onDataChange` callback.
	   * `onDataChange` will be called with the first result (**if it wasn't returned synchronously**),
	   * and then subsequently whenever the data changes.
	   */
	  ReactRelayQueryFetcher.prototype.fetch = function fetch(fetchOptions) {
	    var _this = this;

	    var cacheConfig = fetchOptions.cacheConfig,
	        _fetchOptions$dataFro = fetchOptions.dataFrom,
	        dataFrom = _fetchOptions$dataFro === undefined ? NETWORK_ONLY : _fetchOptions$dataFro,
	        environment = fetchOptions.environment,
	        onDataChange = fetchOptions.onDataChange,
	        operation = fetchOptions.operation;
	    var createOperationSelector = environment.unstable_internal.createOperationSelector;

	    var nextReferences = [];
	    var fetchHasReturned = false;
	    var error = void 0;

	    this._disposeRequest();
	    this._fetchOptions = fetchOptions;

	    // Check if we can fulfill this query with data already available in memory,
	    // and immediatly return data if so
	    if (dataFrom === STORE_THEN_NETWORK && environment.check(operation.root)) {
	      this._cacheReference = environment.retain(operation.root);
	      // Don't notify the first result because it will be returned synchronously
	      this._onQueryDataAvailable({ notifyFirstResult: false });
	    }

	    var request = environment.execute({ operation: operation, cacheConfig: cacheConfig })['finally'](function () {
	      _this._pendingRequest = null;
	      _this._disposeCacheReference();
	    }).subscribe({
	      next: function next(payload) {
	        var operationForPayload = createOperationSelector(operation.node, payload.variables, payload.operation);
	        nextReferences.push(environment.retain(operationForPayload.root));
	        _this._disposeCacheReference();

	        // Only notify of the first result if `next` is being called **asynchronously**
	        // (i.e. after `fetch` has returned).
	        _this._onQueryDataAvailable({ notifyFirstResult: fetchHasReturned });
	      },
	      error: function (_error) {
	        function error(_x) {
	          return _error.apply(this, arguments);
	        }

	        error.toString = function () {
	          return _error.toString();
	        };

	        return error;
	      }(function (err) {
	        // We may have partially fulfilled the request, so let the next request
	        // or the unmount dispose of the references.
	        _this._selectionReferences = _this._selectionReferences.concat(nextReferences);

	        // Only notify of error if `error` is being called **asynchronously**
	        // (i.e. after `fetch` has returned).
	        if (fetchHasReturned) {
	          onDataChange({ error: err });
	        } else {
	          error = err;
	        }
	      }),
	      complete: function complete() {
	        _this._disposeSelectionReferences();
	        _this._selectionReferences = nextReferences;
	      },
	      unsubscribe: function unsubscribe() {
	        // Let the next request or the unmount code dispose of the references.
	        // We may have partially fulfilled the request.
	        _this._selectionReferences = _this._selectionReferences.concat(nextReferences);
	      }
	    });

	    this._pendingRequest = {
	      dispose: function dispose() {
	        request.unsubscribe();
	      }
	    };

	    fetchHasReturned = true;
	    if (error) {
	      throw error;
	    }
	    return this._snapshot;
	  };

	  ReactRelayQueryFetcher.prototype.retry = function retry() {
	    __webpack_require__(1)(this._fetchOptions, 'ReactRelayQueryFetcher: `retry` should be called after having called `fetch`');
	    return this.fetch(this._fetchOptions);
	  };

	  ReactRelayQueryFetcher.prototype.dispose = function dispose() {
	    this._disposeRequest();
	    this._disposeSelectionReferences();
	  };

	  ReactRelayQueryFetcher.prototype._disposeCacheReference = function _disposeCacheReference() {
	    if (this._cacheReference) {
	      this._cacheReference.dispose();
	      this._cacheReference = null;
	    }
	  };

	  ReactRelayQueryFetcher.prototype._disposeRequest = function _disposeRequest() {
	    this._snapshot = null;
	    this._disposeCacheReference();

	    // order is important, dispose of pendingFetch before selectionReferences
	    if (this._pendingRequest) {
	      this._pendingRequest.dispose();
	    }
	    if (this._rootSubscription) {
	      this._rootSubscription.dispose();
	      this._rootSubscription = null;
	    }
	  };

	  ReactRelayQueryFetcher.prototype._disposeSelectionReferences = function _disposeSelectionReferences() {
	    this._selectionReferences.forEach(function (r) {
	      return r.dispose();
	    });
	    this._selectionReferences = [];
	  };

	  ReactRelayQueryFetcher.prototype._onQueryDataAvailable = function _onQueryDataAvailable(_ref) {
	    var notifyFirstResult = _ref.notifyFirstResult;

	    __webpack_require__(1)(this._fetchOptions, 'ReactRelayQueryFetcher: `_onQueryDataAvailable` should have been called after having called `fetch`');
	    var _fetchOptions = this._fetchOptions,
	        environment = _fetchOptions.environment,
	        onDataChange = _fetchOptions.onDataChange,
	        operation = _fetchOptions.operation;

	    // `_onQueryDataAvailable` can be called synchronously the first time and can be called
	    // multiple times by network layers that support data subscriptions.
	    // Wait until the first payload to call `onDataChange` and subscribe for data updates.

	    if (this._snapshot) {
	      return;
	    }
	    this._snapshot = environment.lookup(operation.fragment);

	    // Subscribe to changes in the data of the root fragment
	    this._rootSubscription = environment.subscribe(this._snapshot, function (snapshot) {
	      return onDataChange({ snapshot: snapshot });
	    });

	    if (this._snapshot && notifyFirstResult) {
	      onDataChange({ snapshot: this._snapshot });
	    }
	  };

	  return ReactRelayQueryFetcher;
	}();

	ReactRelayQueryFetcher.DataFrom = DataFromEnum;


	module.exports = ReactRelayQueryFetcher;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(11));

	var _inherits3 = _interopRequireDefault(__webpack_require__(10));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function getLoadingRenderProps() {
	  return {
	    error: null,
	    props: null, // `props: null` indicates that the data is being fetched (i.e. loading)
	    retry: null
	  };
	}

	function getEmptyRenderProps() {
	  return {
	    error: null,
	    props: {}, // `props: {}` indicates no data available
	    retry: null
	  };
	}

	/**
	 * @public
	 *
	 * Orchestrates fetching and rendering data for a single view or view hierarchy:
	 * - Fetches the query/variables using the given network implementation.
	 * - Normalizes the response(s) to that query, publishing them to the given
	 *   store.
	 * - Renders the pending/fail/success states with the provided render function.
	 * - Subscribes for updates to the root data and re-renders with any changes.
	 */
	var ReactRelayQueryRenderer = function (_React$Component) {
	  (0, _inherits3['default'])(ReactRelayQueryRenderer, _React$Component);

	  function ReactRelayQueryRenderer(props, context) {
	    (0, _classCallCheck3['default'])(this, ReactRelayQueryRenderer);

	    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

	    _this._queryFetcher = new (__webpack_require__(23))();

	    _this._onDataChange = function (_ref) {
	      var error = _ref.error,
	          snapshot = _ref.snapshot;

	      _this.setState({ renderProps: _this._getRenderProps({ error: error, snapshot: snapshot }) });
	    };

	    _this.state = { renderProps: _this._fetchForProps(_this.props) };
	    return _this;
	  }

	  ReactRelayQueryRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    if (nextProps.query !== this.props.query || nextProps.environment !== this.props.environment || !__webpack_require__(7)(nextProps.variables, this.props.variables)) {
	      this.setState({
	        renderProps: this._fetchForProps(nextProps)
	      });
	    }
	  };

	  ReactRelayQueryRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
	    this._queryFetcher.dispose();
	  };

	  ReactRelayQueryRenderer.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.render !== this.props.render || nextState.renderProps !== this.state.renderProps;
	  };

	  ReactRelayQueryRenderer.prototype._getRenderProps = function _getRenderProps(_ref2) {
	    var _this2 = this;

	    var snapshot = _ref2.snapshot,
	        error = _ref2.error;

	    return {
	      error: error ? error : null,
	      props: snapshot ? snapshot.data : null,
	      retry: function retry() {
	        var syncSnapshot = _this2._queryFetcher.retry();
	        if (syncSnapshot) {
	          _this2._onDataChange({ snapshot: syncSnapshot });
	        } else if (error) {
	          // If retrying after an error and no synchronous result available,
	          // reset the render props
	          _this2.setState({ renderProps: getLoadingRenderProps() });
	        }
	      }
	    };
	  };

	  ReactRelayQueryRenderer.prototype._fetchForProps = function _fetchForProps(props) {
	    // TODO (#16225453) QueryRenderer works with old and new environment, but
	    // the flow typing doesn't quite work abstracted.
	    var environment = props.environment;

	    var query = props.query,
	        variables = props.variables;

	    if (query) {
	      var _environment$unstable = environment.unstable_internal,
	          createOperationSelector = _environment$unstable.createOperationSelector,
	          getRequest = _environment$unstable.getRequest;

	      var request = getRequest(query);
	      var operation = createOperationSelector(request, variables);

	      this._relayContext = {
	        environment: environment,
	        variables: operation.variables
	      };

	      try {
	        var snapshot = this._queryFetcher.fetch({
	          cacheConfig: props.cacheConfig,
	          dataFrom: props.dataFrom,
	          environment: environment,
	          onDataChange: this._onDataChange,
	          operation: operation
	        });
	        if (!snapshot) {
	          return getLoadingRenderProps();
	        }
	        return this._getRenderProps({ snapshot: snapshot });
	      } catch (error) {
	        return this._getRenderProps({ error: error });
	      }
	    }

	    this._relayContext = {
	      environment: environment,
	      variables: variables
	    };
	    this._queryFetcher.dispose();
	    return getEmptyRenderProps();
	  };

	  ReactRelayQueryRenderer.prototype.getChildContext = function getChildContext() {
	    return {
	      relay: this._relayContext
	    };
	  };

	  ReactRelayQueryRenderer.prototype.render = function render() {
	    // Note that the root fragment results in `renderProps.props` is already
	    // frozen by the store; this call is to freeze the renderProps object and
	    // error property if set.
	    if (true) {
	      __webpack_require__(27)(this.state.renderProps);
	    }
	    return this.props.render(this.state.renderProps);
	  };

	  return ReactRelayQueryRenderer;
	}(__webpack_require__(3).Component);

	ReactRelayQueryRenderer.childContextTypes = {
	  relay: __webpack_require__(4).Relay
	};

	module.exports = ReactRelayQueryRenderer;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _extends3 = _interopRequireDefault(__webpack_require__(16));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(11));

	var _inherits3 = _interopRequireDefault(__webpack_require__(10));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(9),
	    getComponentName = _require.getComponentName,
	    getReactComponent = _require.getReactComponent;

	var _require2 = __webpack_require__(13),
	    profileContainer = _require2.profileContainer;

	var _require3 = __webpack_require__(2),
	    Observable = _require3.Observable,
	    RelayProfiler = _require3.RelayProfiler,
	    RelayConcreteNode = _require3.RelayConcreteNode;

	var containerContextTypes = {
	  relay: __webpack_require__(4).Relay
	};

	/**
	 * Composes a React component class, returning a new class that intercepts
	 * props, resolving them with the provided fragments and subscribing for
	 * updates.
	 */
	function createContainerWithFragments(Component, fragments, taggedNode) {
	  var ComponentClass = getReactComponent(Component);
	  var componentName = getComponentName(Component);
	  var containerName = 'Relay(' + componentName + ')';

	  var Container = function (_React$Component) {
	    (0, _inherits3['default'])(Container, _React$Component);

	    function Container(props, context) {
	      (0, _classCallCheck3['default'])(this, Container);

	      var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

	      _this._handleFragmentDataUpdate = function () {
	        var profiler = RelayProfiler.profile('ReactRelayRefetchContainer.handleFragmentDataUpdate');
	        _this.setState({ data: _this._resolver.resolve() }, profiler.stop);
	      };

	      _this._refetch = function (refetchVariables, renderVariables, observerOrCallback, options) {
	        var _assertRelayContext = assertRelayContext(_this.context.relay),
	            environment = _assertRelayContext.environment,
	            rootVariables = _assertRelayContext.variables;

	        var fetchVariables = typeof refetchVariables === 'function' ? refetchVariables(_this._getFragmentVariables()) : refetchVariables;
	        fetchVariables = (0, _extends3['default'])({}, rootVariables, fetchVariables);
	        var fragmentVariables = renderVariables ? (0, _extends3['default'])({}, rootVariables, renderVariables) : fetchVariables;
	        var cacheConfig = options ? { force: !!options.force } : undefined;

	        var observer = typeof observerOrCallback === 'function' ? {
	          // callback is not exectued on complete or unsubscribe
	          // for backward compatibility
	          next: observerOrCallback,
	          error: observerOrCallback
	        } : observerOrCallback || {};

	        var _this$context$relay$e = _this.context.relay.environment.unstable_internal,
	            createOperationSelector = _this$context$relay$e.createOperationSelector,
	            getRequest = _this$context$relay$e.getRequest;

	        var query = getRequest(taggedNode);
	        if (query.kind === RelayConcreteNode.BATCH_REQUEST) {
	          throw new Error('ReactRelayRefetchContainer: Batch request not yet ' + 'implemented (T22955000)');
	        }
	        var operation = createOperationSelector(query, fetchVariables);

	        // Immediately retain the results of the query to prevent cached
	        // data from being evicted
	        var reference = environment.retain(operation.root);
	        _this._references.push(reference);

	        _this._localVariables = fetchVariables;

	        // Cancel any previously running refetch.
	        _this._refetchSubscription && _this._refetchSubscription.unsubscribe();

	        // Declare refetchSubscription before assigning it in .start(), since
	        // synchronous completion may call callbacks .subscribe() returns.
	        var refetchSubscription = void 0;
	        environment.execute({ operation: operation, cacheConfig: cacheConfig }).mergeMap(function (response) {
	          _this._relayContext = {
	            environment: _this.context.relay.environment,
	            variables: fragmentVariables
	          };
	          _this._resolver.setVariables(fragmentVariables);
	          return Observable.create(function (sink) {
	            return _this.setState({ data: _this._resolver.resolve() }, function () {
	              sink.next();
	              sink.complete();
	            });
	          });
	        })['finally'](function () {
	          // Finalizing a refetch should only clear this._refetchSubscription
	          // if the finizing subscription is the most recent call.
	          if (_this._refetchSubscription === refetchSubscription) {
	            _this._refetchSubscription = null;
	          }
	        }).subscribe((0, _extends3['default'])({}, observer, {
	          start: function start(subscription) {
	            _this._refetchSubscription = refetchSubscription = subscription;
	            observer.start && observer.start(subscription);
	          }
	        }));

	        return {
	          dispose: function dispose() {
	            refetchSubscription && refetchSubscription.unsubscribe();
	          }
	        };
	      };

	      var relay = assertRelayContext(context.relay);
	      var createFragmentSpecResolver = relay.environment.unstable_internal.createFragmentSpecResolver;

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
	      var context = __webpack_require__(17)(nextContext);
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
	      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !__webpack_require__(7)(prevIDs, nextIDs)) {
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
	        if (!fragments.hasOwnProperty(_key) && !__webpack_require__(15)(nextProps[_key], this.props[_key])) {
	          return true;
	        }
	      }
	      return false;
	    };

	    Container.prototype._release = function _release() {
	      this._resolver.dispose();
	      this._references.forEach(function (disposable) {
	        return disposable.dispose();
	      });
	      this._references.length = 0;
	      this._refetchSubscription && this._refetchSubscription.unsubscribe();
	    };

	    Container.prototype._buildRelayProp = function _buildRelayProp(relay) {
	      return {
	        environment: relay.environment,
	        refetch: this._refetch
	      };
	    };

	    /**
	     * Render new data for the existing props/context.
	     */


	    Container.prototype._getFragmentVariables = function _getFragmentVariables() {
	      var getVariablesFromObject = this.context.relay.environment.unstable_internal.getVariablesFromObject;

	      return getVariablesFromObject(this.context.relay.variables, fragments, this.props);
	    };

	    Container.prototype.getChildContext = function getChildContext() {
	      return { relay: this._relayContext };
	    };

	    Container.prototype.render = function render() {
	      if (ComponentClass) {
	        return __webpack_require__(3).createElement(ComponentClass, (0, _extends3['default'])({}, this.props, this.state.data, {
	          // TODO: Remove the string ref fallback.
	          ref: this.props.componentRef || 'component',
	          relay: this.state.relayProp
	        }));
	      } else {
	        // Stateless functional, doesn't support `ref`
	        return __webpack_require__(3).createElement(Component, (0, _extends3['default'])({}, this.props, this.state.data, {
	          relay: this.state.relayProp
	        }));
	      }
	    };

	    return Container;
	  }(__webpack_require__(3).Component);

	  profileContainer(Container, 'ReactRelayRefetchContainer');
	  Container.contextTypes = containerContextTypes;
	  Container.displayName = containerName;

	  return Container;
	}

	function assertRelayContext(relay) {
	  __webpack_require__(1)(__webpack_require__(5)(relay), 'ReactRelayRefetchContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
	  return relay;
	}

	/**
	 * Wrap the basic `createContainer()` function with logic to adapt to the
	 * `context.relay.environment` in which it is rendered. Specifically, the
	 * extraction of the environment-specific version of fragments in the
	 * `fragmentSpec` is memoized once per environment, rather than once per
	 * instance of the container constructed/rendered.
	 */
	function createContainer(Component, fragmentSpec, taggedNode) {
	  var Container = __webpack_require__(14)(Component, fragmentSpec, function (ComponentClass, fragments) {
	    return createContainerWithFragments(ComponentClass, fragments, taggedNode);
	  });
	  /* $FlowFixMe(>=0.53.0) This comment suppresses an error
	   * when upgrading Flow's support for React. Common errors found when
	   * upgrading Flow's React support are documented at
	   * https://fburl.com/eq7bs81w */
	  Container.childContextTypes = containerContextTypes;
	  return Container;
	}

	module.exports = { createContainer: createContainer, createContainerWithFragments: createContainerWithFragments };

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

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

	/**
	 * Fail fast if the user supplies invalid fragments as input.
	 */
	function assertFragmentMap(componentName, fragments) {
	  __webpack_require__(1)(fragments && typeof fragments === 'object', 'Could not create Relay Container for `%s`. ' + 'Expected a set of GraphQL fragments, got `%s` instead.', componentName, fragments);

	  for (var key in fragments) {
	    if (fragments.hasOwnProperty(key)) {
	      var fragment = fragments[key];
	      __webpack_require__(1)(fragment && (typeof fragment === 'object' || typeof fragment === 'function'), 'Could not create Relay Container for `%s`. ' + 'The value of fragment `%s` was expected to be a fragment, got `%s` instead.', componentName, key, fragment);
	    }
	  }
	}

	module.exports = assertFragmentMap;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * @providesModule deepFreeze
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Recursively "deep" freezes the supplied object.
	 *
	 * For convenience, and for consistency with the behavior of `Object.freeze`,
	 * returns the now-frozen original object.
	 */

	function deepFreeze(object) {
	  Object.freeze(object);
	  Object.getOwnPropertyNames(object).forEach(function (name) {
	    var property = object[name];
	    if (property && typeof property === 'object' && !Object.isFrozen(property)) {
	      deepFreeze(property);
	    }
	  });
	  return object;
	}

	module.exports = deepFreeze;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

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

	function isRelayContainer(component) {
	  return !!(component && component.getFragmentNames && component.getFragment && component.hasFragment && component.hasVariable);
	}

	module.exports = isRelayContainer;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

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

	/**
	 * Determine if the object is a plain object that matches the `Variables` type.
	 */

	function isRelayVariables(variables) {
	  return typeof variables === 'object' && variables !== null && !Array.isArray(variables);
	}

	module.exports = isRelayVariables;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_30__;

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_31__;

/***/ })
/******/ ])
});
;