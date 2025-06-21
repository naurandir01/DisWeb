"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsGrid = ChartsGrid;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _styles = require("@mui/material/styles");
var _chartsGridClasses = require("./chartsGridClasses");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _styledComponents = require("./styledComponents");
var _ChartsVerticalGrid = require("./ChartsVerticalGrid");
var _ChartsHorizontalGrid = require("./ChartsHorizontalGrid");
var _useAxis = require("../hooks/useAxis");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["vertical", "horizontal"];
const useUtilityClasses = ({
  classes
}) => {
  const slots = {
    root: ['root'],
    verticalLine: ['line', 'verticalLine'],
    horizontalLine: ['line', 'horizontalLine']
  };
  return (0, _composeClasses.default)(slots, _chartsGridClasses.getChartsGridUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsGrid API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsGrid(inProps) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiChartsGrid'
  });
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const {
      vertical,
      horizontal
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    xAxis,
    xAxisIds
  } = (0, _useAxis.useXAxes)();
  const {
    yAxis,
    yAxisIds
  } = (0, _useAxis.useYAxes)();
  const classes = useUtilityClasses(props);
  const horizontalAxis = yAxis[yAxisIds[0]];
  const verticalAxis = xAxis[xAxisIds[0]];
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styledComponents.GridRoot, (0, _extends2.default)({}, other, {
    className: classes.root,
    children: [vertical && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsVerticalGrid.ChartsGridVertical, {
      axis: verticalAxis,
      start: drawingArea.top,
      end: drawingArea.height + drawingArea.top,
      classes: classes
    }), horizontal && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsHorizontalGrid.ChartsGridHorizontal, {
      axis: horizontalAxis,
      start: drawingArea.left,
      end: drawingArea.width + drawingArea.left,
      classes: classes
    })]
  }));
}
process.env.NODE_ENV !== "production" ? ChartsGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * Displays horizontal grid.
   */
  horizontal: _propTypes.default.bool,
  /**
   * Displays vertical grid.
   */
  vertical: _propTypes.default.bool
} : void 0;