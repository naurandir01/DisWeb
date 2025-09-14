"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsItemTooltipContent = ChartsItemTooltipContent;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _chartsTooltipClasses = require("./chartsTooltipClasses");
var _useItemTooltip = require("./useItemTooltip");
var _ChartsTooltipTable = require("./ChartsTooltipTable");
var _ChartsLabelMark = require("../ChartsLabel/ChartsLabelMark");
var _jsxRuntime = require("react/jsx-runtime");
function ChartsItemTooltipContent(props) {
  const {
    classes: propClasses,
    sx
  } = props;
  const tooltipData = (0, _useItemTooltip.useInternalItemTooltip)();
  const classes = (0, _chartsTooltipClasses.useUtilityClasses)(propClasses);
  if (!tooltipData) {
    return null;
  }
  if ('values' in tooltipData) {
    const {
      label: seriesLabel,
      color,
      markType
    } = tooltipData;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipPaper, {
      sx: sx,
      className: classes.paper,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipTable, {
        className: classes.table,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
          component: "caption",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: classes.markContainer,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsLabelMark.ChartsLabelMark, {
              type: markType,
              color: color,
              className: classes.mark
            })
          }), seriesLabel]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("tbody", {
          children: tooltipData.values.map(({
            formattedValue,
            label
          }) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipRow, {
            className: classes.row,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
              className: (0, _clsx.default)(classes.labelCell, classes.cell),
              component: "th",
              children: label
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
              className: (0, _clsx.default)(classes.valueCell, classes.cell),
              component: "td",
              children: formattedValue
            })]
          }, label))
        })]
      })
    });
  }
  const {
    color,
    label,
    formattedValue,
    markType
  } = tooltipData;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipPaper, {
    sx: sx,
    className: classes.paper,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipTable, {
      className: classes.table,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("tbody", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipRow, {
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
            }), label]
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
            className: (0, _clsx.default)(classes.valueCell, classes.cell),
            component: "td",
            children: formattedValue
          })]
        })
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? ChartsItemTooltipContent.propTypes = {
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