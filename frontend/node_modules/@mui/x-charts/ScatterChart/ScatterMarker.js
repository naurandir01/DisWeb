"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScatterMarker = ScatterMarker;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["seriesId", "isFaded", "isHighlighted", "x", "y", "color", "size", "dataIndex"];
function ScatterMarker(props) {
  const {
      isFaded,
      isHighlighted,
      x,
      y,
      color,
      size
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("circle", (0, _extends2.default)({
    cx: 0,
    cy: 0,
    r: (isHighlighted ? 1.2 : 1) * size,
    transform: `translate(${x}, ${y})`,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
    cursor: other.onClick ? 'pointer' : 'unset'
  }, other));
}
process.env.NODE_ENV !== "production" ? ScatterMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The fill color of the marker.
   */
  color: _propTypes.default.string.isRequired,
  /**
   * The index of the data point.
   */
  dataIndex: _propTypes.default.number.isRequired,
  /**
   * If `true`, the marker is faded.
   */
  isFaded: _propTypes.default.bool.isRequired,
  /**
   * If `true`, the marker is highlighted.
   */
  isHighlighted: _propTypes.default.bool.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick: _propTypes.default.func,
  /**
   * The series ID.
   */
  seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * The size of the marker.
   */
  size: _propTypes.default.number.isRequired,
  /**
   * The x coordinate of the data point.
   */
  x: _propTypes.default.number.isRequired,
  /**
   * The y coordinate of the data point.
   */
  y: _propTypes.default.number.isRequired
} : void 0;