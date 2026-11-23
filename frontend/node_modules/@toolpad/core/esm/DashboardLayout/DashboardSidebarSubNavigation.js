'use client';

import * as React from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { getItemPath, getItemTitle, hasSelectedNavigationChildren, isPageItem } from "../shared/navigation.js";
import { DashboardSidebarPageItemContext, NavigationContext } from "../shared/context.js";
import { getDrawerSxTransitionMixin } from "./utils.js";
import { useActivePage } from "../useActivePage/index.js";
import { DashboardSidebarPageItem } from "./DashboardSidebarPageItem.js";
import { MINI_DRAWER_WIDTH } from "./shared.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
  const navigationContext = React.useContext(NavigationContext);
  const activePage = useActivePage();
  const isActive = !!activePage && activePage.path === getItemPath(navigationContext, item);

  // Show as selected in mini sidebar if any of the children matches path, otherwise show as selected if item matches path
  const isSelected = activePage && item.children && isMini ? hasSelectedNavigationChildren(navigationContext, item, activePage.path) : isActive && !item.children;
  const pageItemContextProps = React.useMemo(() => ({
    expanded: isExpanded,
    selected: isSelected,
    id,
    onClick,
    isMini,
    isSidebarFullyExpanded: isFullyExpanded,
    isSidebarFullyCollapsed: isFullyCollapsed,
    renderNestedNavigation: () => /*#__PURE__*/_jsx(DashboardSidebarSubNavigation, {
      subNavigation: item.children ?? [],
      depth: depth + 1,
      onLinkClick: onLinkClick,
      isPopover: isMini,
      sidebarExpandedWidth: sidebarExpandedWidth
    })
  }), [depth, id, isExpanded, isFullyCollapsed, isFullyExpanded, isMini, isSelected, item.children, onClick, onLinkClick, sidebarExpandedWidth]);
  return /*#__PURE__*/_jsx(DashboardSidebarPageItemContext.Provider, {
    value: pageItemContextProps,
    children: renderPageItem ? renderPageItem(item, {
      mini: isMini
    }) : /*#__PURE__*/_jsx(DashboardSidebarPageItem, {
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
  const navigationContext = React.useContext(NavigationContext);
  const activePage = useActivePage();
  const initialExpandedItemIds = React.useMemo(() => subNavigation.map((navigationItem, navigationItemIndex) => ({
    navigationItem,
    originalIndex: navigationItemIndex
  })).filter(({
    navigationItem
  }) => isPageItem(navigationItem) && !!activePage && hasSelectedNavigationChildren(navigationContext, navigationItem, activePage.path)).map(({
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
  return /*#__PURE__*/_jsx(List, {
    sx: {
      padding: 0,
      mt: isPopover && depth === 1 ? 0.5 : 0,
      mb: depth === 0 && !isPopover ? 4 : 0.5,
      pl: (isPopover ? 1 : 2) * (isPopover ? depth - 1 : depth),
      minWidth: isPopover && depth === 1 ? 240 : 'auto',
      width: isMini ? MINI_DRAWER_WIDTH : 'auto'
    },
    children: subNavigation.map((navigationItem, navigationItemIndex) => {
      if (navigationItem.kind === 'header') {
        return /*#__PURE__*/_jsx(ListSubheader, {
          sx: {
            fontSize: 12,
            fontWeight: '700',
            height: isMini ? 0 : 40,
            ...(hasDrawerTransitions ? getDrawerSxTransitionMixin(isFullyExpanded, 'height') : {}),
            px: 2,
            minWidth: sidebarExpandedWidth,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            zIndex: 2
          },
          children: getItemTitle(navigationItem)
        }, `subheader-${depth}-${navigationItemIndex}`);
      }
      if (navigationItem.kind === 'divider') {
        const nextItem = subNavigation[navigationItemIndex + 1];
        return /*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsx(Divider, {
            sx: {
              borderBottomWidth: 2,
              mx: 1,
              mt: 1,
              mb: nextItem?.kind === 'header' && !isMini ? 0 : 1,
              ...(hasDrawerTransitions ? getDrawerSxTransitionMixin(isFullyExpanded, 'margin') : {})
            }
          })
        }, `divider-${depth}-${navigationItemIndex}`);
      }
      const pageItemId = `page-${depth}-${navigationItemIndex}`;
      return /*#__PURE__*/_jsx(DashboardSidebarSubNavigationPageItem, {
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
export { DashboardSidebarSubNavigation };