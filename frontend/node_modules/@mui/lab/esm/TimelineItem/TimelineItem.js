'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isMuiElement } from '@mui/material/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { timelineContentClasses } from "../TimelineContent/index.js";
import { timelineOppositeContentClasses } from "../TimelineOppositeContent/index.js";
import TimelineContext from "../Timeline/TimelineContext.js";
import { getTimelineItemUtilityClass } from "./timelineItemClasses.js";
import convertTimelinePositionToClass from "../internal/convertTimelinePositionToClass.js";
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    position,
    classes,
    hasOppositeContent
  } = ownerState;
  const slots = {
    root: ['root', convertTimelinePositionToClass(position), !hasOppositeContent && 'missingOppositeContent']
  };
  return composeClasses(slots, getTimelineItemUtilityClass, classes);
};
const TimelineItemRoot = styled('li', {
  name: 'MuiTimelineItem',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[convertTimelinePositionToClass(ownerState.position)]];
  }
})(({
  ownerState
}) => ({
  listStyle: 'none',
  display: 'flex',
  position: 'relative',
  minHeight: 70,
  ...(ownerState.position === 'left' && {
    flexDirection: 'row-reverse'
  }),
  ...((ownerState.position === 'alternate' || ownerState.position === 'alternate-reverse') && {
    [`&:nth-of-type(${ownerState.position === 'alternate' ? 'even' : 'odd'})`]: {
      flexDirection: 'row-reverse',
      [`& .${timelineContentClasses.root}`]: {
        textAlign: 'right'
      },
      [`& .${timelineOppositeContentClasses.root}`]: {
        textAlign: 'left'
      }
    }
  }),
  ...(!ownerState.hasOppositeContent && {
    '&::before': {
      content: '""',
      flex: 1,
      padding: '6px 16px'
    }
  })
}));
const TimelineItem = /*#__PURE__*/React.forwardRef(function TimelineItem(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTimelineItem'
  });
  const {
    position: positionProp,
    className,
    ...other
  } = props;
  const {
    position: positionContext
  } = React.useContext(TimelineContext);
  let hasOppositeContent = false;
  React.Children.forEach(props.children, child => {
    if (isMuiElement(child, ['TimelineOppositeContent'])) {
      hasOppositeContent = true;
    }
  });
  const ownerState = {
    ...props,
    position: positionProp || positionContext || 'right',
    hasOppositeContent
  };
  const classes = useUtilityClasses(ownerState);
  const contextValue = React.useMemo(() => ({
    position: ownerState.position
  }), [ownerState.position]);
  return /*#__PURE__*/_jsx(TimelineContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(TimelineItemRoot, {
      className: clsx(classes.root, className),
      ownerState: ownerState,
      ref: ref,
      ...other
    })
  });
});
process.env.NODE_ENV !== "production" ? TimelineItem.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The position where the timeline's item should appear.
   */
  position: PropTypes.oneOf(['alternate-reverse', 'alternate', 'left', 'right']),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export default TimelineItem;