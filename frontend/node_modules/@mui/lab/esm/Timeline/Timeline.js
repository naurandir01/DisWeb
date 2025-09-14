'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled, useThemeProps } from '@mui/material/styles';
import TimelineContext from "./TimelineContext.js";
import { getTimelineUtilityClass } from "./timelineClasses.js";
import convertTimelinePositionToClass from "../internal/convertTimelinePositionToClass.js";
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    position,
    classes
  } = ownerState;
  const slots = {
    root: ['root', position && convertTimelinePositionToClass(position)]
  };
  return composeClasses(slots, getTimelineUtilityClass, classes);
};
const TimelineRoot = styled('ul', {
  name: 'MuiTimeline',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.position && styles[convertTimelinePositionToClass(ownerState.position)]];
  }
})({
  display: 'flex',
  flexDirection: 'column',
  padding: '6px 16px',
  flexGrow: 1
});

/**
 *
 * Demos:
 *
 * - [Timeline](https://mui.com/material-ui/react-timeline/)
 *
 * API:
 *
 * - [Timeline API](https://mui.com/material-ui/api/timeline/)
 */
const Timeline = /*#__PURE__*/React.forwardRef(function Timeline(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTimeline'
  });
  const {
    position = 'right',
    className,
    ...other
  } = props;
  const ownerState = {
    ...props,
    position
  };
  const classes = useUtilityClasses(ownerState);
  const contextValue = React.useMemo(() => ({
    position
  }), [position]);
  return /*#__PURE__*/_jsx(TimelineContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(TimelineRoot, {
      className: clsx(classes.root, className),
      ownerState: ownerState,
      ref: ref,
      ...other
    })
  });
});
process.env.NODE_ENV !== "production" ? Timeline.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
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
   * className applied to the root element.
   */
  className: PropTypes.string,
  /**
   * The position where the TimelineContent should appear relative to the time axis.
   * @default 'right'
   */
  position: PropTypes.oneOf(['alternate-reverse', 'alternate', 'left', 'right']),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;

/**
 *
 * Demos:
 *
 * - [Timeline](https://mui.com/components/timeline/)
 *
 * API:
 *
 * - [Timeline API](https://mui.com/api/timeline/)
 */
export default Timeline;