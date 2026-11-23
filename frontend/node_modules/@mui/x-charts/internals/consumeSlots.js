"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consumeSlots = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _styles = require("@mui/material/styles");
var _resolveProps = _interopRequireDefault(require("@mui/utils/resolveProps"));
var _useSlotProps2 = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps"],
  _excluded2 = ["ownerState"];
/**
 * A higher order component that consumes a slot from the props and renders the component provided in the slot.
 *
 * This HOC will wrap a single component, and will render the component provided in the slot, if it exists.
 *
 * If you need to render multiple components, you can manually consume the slots from the props and render them in your component instead of using this HOC.
 *
 * In the example below, `MyComponent` will render the component provided in `mySlot` slot, if it exists. Otherwise, it will render the `DefaultComponent`.
 *
 * @example
 *
 * ```tsx
 * type MyComponentProps = {
 *   direction: 'row' | 'column';
 *   slots?: {
 *     mySlot?: React.JSXElementConstructor<{ direction: 'row' | 'column' }>;
 *   }
 * };
 *
 * const MyComponent = consumeSlots(
 *   'MuiMyComponent',
 *   'mySlot',
 *   function DefaultComponent(props: MyComponentProps) {
 *     return (
 *       <div className={props.classes.root}>
 *         {props.direction}
 *       </div>
 *     );
 *   }
 * );
 * ```
 *
 * @param {string} name The mui component name.
 * @param {string} slotPropName The name of the prop to retrieve the slot from.
 * @param {object} options Options for the HOC.
 * @param {boolean} options.propagateSlots Whether to propagate the slots to the component, this is always false if the slot is provided.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Array<keyof Props>} options.omitProps An array of props to omit from the component.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
const consumeSlots = (name, slotPropName, options, InComponent) => {
  function ConsumeSlotsInternal(props, ref) {
    const themedProps = (0, _styles.useThemeProps)({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name
    });
    const defaultProps = typeof options.defaultProps === 'function' ? options.defaultProps(themedProps) : options.defaultProps ?? {};
    const defaultizedProps = (0, _resolveProps.default)(defaultProps, themedProps);
    const _ref = defaultizedProps,
      {
        slots,
        slotProps
      } = _ref,
      other = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
    const theme = (0, _styles.useTheme)();
    const classes = options.classesResolver?.(defaultizedProps, theme);

    // Can be a function component or a forward ref component.
    const Component = slots?.[slotPropName] ?? InComponent;
    const propagateSlots = options.propagateSlots && !slots?.[slotPropName];
    const _useSlotProps = (0, _useSlotProps2.default)({
        elementType: Component,
        externalSlotProps: slotProps?.[slotPropName],
        additionalProps: (0, _extends2.default)({}, other, {
          classes
        }, propagateSlots && {
          slots,
          slotProps
        }),
        ownerState: {}
      }),
      originalOutProps = (0, _objectWithoutPropertiesLoose2.default)(_useSlotProps, _excluded2);
    const outProps = (0, _extends2.default)({}, originalOutProps);
    for (const prop of options.omitProps ?? []) {
      delete outProps[prop];
    }
    if (process.env.NODE_ENV !== 'production') {
      Component.displayName = `${name}.slots.${slotPropName}`;
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, (0, _extends2.default)({}, outProps, {
      ref: ref
    }));
  }
  return /*#__PURE__*/React.forwardRef(ConsumeSlotsInternal);
};
exports.consumeSlots = consumeSlots;
if (process.env.NODE_ENV !== "production") consumeSlots.displayName = "consumeSlots";