"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardSidebarSubNavigation = DashboardSidebarSubNavigation;
var React = _interopRequireWildcard(require("react"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _List = _interopRequireDefault(require("@mui/material/List"));
var _ListSubheader = _interopRequireDefault(require("@mui/material/ListSubheader"));
var _navigation = require("../shared/navigation");
var _context = require("../shared/context");
var _utils = require("./utils");
var _useActivePage = require("../useActivePage");
var _DashboardSidebarPageItem = require("./DashboardSidebarPageItem");
var _shared = require("./shared");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @ignore - internal component.
 */
function DashboardSidebarSubNavigationPageItem({
  id,
  item,
  isExpanded,
  onClick,
  depth,
  onLinkClick,
  isMini,
  isFullyExpanded,
  isFullyCollapsed,
  sidebarExpandedWidth,
  renderPageItem
}) {
  const navigationContext = React.useContext(_context.NavigationContext);
  const activePage = (0, _useActivePage.useActivePage)();
  const isActive = !!activePage && activePage.path === (0, _navigation.getItemPath)(navigationContext, item);

  // Show as selected in mini sidebar if any of the children matches path, otherwise show as selected if item matches path
  const isSelected = activePage && item.children && isMini ? (0, _navigation.hasSelectedNavigationChildren)(navigationContext, item, activePage.path) : isActive && !item.children;
  const pageItemContextProps = React.useMemo(() => ({
    expanded: isExpanded,
    selected: isSelected,
    id,
    onClick,
    isMini,
    isSidebarFullyExpanded: isFullyExpanded,
    isSidebarFullyCollapsed: isFullyCollapsed,
    renderNestedNavigation: () => /*#__PURE__*/(0, _jsxRuntime.jsx)(DashboardSidebarSubNavigation, {
      subNavigation: item.children ?? [],
      depth: depth + 1,
      onLinkClick: onLinkClick,
      isPopover: isMini,
      sidebarExpandedWidth: sidebarExpandedWidth
    })
  }), [depth, id, isExpanded, isFullyCollapsed, isFullyExpanded, isMini, isSelected, item.children, onClick, onLinkClick, sidebarExpandedWidth]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.DashboardSidebarPageItemContext.Provider, {
    value: pageItemContextProps,
    children: renderPageItem ? renderPageItem(item, {
      mini: isMini
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_DashboardSidebarPageItem.DashboardSidebarPageItem, {
      item: item
    })
  });
}
/**
 * @ignore - internal component.
 */
function DashboardSidebarSubNavigation({
  subNavigation,
  depth = 0,
  onLinkClick,
  isMini = false,
  isPopover = false,
  isFullyExpanded = true,
  isFullyCollapsed = false,
  hasDrawerTransitions = false,
  sidebarExpandedWidth,
  renderPageItem
}) {
  const navigationContext = React.useContext(_context.NavigationContext);
  const activePage = (0, _useActivePage.useActivePage)();
  const initialExpandedItemIds = React.useMemo(() => subNavigation.map((navigationItem, navigationItemIndex) => ({
    navigationItem,
    originalIndex: navigationItemIndex
  })).filter(({
    navigationItem
  }) => (0, _navigation.isPageItem)(navigationItem) && !!activePage && (0, _navigation.hasSelectedNavigationChildren)(navigationContext, navigationItem, activePage.path)).map(({
    originalIndex
  }) => `page-${depth}-${originalIndex}`), [activePage, depth, navigationContext, subNavigation]);
  const [expandedItemIds, setExpandedItemIds] = React.useState(initialExpandedItemIds);
  const handlePageItemClick = React.useCallback((itemId, item) => {
    if (item.children && !isMini) {
      setExpandedItemIds(previousValue => previousValue.includes(itemId) ? previousValue.filter(previousValueItemId => previousValueItemId !== itemId) : [...previousValue, itemId]);
    } else if (!item.children) {
      onLinkClick();
    }
  }, [isMini, onLinkClick]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_List.default, {
    sx: {
      padding: 0,
      mt: isPopover && depth === 1 ? 0.5 : 0,
      mb: depth === 0 && !isPopover ? 4 : 0.5,
      pl: (isPopover ? 1 : 2) * (isPopover ? depth - 1 : depth),
      minWidth: isPopover && depth === 1 ? 240 : 'auto',
      width: isMini ? _shared.MINI_DRAWER_WIDTH : 'auto'
    },
    children: subNavigation.map((navigationItem, navigationItemIndex) => {
      if (navigationItem.kind === 'header') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListSubheader.default, {
          sx: {
            fontSize: 12,
            fontWeight: '700',
            height: isMini ? 0 : 40,
            ...(hasDrawerTransitions ? (0, _utils.getDrawerSxTransitionMixin)(isFullyExpanded, 'height') : {}),
            px: 2,
            minWidth: sidebarExpandedWidth,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            zIndex: 2
          },
          children: (0, _navigation.getItemTitle)(navigationItem)
        }, `subheader-${depth}-${navigationItemIndex}`);
      }
      if (navigationItem.kind === 'divider') {
        const nextItem = subNavigation[navigationItemIndex + 1];
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
            sx: {
              borderBottomWidth: 2,
              mx: 1,
              mt: 1,
              mb: nextItem?.kind === 'header' && !isMini ? 0 : 1,
              ...(hasDrawerTransitions ? (0, _utils.getDrawerSxTransitionMixin)(isFullyExpanded, 'margin') : {})
            }
          })
        }, `divider-${depth}-${navigationItemIndex}`);
      }
      const pageItemId = `page-${depth}-${navigationItemIndex}`;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(DashboardSidebarSubNavigationPageItem, {
        id: pageItemId,
        item: navigationItem,
        isExpanded: expandedItemIds.includes(pageItemId),
        onClick: handlePageItemClick,
        depth: depth,
        onLinkClick: onLinkClick,
        isMini: isMini,
        isFullyExpanded: isFullyExpanded,
        isFullyCollapsed: isFullyCollapsed,
        sidebarExpandedWidth: sidebarExpandedWidth,
        renderPageItem: renderPageItem
      }, pageItemId);
    })
  });
}