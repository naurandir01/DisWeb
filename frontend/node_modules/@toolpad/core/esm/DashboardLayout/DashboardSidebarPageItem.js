'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grow from '@mui/material/Grow';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import invariant from 'invariant';
import { Link } from "../shared/Link.js";
import { DashboardSidebarPageItemContext, NavigationContext } from "../shared/context.js";
import { getItemPath, getItemTitle } from "../shared/navigation.js";
import { MINI_DRAWER_WIDTH } from "./shared.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const NavigationListItemButton = styled(ListItemButton)(({
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
  const navigationContext = React.useContext(NavigationContext);
  const pageItemContextProps = React.useContext(DashboardSidebarPageItemContext);
  invariant(pageItemContextProps, 'No navigation page item context provided.');
  const contextAwareProps = {
    ...pageItemContextProps,
    ...props
  };
  const {
    item,
    href = getItemPath(navigationContext, item),
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
  const LinkComponent = LinkComponentProp ?? (hasExternalHref ? 'a' : Link);
  const title = getItemTitle(item);
  const listItem = /*#__PURE__*/_jsxs(ListItem, {
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
    children: [/*#__PURE__*/_jsxs(NavigationListItemButton, {
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
      children: [item.icon || isMini ? /*#__PURE__*/_jsxs(Box, {
        sx: isMini ? {
          position: 'absolute',
          left: '50%',
          top: 'calc(50% - 6px)',
          transform: 'translate(-50%, -50%)'
        } : {},
        children: [/*#__PURE__*/_jsxs(ListItemIcon, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: LIST_ITEM_ICON_SIZE
          },
          children: [item.icon ?? null, !item.icon && isMini ? /*#__PURE__*/_jsx(Avatar, {
            sx: {
              width: LIST_ITEM_ICON_SIZE - 7,
              height: LIST_ITEM_ICON_SIZE - 7,
              fontSize: 12
            },
            children: title.split(' ').slice(0, 2).map(titleWord => titleWord.charAt(0).toUpperCase())
          }) : null]
        }), isMini ? /*#__PURE__*/_jsx(Typography, {
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
            maxWidth: MINI_DRAWER_WIDTH - 28
          },
          children: title
        }) : null]
      }) : null, !isMini ? /*#__PURE__*/_jsx(ListItemText, {
        primary: title,
        sx: {
          ml: 1.2,
          whiteSpace: 'nowrap',
          zIndex: 1
        }
      }) : null, item.action && !isMini && isSidebarFullyExpanded ? item.action : null, item.children ? /*#__PURE__*/_jsx(ExpandMoreIcon, {
        sx: nestedNavigationCollapseSx
      }) : null]
    }), item.children && isMini ? /*#__PURE__*/_jsx(Grow, {
      in: id === hoveredMiniSidebarItemId,
      children: /*#__PURE__*/_jsx(Box, {
        sx: {
          position: 'fixed',
          left: MINI_DRAWER_WIDTH - 2,
          pl: '6px'
        },
        children: /*#__PURE__*/_jsx(Paper, {
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
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [listItem, item.children && !isMini ? /*#__PURE__*/_jsx(Collapse, {
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
  disabled: PropTypes.bool,
  /**
   * If `true`, expands any nested navigation in the item, otherwise collapse it.
   * @default false
   */
  expanded: PropTypes.bool,
  /**
   * Link `href` for when the item is rendered as a link.
   * @default getItemPath(navigationContext, item)
   */
  href: PropTypes.string,
  /**
   * Navigation page item definition.
   */
  item: PropTypes.shape({
    action: PropTypes.node,
    children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.shape({
      kind: PropTypes.oneOf(['header']).isRequired,
      title: PropTypes.string.isRequired
    }), PropTypes.shape({
      kind: PropTypes.oneOf(['divider']).isRequired
    })]).isRequired),
    icon: PropTypes.node,
    kind: PropTypes.oneOf(['page']),
    pattern: PropTypes.string,
    segment: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  /**
   * The component used to render the item as a link.
   * @default Link
   */
  LinkComponent: PropTypes.elementType,
  /**
   * Use to apply selected styling.
   * @default false
   */
  selected: PropTypes.bool
} : void 0;
export { DashboardSidebarPageItem };