"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardLayout = DashboardLayout;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Drawer = _interopRequireDefault(require("@mui/material/Drawer"));
var _Toolbar2 = _interopRequireDefault(require("@mui/material/Toolbar"));
var _warnOnce = _interopRequireDefault(require("@toolpad/utils/warnOnce"));
var _context = require("../shared/context");
var _DashboardHeader = require("./DashboardHeader");
var _DashboardSidebarSubNavigation = require("./DashboardSidebarSubNavigation");
var _utils = require("./utils");
var _shared = require("./shared");
var _jsxRuntime = require("react/jsx-runtime");
var _Toolbar; // @TODO: Deprecate `appTitle` and `toolbarActions` slots so that they must be used in DashboardHeader component only. Update docs accordingly.
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 *
 * Demos:
 *
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 *
 * API:
 *
 * - [DashboardLayout API](https://mui.com/toolpad/core/api/dashboard-layout)
 */
function DashboardLayout(props) {
  const {
    children,
    branding,
    navigation: navigationProp,
    defaultSidebarCollapsed = false,
    disableCollapsibleSidebar = false,
    hideNavigation = false,
    sidebarExpandedWidth = 320,
    renderPageItem,
    slots,
    slotProps,
    sx
  } = props;
  if (navigationProp && process.env.NODE_ENV !== 'production') {
    (0, _warnOnce.default)('The navigation prop in the DashboardLayout component is deprecated and will eventually be removed. Set the navigation prop in the AppProvider instead (https://mui.com/toolpad/core/react-app-provider/#navigation).');
  }
  const theme = (0, _styles.useTheme)();
  const navigationContext = React.useContext(_context.NavigationContext);
  const appWindowContext = React.useContext(_context.WindowContext);
  const navigation = navigationProp ?? navigationContext;
  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] = React.useState(!defaultSidebarCollapsed);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] = React.useState(false);
  const isOverSmViewport = (0, _useMediaQuery.default)(theme.breakpoints.up('sm'), appWindowContext && {
    matchMedia: appWindowContext.matchMedia
  });
  const isOverMdViewport = (0, _useMediaQuery.default)(theme.breakpoints.up('md'), appWindowContext && {
    matchMedia: appWindowContext.matchMedia
  });
  const isNavigationExpanded = isOverMdViewport ? isDesktopNavigationExpanded : isMobileNavigationExpanded;
  const setIsNavigationExpanded = React.useCallback(newExpanded => {
    if (isOverMdViewport) {
      setIsDesktopNavigationExpanded(newExpanded);
    } else {
      setIsMobileNavigationExpanded(newExpanded);
    }
  }, [isOverMdViewport]);
  const [isNavigationFullyExpanded, setIsNavigationFullyExpanded] = React.useState(isNavigationExpanded);
  const [isNavigationFullyCollapsed, setIsNavigationFullyCollapsed] = React.useState(!isNavigationExpanded);
  React.useEffect(() => {
    if (isNavigationExpanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsNavigationFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);
      return () => clearTimeout(drawerWidthTransitionTimeout);
    }
    setIsNavigationFullyExpanded(false);
    return () => {};
  }, [isNavigationExpanded, theme]);
  React.useEffect(() => {
    if (!isNavigationExpanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsNavigationFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);
      return () => clearTimeout(drawerWidthTransitionTimeout);
    }
    setIsNavigationFullyCollapsed(false);
    return () => {};
  }, [isNavigationExpanded, theme]);
  const handleSetNavigationExpanded = React.useCallback(newExpanded => () => {
    setIsNavigationExpanded(newExpanded);
  }, [setIsNavigationExpanded]);
  const handleToggleHeaderMenu = React.useCallback(isExpanded => {
    setIsNavigationExpanded(isExpanded);
  }, [setIsNavigationExpanded]);
  const handleNavigationLinkClick = React.useCallback(() => {
    setIsMobileNavigationExpanded(false);
  }, [setIsMobileNavigationExpanded]);
  const isDesktopMini = !disableCollapsibleSidebar && !isDesktopNavigationExpanded;
  const isMobileMini = !disableCollapsibleSidebar && !isMobileNavigationExpanded;
  const hasDrawerTransitions = isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);
  const SidebarFooterSlot = slots?.sidebarFooter ?? null;
  const HeaderSlot = slots?.header ?? _DashboardHeader.DashboardHeader;
  const headerSlotProps = React.useMemo(() => ({
    branding,
    menuOpen: isNavigationExpanded,
    onToggleMenu: handleToggleHeaderMenu,
    hideMenuButton: hideNavigation || isOverMdViewport && disableCollapsibleSidebar,
    slots: {
      appTitle: slots?.appTitle,
      toolbarActions: slots?.toolbarActions,
      toolbarAccount: slots?.toolbarAccount
    },
    slotProps: {
      appTitle: slotProps?.appTitle,
      toolbarActions: slotProps?.toolbarActions,
      toolbarAccount: slotProps?.toolbarAccount
    },
    ...slotProps?.header
  }), [branding, isNavigationExpanded, handleToggleHeaderMenu, hideNavigation, isOverMdViewport, disableCollapsibleSidebar, slotProps, slots]);
  const getDrawerContent = React.useCallback((isMini, viewport) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [_Toolbar || (_Toolbar = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Toolbar2.default, {})), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
      component: "nav",
      "aria-label": `${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`,
      sx: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'auto',
        scrollbarGutter: isMini ? 'stable' : 'auto',
        overflowX: 'hidden',
        pt: navigation[0]?.kind === 'header' && !isMini ? 0 : 2,
        ...(hasDrawerTransitions ? (0, _utils.getDrawerSxTransitionMixin)(isNavigationFullyExpanded, 'padding') : {})
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_DashboardSidebarSubNavigation.DashboardSidebarSubNavigation, {
        subNavigation: navigation,
        onLinkClick: handleNavigationLinkClick,
        isMini: isMini,
        isFullyExpanded: isNavigationFullyExpanded,
        isFullyCollapsed: isNavigationFullyCollapsed,
        hasDrawerTransitions: hasDrawerTransitions,
        sidebarExpandedWidth: sidebarExpandedWidth,
        renderPageItem: renderPageItem
      }), SidebarFooterSlot ? /*#__PURE__*/(0, _jsxRuntime.jsx)(SidebarFooterSlot, {
        mini: isMini,
        ...slotProps?.sidebarFooter
      }) : null]
    })]
  }), [SidebarFooterSlot, handleNavigationLinkClick, hasDrawerTransitions, isNavigationFullyCollapsed, isNavigationFullyExpanded, navigation, sidebarExpandedWidth, renderPageItem, slotProps?.sidebarFooter]);
  const getDrawerSharedSx = React.useCallback((isMini, isTemporary) => {
    const drawerWidth = isMini ? _shared.MINI_DRAWER_WIDTH : sidebarExpandedWidth;
    return {
      displayPrint: 'none',
      width: drawerWidth,
      flexShrink: 0,
      ...(0, _utils.getDrawerWidthTransitionMixin)(isNavigationExpanded),
      ...(isTemporary ? {
        position: 'absolute'
      } : {}),
      [`& .MuiDrawer-paper`]: {
        position: 'absolute',
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundImage: 'none',
        ...(0, _utils.getDrawerWidthTransitionMixin)(isNavigationExpanded)
      }
    };
  }, [isNavigationExpanded, sidebarExpandedWidth]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
    sx: {
      position: 'relative',
      display: 'flex',
      overflow: 'hidden',
      height: '100vh',
      width: '100vw',
      ...sx
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(HeaderSlot, {
      ...headerSlotProps
    }), !hideNavigation ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Drawer.default, {
        container: appWindowContext?.document.body,
        variant: "temporary",
        open: isMobileNavigationExpanded,
        onClose: handleSetNavigationExpanded(false),
        ModalProps: {
          keepMounted: true // Better open performance on mobile.
        },
        sx: {
          display: {
            xs: 'block',
            sm: disableCollapsibleSidebar ? 'block' : 'none',
            md: 'none'
          },
          ...getDrawerSharedSx(false, true)
        },
        children: getDrawerContent(false, 'phone')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Drawer.default, {
        variant: "permanent",
        sx: {
          display: {
            xs: 'none',
            sm: disableCollapsibleSidebar ? 'none' : 'block',
            md: 'none'
          },
          ...getDrawerSharedSx(isMobileMini, false)
        },
        children: getDrawerContent(isMobileMini, 'tablet')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Drawer.default, {
        variant: "permanent",
        sx: {
          display: {
            xs: 'none',
            md: 'block'
          },
          ...getDrawerSharedSx(isDesktopMini, false)
        },
        children: getDrawerContent(isDesktopMini, 'desktop')
      })]
    }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
      sx: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Toolbar2.default, {
        sx: {
          displayPrint: 'none'
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        component: "main",
        sx: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'auto'
        },
        children: children
      })]
    })]
  });
}
process.env.NODE_ENV !== "production" ? DashboardLayout.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Branding options for the dashboard.
   * @default null
   */
  branding: _propTypes.default.shape({
    homeUrl: _propTypes.default.string,
    logo: _propTypes.default.node,
    title: _propTypes.default.string
  }),
  /**
   * The content of the dashboard.
   */
  children: _propTypes.default.node,
  /**
   * Whether the sidebar should start collapsed in desktop size screens.
   * @default false
   */
  defaultSidebarCollapsed: _propTypes.default.bool,
  /**
   * Whether the sidebar should not be collapsible to a mini variant in desktop and tablet viewports.
   * @default false
   */
  disableCollapsibleSidebar: _propTypes.default.bool,
  /**
   * Whether the navigation bar and menu icon should be hidden.
   * @default false
   */
  hideNavigation: _propTypes.default.bool,
  /**
   * Navigation definition for the dashboard. [Find out more](https://mui.com/toolpad/core/react-dashboard-layout/#navigation).
   * @default []
   * @deprecated Set the navigation in the [AppProvider](https://mui.com/toolpad/core/react-app-provider/#navigation) instead.
   */
  navigation: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({
    action: _propTypes.default.node,
    children: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.shape({
      kind: _propTypes.default.oneOf(['header']).isRequired,
      title: _propTypes.default.string.isRequired
    }), _propTypes.default.shape({
      kind: _propTypes.default.oneOf(['divider']).isRequired
    })]).isRequired),
    icon: _propTypes.default.node,
    kind: _propTypes.default.oneOf(['page']),
    pattern: _propTypes.default.string,
    segment: _propTypes.default.string,
    title: _propTypes.default.string
  }), _propTypes.default.shape({
    kind: _propTypes.default.oneOf(['header']).isRequired,
    title: _propTypes.default.string.isRequired
  }), _propTypes.default.shape({
    kind: _propTypes.default.oneOf(['divider']).isRequired
  })]).isRequired),
  /**
   * Render each page item.
   *
   * @param {NavigationPageItem} item
   * @param {{ mini: boolean }} params
   * @returns {ReactNode}
   */
  renderPageItem: _propTypes.default.func,
  /**
   * Width of the sidebar when expanded.
   * @default 320
   */
  sidebarExpandedWidth: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: _propTypes.default.shape({
    appTitle: _propTypes.default.shape({
      branding: _propTypes.default.shape({
        homeUrl: _propTypes.default.string,
        logo: _propTypes.default.node,
        title: _propTypes.default.string
      })
    }),
    header: _propTypes.default.shape({
      branding: _propTypes.default.shape({
        homeUrl: _propTypes.default.string,
        logo: _propTypes.default.node,
        title: _propTypes.default.string
      }),
      hideMenuButton: _propTypes.default.bool,
      menuOpen: _propTypes.default.bool.isRequired,
      onToggleMenu: _propTypes.default.func.isRequired,
      slotProps: _propTypes.default.shape({
        appTitle: _propTypes.default.object,
        toolbarAccount: _propTypes.default.object,
        toolbarActions: _propTypes.default.object
      }),
      slots: _propTypes.default.shape({
        appTitle: _propTypes.default.elementType,
        toolbarAccount: _propTypes.default.elementType,
        toolbarActions: _propTypes.default.elementType
      })
    }),
    sidebarFooter: _propTypes.default.shape({
      mini: _propTypes.default.bool.isRequired
    }),
    toolbarAccount: _propTypes.default.shape({
      localeText: _propTypes.default.object,
      slotProps: _propTypes.default.shape({
        popover: _propTypes.default.object,
        popoverContent: _propTypes.default.object,
        preview: _propTypes.default.object,
        signInButton: _propTypes.default.object,
        signOutButton: _propTypes.default.object
      }),
      slots: _propTypes.default.shape({
        popover: _propTypes.default.elementType,
        popoverContent: _propTypes.default.elementType,
        preview: _propTypes.default.elementType,
        signInButton: _propTypes.default.elementType,
        signOutButton: _propTypes.default.elementType
      })
    }),
    toolbarActions: _propTypes.default.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: _propTypes.default.shape({
    appTitle: _propTypes.default.elementType,
    header: _propTypes.default.elementType,
    sidebarFooter: _propTypes.default.elementType,
    toolbarAccount: _propTypes.default.elementType,
    toolbarActions: _propTypes.default.elementType
  }),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;