"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxisTooltipContent = ChartsAxisTooltipContent;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _clsx = _interopRequireDefault(require("clsx"));
var _chartsTooltipClasses = require("./chartsTooltipClasses");
var _ChartsTooltipTable = require("./ChartsTooltipTable");
var _useAxesTooltip = require("./useAxesTooltip");
var _ChartsLabelMark = require("../ChartsLabel/ChartsLabelMark");
var _jsxRuntime = require("react/jsx-runtime");
function ChartsAxisTooltipContent(props) {
  const classes = (0, _chartsTooltipClasses.useUtilityClasses)(props.classes);
  const tooltipData = (0, _useAxesTooltip.useAxesTooltip)();
  if (tooltipData === null) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipPaper, {
    sx: props.sx,
    className: classes.paper,
    children: tooltipData.map(({
      axisId,
      mainAxis,
      axisValue,
      axisFormattedValue,
      seriesItems
    }) => {
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipTable, {
        className: classes.table,
        children: [axisValue != null && !mainAxis.hideTooltip && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          component: "caption",
          children: axisFormattedValue
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("tbody", {
          children: seriesItems.map(({
            seriesId,
            color,
            formattedValue,
            formattedLabel,
            markType
          }) => {
            if (formattedValue == null) {
              return null;
            }
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipRow, {
              className: classes.row,
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipCell, {
                className: (0, _clsx.default)(classes.labelCell, classes.cell),
                component: "th",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                  className: classes.markContainer,
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsLabelMark.ChartsLabelMark, {
                    type: markType,
                    color: color,
                    className: classes.mark
                  })
                }), formattedLabel || null]
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
                className: (0, _clsx.default)(classes.valueCell, classes.cell),
                component: "td",
                children: formattedValue
              })]
            }, seriesId);
          })
        })]
      }, axisId);
    })
  });
}
process.env.NODE_ENV !== "production" ? ChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;