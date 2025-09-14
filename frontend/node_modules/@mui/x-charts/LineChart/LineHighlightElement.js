"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineHighlightElement = LineHighlightElement;
exports.getHighlightElementUtilityClass = getHighlightElementUtilityClass;
exports.lineHighlightElementClasses = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactMajor = _interopRequireDefault(require("@mui/x-internals/reactMajor"));
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _getSymbol = require("../internals/getSymbol");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["x", "y", "id", "classes", "color", "shape"];
function getHighlightElementUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiHighlightElement', slot);
}
const lineHighlightElementClasses = exports.lineHighlightElementClasses = (0, _generateUtilityClasses.default)('MuiHighlightElement', ['root']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`]
  };
  return (0, _composeClasses.default)(slots, getHighlightElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props) {
  const {
      x,
      y,
      color,
      shape
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const classes = useUtilityClasses(props);
  const Element = shape === 'circle' ? 'circle' : 'path';
  const additionalProps = shape === 'circle' ? {
    cx: 0,
    cy: 0,
    r: other.r === undefined ? 5 : other.r
  } : {
    d: (0, _d3Shape.symbol)(_d3Shape.symbolsFill[(0, _getSymbol.getSymbol)(shape)])()
  };

  // React 18 does not recognize `transformOrigin` and React 19 does not recognize `transform-origin`
  const transformOrigin = _reactMajor.default > 18 ? {
    transformOrigin: `${x} ${y}`
  } : {
    'transform-origin': `${x} ${y}`
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Element, (0, _extends2.default)({
    pointerEvents: "none",
    className: classes.root,
    transform: `translate(${x} ${y})`,
    fill: color
  }, transformOrigin, additionalProps, other));
}
process.env.NODE_ENV !== "production" ? LineHighlightElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  shape: _propTypes.default.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']).isRequired
} : void 0;