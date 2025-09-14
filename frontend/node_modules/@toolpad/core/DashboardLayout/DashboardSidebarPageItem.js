"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardSidebarPageItem = DashboardSidebarPageItem;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _Avatar = _interopRequireDefault(require("@mui/material/Avatar"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Collapse = _interopRequireDefault(require("@mui/material/Collapse"));
var _Grow = _interopRequireDefault(require("@mui/material/Grow"));
var _ListItem = _interopRequireDefault(require("@mui/material/ListItem"));
var _ListItemButton = _interopRequireDefault(require("@mui/material/ListItemButton"));
var _ListItemIcon = _interopRequireDefault(require("@mui/material/ListItemIcon"));
var _ListItemText = _interopRequireDefault(require("@mui/material/ListItemText"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _invariant = _interopRequireDefault(require("invariant"));
var _Link = require("../shared/Link");
var _context = require("../shared/context");
var _navigation = require("../shared/navigation");
var _shared = require("./shared");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const NavigationListItemButton = (0, _material.styled)(_ListItemButton.default)(({
  theme
}) => ({
  borderRadius: 8,
  '&.Mui-selected': {
    '& .MuiListItemIcon-root': {
      color: (theme.vars ?? theme).palette.primary.dark
    },
    '& .MuiTypography-root': {
      color: (theme.vars ?? theme).palette.primary.dark
    },
    '& .MuiSvgIcon-root': {
      color: (theme.vars ?? theme).palette.primary.dark
    },
    '& .MuiAvatar-root': {
      backgroundColor: (theme.vars ?? theme).palette.primary.dark
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: (theme.vars ?? theme).palette.primary.dark
    }
  },
  '& .MuiSvgIcon-root': {
    color: (theme.vars ?? theme).palette.action.active
  },
  '& .MuiAvatar-root': {
    backgroundColor: (theme.vars ?? theme).palette.action.active
  }
}));
const LIST_ITEM_ICON_SIZE = 34;
/**
 *
 * Demos:
 *
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 *
 * API:
 *
 * - [DashboardSidebarPageItem API](https://mui.com/toolpad/core/api/dashboard-sidebar-page-item)
 */
function DashboardSidebarPageItem(props) {
  const navigationContext = React.useContext(_context.NavigationContext);
  const pageItemContextProps = React.useContext(_context.DashboardSidebarPageItemContext);
  (0, _invariant.default)(pageItemContextProps, 'No navigation page item context provided.');
  const contextAwareProps = {
    ...pageItemContextProps,
    ...props
  };
  const {
    item,
    href = (0, _navigation.getItemPath)(navigationContext, item),
    LinkComponent: LinkComponentProp,
    expanded = false,
    selected = false,
    disabled = false,
    id,
    onClick,
    isMini = false,
    isSidebarFullyExpanded = true,
    isSidebarFullyCollapsed = false,
    renderNestedNavigation
  } = contextAwareProps;
  const [hoveredMiniSidebarItemId, setHoveredMiniSidebarItemId] = React.useState(null);
  const handleClick = React.useCallback(() => {
    onClick(id, item);
  }, [id, item, onClick]);
  let nestedNavigationCollapseSx = {
    display: 'none'
  };
  if (isMini && isSidebarFullyCollapsed) {
    nestedNavigationCollapseSx = {
      fontSize: 18,
      position: 'absolute',
      top: '41.5%',
      right: '2px',
      transform: 'translateY(-50%) rotate(-90deg)'
    };
  } else if (!isMini && isSidebarFullyExpanded) {
    nestedNavigationCollapseSx = {
      ml: 0.5,
      transform: `rotate(${expanded ? 0 : -90}deg)`,
      transition: theme => theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: 100
      })
    };
  }
  const hasExternalHref = href.startsWith('http://') || href.startsWith('https://');
  const LinkComponent = LinkComponentProp ?? (hasExternalHref ? 'a' : _Link.Link);
  const title = (0, _navigation.getItemTitle)(item);
  const listItem = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ListItem.default, {
    ...(item.children && isMini ? {
      onMouseEnter: () => {
        setHoveredMiniSidebarItemId(id);
      },
      onMouseLeave: () => {
        setHoveredMiniSidebarItemId(null);
      }
    } : {}),
    sx: {
      py: 0,
      px: 1,
      overflowX: 'hidden'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(NavigationListItemButton, {
      selected: selected,
      disabled: disabled,
      sx: {
        px: 1.4,
        height: isMini ? 60 : 48
      },
      ...(item.children && !isMini ? {
        onClick: handleClick
      } : {}),
      ...(!item.children ? {
        LinkComponent,
        ...(hasExternalHref ? {
          target: '_blank',
          rel: 'noopener noreferrer'
        } : {}),
        href,
        onClick: handleClick
      } : {}),
      children: [item.icon || isMini ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
        sx: isMini ? {
          position: 'absolute',
          left: '50%',
          top: 'calc(50% - 6px)',
          transform: 'translate(-50%, -50%)'
        } : {},
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_ListItemIcon.default, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: LIST_ITEM_ICON_SIZE
          },
          children: [item.icon ?? null, !item.icon && isMini ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Avatar.default, {
            sx: {
              width: LIST_ITEM_ICON_SIZE - 7,
              height: LIST_ITEM_ICON_SIZE - 7,
              fontSize: 12
            },
            children: title.split(' ').slice(0, 2).map(titleWord => titleWord.charAt(0).toUpperCase())
          }) : null]
        }), isMini ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          sx: {
            position: 'absolute',
            bottom: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            fontWeight: 500,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: _shared.MINI_DRAWER_WIDTH - 28
          },
          children: title
        }) : null]
      }) : null, !isMini ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemText.default, {
        primary: title,
        sx: {
          ml: 1.2,
          whiteSpace: 'nowrap',
          zIndex: 1
        }
      }) : null, item.action && !isMini && isSidebarFullyExpanded ? item.action : null, item.children ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {
        sx: nestedNavigationCollapseSx
      }) : null]
    }), item.children && isMini ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grow.default, {
      in: id === hoveredMiniSidebarItemId,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        sx: {
          position: 'fixed',
          left: _shared.MINI_DRAWER_WIDTH - 2,
          pl: '6px'
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Paper.default, {
          sx: {
            pt: 0.5,
            pb: 0.5,
            transform: 'translateY(calc(50% - 30px))'
          },
          children: renderNestedNavigation(item.children)
        })
      })
    }) : null]
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [listItem, item.children && !isMini ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Collapse.default, {
      in: expanded,
      timeout: "auto",
      unmountOnExit: true,
      children: renderNestedNavigation(item.children)
    }) : null]
  }, id);
}
process.env.NODE_ENV !== "production" ? DashboardSidebarPageItem.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * If `true`, the item is disabled.
   * @default false
   */
  disabled: _propTypes.default.bool,
  /**
   * If `true`, expands any nested navigation in the item, otherwise collapse it.
   * @default false
   */
  expanded: _propTypes.default.bool,
  /**
   * Link `href` for when the item is rendered as a link.
   * @default getItemPath(navigationContext, item)
   */
  href: _propTypes.default.string,
  /**
   * Navigation page item definition.
   */
  item: _propTypes.default.shape({
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
  }).isRequired,
  /**
   * The component used to render the item as a link.
   * @default Link
   */
  LinkComponent: _propTypes.default.elementType,
  /**
   * Use to apply selected styling.
   * @default false
   */
  selected: _propTypes.default.bool
} : void 0;