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

var _taggedTemplateLiteral3 = _interopRequireDefault(require('./taggedTemplateLiteral'));

var _templateObject = (0, _taggedTemplateLiteral3['default'])(['\n    fragment ReactRelayFragmentContainerFlowtest_Foo_viewer on Viewer {\n      actor {\n        id\n      }\n    }\n  '], ['\n    fragment ReactRelayFragmentContainerFlowtest_Foo_viewer on Viewer {\n      actor {\n        id\n      }\n    }\n  ']),
    _templateObject2 = (0, _taggedTemplateLiteral3['default'])(['\n    fragment ReactRelayFragmentContainerFlowtest_Bar_viewer on Viewer {\n      actor {\n        id\n      }\n    }\n  '], ['\n    fragment ReactRelayFragmentContainerFlowtest_Bar_viewer on Viewer {\n      actor {\n        id\n      }\n    }\n  ']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./ReactRelayPublic'),
    graphql = _require.graphql,
    createFragmentContainer = _require.createFragmentContainer;

/**
 * Verifies that normal prop type checking, as well as the methods proxying Relay does, is
 * type-checked correctly on Relay components.
 */

var FooComponent = function FooComponent(_ref) {
  var requiredProp = _ref.requiredProp;
  return require('react').createElement(
    'div',
    null,
    requiredProp
  );
};

// Note that we must reassign to a new identifier to make sure flow doesn't propogate types without
// the relay type definition doing the work.
var Foo = createFragmentContainer(FooComponent, graphql(_templateObject));

var BarComponent = function (_React$Component) {
  (0, _inherits3['default'])(BarComponent, _React$Component);

  function BarComponent() {
    (0, _classCallCheck3['default'])(this, BarComponent);
    return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
  }

  BarComponent.prototype.getNum = function getNum() {
    return 42;
  };

  BarComponent.prototype.render = function render() {
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

  return BarComponent;
}(require('react').Component);

BarComponent.defaultProps = {
  defaultProp: 'default'
};

var Bar = createFragmentContainer(BarComponent, graphql(_templateObject2));

module.exports = {
  checkMissingPropOnFunctionalComponent: function checkMissingPropOnFunctionalComponent() {
    /** $FlowExpectedError: Foo missing `requiredProp` **/
    return require('react').createElement(Foo, null);
  },
  checkMinimalPropsOnFunctionalComponent: function checkMinimalPropsOnFunctionalComponent() {
    // Fine, no expected errors
    return require('react').createElement(Foo, { requiredProp: 'foo' });
  },
  checkMissingPropOnClassComponent: function checkMissingPropOnClassComponent() {
    /** $FlowExpectedError: Bar missing `requiredProp` **/
    return require('react').createElement(Bar, null);
  },
  checkMinimalPropsOnClassComponent: function checkMinimalPropsOnClassComponent() {
    // All is well
    return require('react').createElement(Bar, { requiredProp: 'foo' });
  },
  checkWrongPropType: function checkWrongPropType() {
    /** $FlowExpectedError: Bar wrong `requiredProp` type, should be string **/
    return require('react').createElement(Bar, { requiredProp: 17 });
  },
  checkWrongOptionalType: function checkWrongOptionalType() {
    /** $FlowExpectedError: Bar wrong `optionalProp` type, should be `{foo: string}` **/
    return require('react').createElement(Bar, { optionalProp: 'wrongType', requiredProp: 'foo' });
  },
  checkNullOptionalType: function checkNullOptionalType() {
    /** $FlowExpectedError: Bar `optionalProp` must be omitted or truthy, not null **/
    return require('react').createElement(Bar, { optionalProp: null, requiredProp: 'foo' });
  },
  checkWrongDefaultPropType: function checkWrongDefaultPropType() {
    /** $FlowExpectedError: Bar wrong `defaultProp` type, should be string **/
    return require('react').createElement(Bar, { defaultProp: false, requiredProp: 'foo' });
  },
  checkAllPossibleProps: function checkAllPossibleProps() {
    // All is well
    return require('react').createElement(Bar, { defaultProp: 'bar', optionalProp: { foo: 42 }, requiredProp: 'foo' });
  },
  checkMinimalPropSpread: function checkMinimalPropSpread() {
    // All is well
    var props = { requiredProp: 'foo' };
    return require('react').createElement(Bar, props);
  },
  checkMissingPropSpread: function checkMissingPropSpread() {
    var props = { defaultProp: 'foo' };
    /** $FlowExpectedError: Bar missing `requiredProp` with spread **/
    return require('react').createElement(Bar, props);
  },
  checkStaticsAndMethodsProxying: function checkStaticsAndMethodsProxying() {
    var ProxyChecker = function (_React$PureComponent) {
      (0, _inherits3['default'])(ProxyChecker, _React$PureComponent);

      function ProxyChecker() {
        (0, _classCallCheck3['default'])(this, ProxyChecker);
        return (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.apply(this, arguments));
      }

      ProxyChecker.prototype.getString = function getString() {
        var ok = this._barRef ? this._barRef.getNum() : 'default'; // legit

        /** $FlowExpectedError: Bar does not have `missingMethod` **/
        var bad = this._barRef ? this._barRef.missingMethod() : 'default';

        /** $FlowExpectedError: Bar `getNum` gives number, but `getString` assumes string  **/
        return bad ? 'not good' : ok;
      };

      ProxyChecker.prototype.render = function render() {
        var _this3 = this;

        return require('react').createElement(Bar, {
          componentRef: function componentRef(ref) {
            _this3._barRef = ref;
          },
          requiredProp: 'bar'
        });
      };

      return ProxyChecker;
    }(require('react').PureComponent);

    return require('react').createElement(ProxyChecker, null);
  }
};