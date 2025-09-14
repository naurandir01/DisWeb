'use client';

import * as React from 'react';
import { useRouter } from 'next/compat/router.js';
import { NextAppProviderApp } from "./NextAppProviderApp.js";
import { NextAppProviderPages } from "./NextAppProviderPages.js";
import { jsx as _jsx } from "react/jsx-runtime";
function NextAppProvider(props) {
  const router = useRouter();
  const AppProvider = router ? NextAppProviderPages : NextAppProviderApp;
  return /*#__PURE__*/_jsx(AppProvider, {
    ...props
  });
}
export { NextAppProvider };