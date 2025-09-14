import * as React from 'react';
import NextLink from 'next/link.js';
import { usePathname, useSearchParams, useRouter } from 'next/navigation.js';
import { AppProvider } from "../AppProvider/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
const Link = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    href,
    history,
    ...rest
  } = props;
  return /*#__PURE__*/_jsx(NextLink, {
    ref: ref,
    href: href,
    replace: history === 'replace',
    ...rest
  });
});
/**
 * @ignore - internal component.
 */
export function NextAppProviderApp(props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    push,
    replace
  } = useRouter();
  const navigate = React.useCallback((url, {
    history = 'auto'
  } = {}) => {
    if (history === 'auto' || history === 'push') {
      return push(String(url));
    }
    if (history === 'replace') {
      return replace(String(url));
    }
    throw new Error(`Invalid history option: ${history}`);
  }, [push, replace]);
  const routerImpl = React.useMemo(() => ({
    pathname,
    searchParams,
    navigate,
    Link
  }), [pathname, navigate, searchParams]);
  return /*#__PURE__*/_jsx(AppProvider, {
    router: routerImpl,
    ...props
  });
}