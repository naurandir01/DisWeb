"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultizeXAxis = defaultizeXAxis;
exports.defaultizeYAxis = defaultizeYAxis;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defaultizeZoom = require("./defaultizeZoom");
var _constants = require("../../../../constants");
function defaultizeXAxis(inAxes, dataset) {
  const offsets = {
    top: 0,
    bottom: 0,
    none: 0
  };
  const inputAxes = inAxes && inAxes.length > 0 ? inAxes : [{
    id: _constants.DEFAULT_X_AXIS_KEY,
    scaleType: 'linear'
  }];
  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;

    // The first x-axis is defaultized to the bottom
    const defaultPosition = index === 0 ? 'bottom' : 'none';
    const position = axisConfig.position ?? defaultPosition;
    const defaultHeight = _constants.DEFAULT_AXIS_SIZE_HEIGHT + (axisConfig.label ? _constants.AXIS_LABEL_DEFAULT_HEIGHT : 0);
    const id = axisConfig.id ?? `defaultized-x-axis-${index}`;
    const sharedConfig = (0, _extends2.default)({
      offset: offsets[position]
    }, axisConfig, {
      id,
      position,
      height: axisConfig.height ?? defaultHeight,
      zoom: (0, _defaultizeZoom.defaultizeZoom)(axisConfig.zoom, id, 'x')
    });

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.height;
      if (sharedConfig.zoom?.slider.enabled) {
        offsets[position] += sharedConfig.zoom.slider.size;
      }
    }

    // If `dataKey` is NOT provided
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return sharedConfig;
    }
    if (dataset === undefined) {
      throw new Error(`MUI X Charts: x-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return (0, _extends2.default)({}, sharedConfig, {
      data: dataset.map(d => d[dataKey])
    });
  });
  return parsedAxes;
}
function defaultizeYAxis(inAxes, dataset) {
  const offsets = {
    right: 0,
    left: 0,
    none: 0
  };
  const inputAxes = inAxes && inAxes.length > 0 ? inAxes : [{
    id: _constants.DEFAULT_Y_AXIS_KEY,
    scaleType: 'linear'
  }];
  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;

    // The first y-axis is defaultized to the left
    const defaultPosition = index === 0 ? 'left' : 'none';
    const position = axisConfig.position ?? defaultPosition;
    const defaultWidth = _constants.DEFAULT_AXIS_SIZE_WIDTH + (axisConfig.label ? _constants.AXIS_LABEL_DEFAULT_HEIGHT : 0);
    const id = axisConfig.id ?? `defaultized-y-axis-${index}`;
    const sharedConfig = (0, _extends2.default)({
      offset: offsets[position]
    }, axisConfig, {
      id,
      position,
      width: axisConfig.width ?? defaultWidth,
      zoom: (0, _defaultizeZoom.defaultizeZoom)(axisConfig.zoom, id, 'y')
    });

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.width;
      if (sharedConfig.zoom?.slider.enabled) {
        offsets[position] += sharedConfig.zoom.slider.size;
      }
    }

    // If `dataKey` is NOT provided
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return sharedConfig;
    }
    if (dataset === undefined) {
      throw new Error(`MUI X Charts: y-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return (0, _extends2.default)({}, sharedConfig, {
      data: dataset.map(d => d[dataKey])
    });
  });
  return parsedAxes;
}