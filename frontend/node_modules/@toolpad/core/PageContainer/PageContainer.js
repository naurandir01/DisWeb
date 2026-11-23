"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageContainer = PageContainer;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Container = _interopRequireDefault(require("@mui/material/Container"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _PageHeader = require("./PageHeader");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * A container component to provide a title and breadcrumbs for your pages.
 *
 * Demos:
 *
 * - [Page Container](https://mui.com/toolpad/core/react-page-container/)
 *
 * API:
 *
 * - [PageContainer API](https://mui.com/toolpad/core/api/page-container)
 */
function PageContainer(props) {
  const {
    children,
    breadcrumbs,
    slots,
    slotProps,
    title,
    ...rest
  } = props;
  const PageHeaderSlot = slots?.header ?? _PageHeader.PageHeader;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Container.default, {
    ...rest,
    sx: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      ...rest.sx
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
      sx: {
        flex: 1,
        my: 2
      },
      spacing: 2,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(PageHeaderSlot, {
        title: title,
        breadcrumbs: breadcrumbs,
        ...slotProps?.header
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        sx: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        },
        children: children
      })]
    })
  });
}
process.env.NODE_ENV !== "production" ? PageContainer.propTypes /* remove-proptypes */ = {
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
   * @ignore
   */
  children: _propTypes.default.node,
  /**
   * The props used for each slot inside.
   */
  slotProps: _propTypes.default.shape({
    header: _propTypes.default.shape({
      breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
        path: _propTypes.default.string,
        title: _propTypes.default.string.isRequired
      })),
      slotProps: _propTypes.default.shape({
        toolbar: _propTypes.default.object.isRequired
      }),
      slots: _propTypes.default.shape({
        toolbar: _propTypes.default.elementType
      }),
      title: _propTypes.default.string
    }).isRequired
  }),
  /**
   * The components used for each slot inside.
   */
  slots: _propTypes.default.shape({
    header: _propTypes.default.elementType
  }),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  /**
   * The title of the page. Leave blank to use the active page title.
   */
  title: _propTypes.default.string
} : void 0;