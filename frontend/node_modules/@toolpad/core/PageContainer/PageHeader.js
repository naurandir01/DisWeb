"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageHeader = PageHeader;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Breadcrumbs = _interopRequireDefault(require("@mui/material/Breadcrumbs"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _material = require("@mui/material");
var _Link2 = require("../shared/Link");
var _navigation = require("../shared/navigation");
var _useActivePage = require("../useActivePage");
var _PageHeaderToolbar = require("./PageHeaderToolbar");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const PageContentHeader = (0, _material.styled)('div')(({
  theme
}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(2)
}));
/**
 * A header component to provide a title and breadcrumbs for your pages.
 *
 * Demos:
 *
 * - [Page Container](https://mui.com/toolpad/core/react-page-container/)
 *
 * API:
 *
 * - [PageHeader API](https://mui.com/toolpad/core/api/page-header)
 */
function PageHeader(props) {
  const {
    breadcrumbs,
    title
  } = props;
  const activePage = (0, _useActivePage.useActivePage)();
  const resolvedBreadcrumbs = breadcrumbs ?? activePage?.breadcrumbs ?? [];
  const resolvedTitle = title ?? activePage?.title ?? '';
  const ToolbarComponent = props?.slots?.toolbar ?? _PageHeaderToolbar.PageHeaderToolbar;
  const toolbarSlotProps = (0, _useSlotProps.default)({
    elementType: ToolbarComponent,
    ownerState: props,
    externalSlotProps: props?.slotProps?.toolbar,
    additionalProps: {}
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Breadcrumbs.default, {
      "aria-label": "breadcrumb",
      children: resolvedBreadcrumbs ? resolvedBreadcrumbs.map((item, index) => {
        return item.path ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
          component: _Link2.Link,
          underline: "hover",
          color: "inherit",
          href: item.path,
          children: (0, _navigation.getItemTitle)(item)
        }, index) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          color: "text.primary",
          children: (0, _navigation.getItemTitle)(item)
        }, index);
      }) : null
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(PageContentHeader, {
      children: [resolvedTitle ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "h4",
        children: resolvedTitle
      }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(ToolbarComponent, {
        ...toolbarSlotProps
      })]
    })]
  });
}
process.env.NODE_ENV !== "production" ? PageHeader.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The breadcrumbs of the page. Leave blank to use the active page breadcrumbs.
   */
  breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
    path: _propTypes.default.string,
    title: _propTypes.default.string.isRequired
  })),
  /**
   * The props used for each slot inside.
   */
  slotProps: _propTypes.default.shape({
    toolbar: _propTypes.default.shape({
      children: _propTypes.default.node
    }).isRequired
  }),
  /**
   * The components used for each slot inside.
   */
  slots: _propTypes.default.shape({
    toolbar: _propTypes.default.elementType
  }),
  /**
   * The title of the page. Leave blank to use the active page title.
   */
  title: _propTypes.default.string
} : void 0;