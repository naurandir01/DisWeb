"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsHydrated = useIsHydrated;
var React = _interopRequireWildcard(require("react"));
/** Returns true after hydration is done on the client.
 *
 * Basically a implementation of Option 2 of this gist: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect. */
function useIsHydrated() {
  const [isHydrated, setIsHydrated] = React.useState(typeof window !== 'undefined' || process.env.NODE_ENV === 'test');
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
}