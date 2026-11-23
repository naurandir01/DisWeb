import _extends from "@babel/runtime/helpers/esm/extends";
import { useTheme, useThemeProps } from '@mui/material/styles';
import resolveProps from '@mui/utils/resolveProps';
import * as React from 'react';

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
import { jsx as _jsx } from "react/jsx-runtime";
export const consumeThemeProps = (name, options, InComponent) => /*#__PURE__*/React.forwardRef(function ConsumeThemeInternal(props, ref) {
  const themedProps = useThemeProps({
    props,
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    name
  });
  const defaultProps = typeof options.defaultProps === 'function' ? options.defaultProps(themedProps) : options.defaultProps ?? {};
  const outProps = resolveProps(defaultProps, themedProps);
  const theme = useTheme();
  const classes = options.classesResolver?.(outProps, theme);
  const OutComponent = /*#__PURE__*/React.forwardRef(InComponent);
  if (process.env.NODE_ENV !== "production") OutComponent.displayName = "OutComponent";
  if (process.env.NODE_ENV !== 'production') {
    OutComponent.displayName = `consumeThemeProps(${name})`;
  }
  return /*#__PURE__*/_jsx(OutComponent, _extends({}, outProps, {
    classes: classes,
    ref: ref
  }));
});
if (process.env.NODE_ENV !== "production") consumeThemeProps.displayName = "consumeThemeProps";