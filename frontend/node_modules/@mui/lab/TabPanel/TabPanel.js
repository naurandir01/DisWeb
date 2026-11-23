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
var _clsx = _interopRequireDefault(require("clsx"));
var _styles = require("@mui/material/styles");
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _tabPanelClasses = require("./tabPanelClasses");
var _TabContext = require("../TabContext");
var _jsxRuntime = require("react/jsx-runtime");
const useUtilityClasses = ownerState => {
  const {
    classes,
    hidden
  } = ownerState;
  const slots = {
    root: ['root', hidden && 'hidden']
  };
  return (0, _composeClasses.default)(slots, _tabPanelClasses.getTabPanelUtilityClass, classes);
};
const TabPanelRoot = (0, _styles.styled)('div', {
  name: 'MuiTabPanel',
  slot: 'Root'
})(({
  theme
}) => ({
  padding: theme.spacing(3)
}));
const TabPanel = /*#__PURE__*/React.forwardRef(function TabPanel(inProps, ref) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiTabPanel'
  });
  const {
    children,
    className,
    value,
    keepMounted = false,
    ...other
  } = props;
  const ownerState = {
    ...props
  };
  const classes = useUtilityClasses(ownerState);
  const context = (0, _TabContext.useTabContext)();
  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const id = (0, _TabContext.getPanelId)(context, value);
  const tabId = (0, _TabContext.getTabId)(context, value);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(TabPanelRoot, {
    "aria-labelledby": tabId,
    className: (0, _clsx.default)(classes.root, className),
    hidden: value !== context.value,
    id: id,
    ref: ref,
    role: "tabpanel",
    ownerState: ownerState,
    ...other,
    children: (keepMounted || value === context.value) && children
  });
});
process.env.NODE_ENV !== "production" ? TabPanel.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: _propTypes.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * @ignore
   */
  className: _propTypes.default.string,
  /**
   * Always keep the children in the DOM.
   * @default false
   */
  keepMounted: _propTypes.default.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  /**
   * The `value` of the corresponding `Tab`. Must use the index of the `Tab` when
   * no `value` was passed to `Tab`.
   */
  value: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired
} : void 0;
var _default = exports.default = TabPanel;