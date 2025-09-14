"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Tabs = _interopRequireDefault(require("@mui/material/Tabs"));
var _TabContext = require("../TabContext");
var _jsxRuntime = require("react/jsx-runtime");
const TabList = /*#__PURE__*/React.forwardRef(function TabList(props, ref) {
  const {
    children: childrenProp,
    ...other
  } = props;
  const context = (0, _TabContext.useTabContext)();
  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const children = React.Children.map(childrenProp, child => {
    if (! /*#__PURE__*/React.isValidElement(child)) {
      return null;
    }
    return /*#__PURE__*/React.cloneElement(child, {
      // SOMEDAY: `Tabs` will set those themselves
      'aria-controls': (0, _TabContext.getPanelId)(context, child.props.value),
      id: (0, _TabContext.getTabId)(context, child.props.value)
    });
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tabs.default, {
    ...other,
    ref: ref,
    value: context.value,
    children: children
  });
});
process.env.NODE_ENV !== "production" ? TabList.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * A list of `<Tab />` elements.
   */
  children: _propTypes.default.node
} : void 0;
var _default = exports.default = TabList;