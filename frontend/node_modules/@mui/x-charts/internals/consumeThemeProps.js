"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consumeThemeProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _styles = require("@mui/material/styles");
var _resolveProps = _interopRequireDefault(require("@mui/utils/resolveProps"));
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
/**
 * A higher order component that consumes and merges the theme `defaultProps` and handles the `classes` and renders the component.
 *
 * This HOC will wrap a single component.
 * If you need to render multiple components, you can manually consume the theme and render them in your component instead of using this HOC.
 *
 * In the example below, `MyComponent` will render the `DefaultComponent` with the `direction` prop set to `'row'` and the className set to `'my-custom-root'`.
 *
 * @example
 * ```tsx
 * createTheme({
 *   components: {
 *     MuiMyComponent: {
 *       defaultProps: {
 *         direction: 'row',
 *       },
 *     },
 *   },
 * })
 *
 * type MyComponentProps = {
 *   direction: 'row' | 'column';
 *   classes?: Record<'root', string>;
 * };
 *
 * const MyComponent = consumeThemeProps(
 *   'MuiMyComponent',
 *   function DefaultComponent(props: MyComponentProps) {
 *     return (
 *       <div className={props.classes.root}>
 *         {props.direction}
 *       </div>
 *     );
 *   }
 * );
 *
 * render(<MyComponent classes={{ root: 'my-custom-root' }} />);
 * ```
 *
 * @param {string} name The mui component name.
 * @param {object} options Options for the HOC.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
const consumeThemeProps = (name, options, InComponent) => /*#__PURE__*/React.forwardRef(function ConsumeThemeInternal(props, ref) {
  const themedProps = (0, _styles.useThemeProps)({
    props,
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    name
  });
  const defaultProps = typeof options.defaultProps === 'function' ? options.defaultProps(themedProps) : options.defaultProps ?? {};
  const outProps = (0, _resolveProps.default)(defaultProps, themedProps);
  const theme = (0, _styles.useTheme)();
  const classes = options.classesResolver?.(outProps, theme);
  const OutComponent = /*#__PURE__*/React.forwardRef(InComponent);
  if (process.env.NODE_ENV !== "production") OutComponent.displayName = "OutComponent";
  if (process.env.NODE_ENV !== 'production') {
    OutComponent.displayName = `consumeThemeProps(${name})`;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(OutComponent, (0, _extends2.default)({}, outProps, {
    classes: classes,
    ref: ref
  }));
});
exports.consumeThemeProps = consumeThemeProps;
if (process.env.NODE_ENV !== "production") consumeThemeProps.displayName = "consumeThemeProps";