import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["seriesId", "isFaded", "isHighlighted", "x", "y", "color", "size", "dataIndex"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { jsx as _jsx } from "react/jsx-runtime";
function ScatterMarker(props) {
  const {
      isFaded,
      isHighlighted,
      x,
      y,
      color,
      size
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsx("circle", _extends({
    cx: 0,
    cy: 0,
    r: (isHighlighted ? 1.2 : 1) * size,
    transform: `translate(${x}, ${y})`,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
    cursor: other.onClick ? 'pointer' : 'unset'
  }, other));
}
process.env.NODE_ENV !== "production" ? ScatterMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The fill color of the marker.
   */
  color: PropTypes.string.isRequired,
  /**
   * The index of the data point.
   */
  dataIndex: PropTypes.number.isRequired,
  /**
   * If `true`, the marker is faded.
   */
  isFaded: PropTypes.bool.isRequired,
  /**
   * If `true`, the marker is highlighted.
   */
  isHighlighted: PropTypes.bool.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick: PropTypes.func,
  /**
   * The series ID.
   */
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The size of the marker.
   */
  size: PropTypes.number.isRequired,
  /**
   * The x coordinate of the data point.
   */
  x: PropTypes.number.isRequired,
  /**
   * The y coordinate of the data point.
   */
  y: PropTypes.number.isRequired
} : void 0;
export { ScatterMarker };