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

var _taggedTemplateLiteral3 = _interopRequireDefault(require('./taggedTemplateLiteral'));

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _possibleConstructorReturn3 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));

var _inherits3 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));

var _templateObject = (0, _taggedTemplateLiteral3['default'])(['\n    fragment ReactRelayRefetchContainerFlowtest_Foo_viewer on Viewer {\n      all_friends(after: $cursor, first: $count) @connection {\n        edges {\n          node {\n            __typename\n          }\n        }\n      }\n    }\n  '], ['\n    fragment ReactRelayRefetchContainerFlowtest_Foo_viewer on Viewer {\n      all_friends(after: $cursor, first: $count) @connection {\n        edges {\n          node {\n            __typename\n          }\n        }\n      }\n    }\n  ']),
    _templateObject2 = (0, _taggedTemplateLiteral3['default'])(['\n    query ReactRelayRefetchContainerFlowtest_Foo_ViewerQuery(\n      $count: Int!\n      $cursor: ID\n    ) {\n      viewer {\n        ...Foo_viewer\n      }\n    }\n  '], ['\n    query ReactRelayRefetchContainerFlowtest_Foo_ViewerQuery(\n      $count: Int!\n      $cursor: ID\n    ) {\n      viewer {\n        ...Foo_viewer\n      }\n    }\n  ']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./ReactRelayPublic'),
    graphql = _require.graphql,
    createRefetchContainer = _require.createRefetchContainer;

/**
 * Verifies that normal prop type checking works correctly on Relay components.
 */

/* $FlowFixMe(>=0.53.0) This comment suppresses an error
 * when upgrading Flow's support for React. Common errors found when upgrading
 * Flow's React support are documented at https://fburl.com/eq7bs81w */


var FooComponent = function (_React$Component) {
  (0, _inherits3['default'])(FooComponent, _React$Component);

  function FooComponent() {
    (0, _classCallCheck3['default'])(this, FooComponent);
    return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
  }

  FooComponent.prototype.getNum = function getNum() {
    return 42;
  };

  FooComponent.prototype.render = function render() {
    var reqLen = this.props.requiredProp.length;
    var optionalProp = this.props.optionalProp;

    /** $FlowExpectedError: `optionalProp` might be null **/
    var optionalFoo = this.props.optionalProp.foo;

    /** $FlowExpectedError: there is no prop `missingProp` **/
    var missing = this.props.missingProp;

    var defLen = this.props.defaultProp.length; // always a valid string, so no error
    return require('react').createElement(
      'div',
      null,
      reqLen && optionalProp && optionalFoo && missing && defLen
    );
  };

  return FooComponent;
}(require('react').Component);
// Note that we must reassign to a new identifier to make sure flow doesn't propogate types without
// the relay type definition doing the work.


FooComponent.defaultProps = {
  defaultProp: 'default'
};
var Foo = createRefetchContainer(FooComponent, graphql(_templateObject), graphql(_templateObject2));

module.exports = {
  checkMissingProp: function checkMissingProp() {
    /** $ShouldBeFlowExpectedError: Foo missing `requiredProp` **/
    return require('react').createElement(Foo, null);
  },
  checkMinimalProps: function checkMinimalProps() {
    // All is well
    return require('react').createElement(Foo, { requiredProp: 'foo' });
  },
  checkWrongPropType: function checkWrongPropType() {
    /** $ShouldBeFlowExpectedError: Foo1 wrong `requiredProp` type, should be string **/
    return require('react').createElement(Foo, { requiredProp: 17 });
  },
  checkWrongOptionalType: function checkWrongOptionalType() {
    /** $ShouldBeFlowExpectedError: Foo wrong `optionalProp` type, should be `{foo: string}` **/
    return require('react').createElement(Foo, { optionalProp: 'wrongType', requiredProp: 'foo' });
  },
  checkNullOptionalType: function checkNullOptionalType() {
    /** $ShouldBeFlowExpectedError: Foo `optionalProp` must be omitted or truthy, not null **/
    return require('react').createElement(Foo, { optionalProp: null, requiredProp: 'foo' });
  },
  checkWrongDefaultPropType: function checkWrongDefaultPropType() {
    /** $ShouldBeFlowExpectedError: Foo wrong `defaultProp` type, should be string **/
    return require('react').createElement(Foo, { defaultProp: false, requiredProp: 'foo' });
  },
  checkAllPossibleProps: function checkAllPossibleProps() {
    // All is well
    return require('react').createElement(Foo, { defaultProp: 'bar', optionalProp: { foo: 42 }, requiredProp: 'foo' });
  },
  checkMinimalPropSpread: function checkMinimalPropSpread() {
    // All is well
    var props = { requiredProp: 'foo' };
    return require('react').createElement(Foo, props);
  },
  checkMissingPropSpread: function checkMissingPropSpread() {
    var props = { defaultProp: 'foo' };
    /** $ShouldBeFlowExpectedError: Foo missing `requiredProp` with spread **/
    return require('react').createElement(Foo, props);
  },
  checkStaticsAndMethodsProxying: function checkStaticsAndMethodsProxying() {
    /* $FlowFixMe(>=0.53.0) This comment suppresses an
     * error when upgrading Flow's support for React. Common errors found when
     * upgrading Flow's React support are documented at
     * https://fburl.com/eq7bs81w */
    var ProxyChecker = function (_React$PureComponent) {
      (0, _inherits3['default'])(ProxyChecker, _React$PureComponent);

      function ProxyChecker() {
        (0, _classCallCheck3['default'])(this, ProxyChecker);
        return (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.apply(this, arguments));
      }

      ProxyChecker.prototype.getString = function getString() {
        var ok = this._fooRef ? this._fooRef.getNum() : 'default'; // legit

        /** $FlowExpectedError: Foo does not have `missingMethod` **/
        var bad = this._fooRef ? this._fooRef.missingMethod() : 'default';

        /** $FlowExpectedError: Foo `getNum` gives number, but `getString` assumes string  **/
        return bad ? 'not good' : ok;
      };

      ProxyChecker.prototype.render = function render() {
        var _this3 = this;

        return require('react').createElement(Foo, {
          componentRef: function componentRef(ref) {
            _this3._fooRef = ref;
          },
          requiredProp: 'bar'
        });
      };

      return ProxyChecker;
    }(require('react').PureComponent);

    return require('react').createElement(ProxyChecker, null);
  }
};