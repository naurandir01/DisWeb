import * as React from 'react';
import { RouterContext } from "./context.js";

/**
 * @ignore - internal component.
 */
import { jsx as _jsx } from "react/jsx-runtime";
export const DefaultLink = /*#__PURE__*/React.forwardRef(function Link(props, ref) {
  const {
    children,
    href,
    onClick,
    history,
    ...rest
  } = props;
  const routerContext = React.useContext(RouterContext);
  const handleLinkClick = React.useMemo(() => {
    if (!routerContext) {
      return onClick;
    }
    return event => {
      event.preventDefault();
      const url = new URL(event.currentTarget.href);
      routerContext.navigate(url.pathname, {
        history
      });
      onClick?.(event);
    };
  }, [routerContext, onClick, history]);
  return /*#__PURE__*/_jsx("a", {
    ref: ref,
    href: href,
    ...rest,
    onClick: handleLinkClick,
    children: children
  });
});
export const Link = /*#__PURE__*/React.forwardRef(function Link(props, ref) {
  const routerContext = React.useContext(RouterContext);
  const LinkComponent = routerContext?.Link ?? DefaultLink;
  return /*#__PURE__*/_jsx(LinkComponent, {
    ref: ref,
    ...props,
    children: props.children
  });
});