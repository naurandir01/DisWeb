import * as React from 'react';
import NextLink from 'next/link.js';
import { asArray } from '@toolpad/utils/collections';
import { useRouter } from 'next/router.js';
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
export function NextAppProviderPages(props) {
  const {
    push,
    replace,
    asPath,
    query
  } = useRouter();
  const search = React.useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      asArray(value ?? []).forEach(v => {
        params.append(key, v);
      });
    });
    return params.toString();
  }, [query]);

  // Stable search params object
  const searchParams = React.useMemo(() => new URLSearchParams(search), [search]);
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
    pathname: asPath.split('?')[0],
    searchParams,
    navigate,
    Link
  }), [asPath, navigate, searchParams]);
  return /*#__PURE__*/_jsx(AppProvider, {
    router: routerImpl,
    ...props
  });
}