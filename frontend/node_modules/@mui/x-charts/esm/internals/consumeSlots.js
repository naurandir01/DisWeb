import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["slots", "slotProps"],
  _excluded2 = ["ownerState"];
import { useTheme, useThemeProps } from '@mui/material/styles';
import resolveProps from '@mui/utils/resolveProps';
import useSlotProps from '@mui/utils/useSlotProps';
import * as React from 'react';

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
import { jsx as _jsx } from "react/jsx-runtime";
export const consumeSlots = (name, slotPropName, options, InComponent) => {
  function ConsumeSlotsInternal(props, ref) {
    const themedProps = useThemeProps({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name
    });
    const defaultProps = typeof options.defaultProps === 'function' ? options.defaultProps(themedProps) : options.defaultProps ?? {};
    const defaultizedProps = resolveProps(defaultProps, themedProps);
    const _ref = defaultizedProps,
      {
        slots,
        slotProps
      } = _ref,
      other = _objectWithoutPropertiesLoose(_ref, _excluded);
    const theme = useTheme();
    const classes = options.classesResolver?.(defaultizedProps, theme);

    // Can be a function component or a forward ref component.
    const Component = slots?.[slotPropName] ?? InComponent;
    const propagateSlots = options.propagateSlots && !slots?.[slotPropName];
    const _useSlotProps = useSlotProps({
        elementType: Component,
        externalSlotProps: slotProps?.[slotPropName],
        additionalProps: _extends({}, other, {
          classes
        }, propagateSlots && {
          slots,
          slotProps
        }),
        ownerState: {}
      }),
      originalOutProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded2);
    const outProps = _extends({}, originalOutProps);
    for (const prop of options.omitProps ?? []) {
      delete outProps[prop];
    }
    if (process.env.NODE_ENV !== 'production') {
      Component.displayName = `${name}.slots.${slotPropName}`;
    }
    return /*#__PURE__*/_jsx(Component, _extends({}, outProps, {
      ref: ref
    }));
  }
  return /*#__PURE__*/React.forwardRef(ConsumeSlotsInternal);
};
if (process.env.NODE_ENV !== "production") consumeSlots.displayName = "consumeSlots";