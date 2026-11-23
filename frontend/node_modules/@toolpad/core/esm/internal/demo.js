'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import warnOnce from '@toolpad/utils/warnOnce';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Internal utility for demos
 * @ignore - internal component.
 */

function useExternalProductionWarning({
  featureName
}) {
  const isExternalProduction = typeof window !== 'undefined' && window.location.hostname !== 'mui.com' && process.env.NODE_ENV === 'production';
  if (isExternalProduction) {
    warnOnce(`${featureName} is an internal feature of Toolpad Core. This feature is not meant for general usage in production.`);
  }
}
// Wrapper for demo applications in the documentation
export function DemoProvider({
  window,
  children
}) {
  useExternalProductionWarning({
    featureName: 'DemoProvider'
  });
  const demoEmotionCache = React.useMemo(() => createCache({
    key: 'toolpad-demo-app',
    container: window?.document.head
  }), [window?.document.head]);
  return /*#__PURE__*/_jsx(CacheProvider, {
    value: demoEmotionCache,
    children: children
  });
}
const DUMMY_BASE = 'https://example.com';

/**
 * Hook to create a router for demos.
 * @returns An in-memory router To be used in demos demos.
 */
export function useDemoRouter(initialUrl = '/') {
  useExternalProductionWarning({
    featureName: 'useDemoRouter'
  });
  const [url, setUrl] = React.useState(() => new URL(initialUrl, DUMMY_BASE));
  const router = React.useMemo(() => {
    return {
      pathname: url.pathname,
      searchParams: url.searchParams,
      navigate: newUrl => {
        const nextUrl = new URL(newUrl, DUMMY_BASE);
        if (nextUrl.pathname !== url.pathname || nextUrl.search !== url.search) {
          setUrl(nextUrl);
        }
      }
    };
  }, [url.pathname, url.search, url.searchParams]);
  return router;
}