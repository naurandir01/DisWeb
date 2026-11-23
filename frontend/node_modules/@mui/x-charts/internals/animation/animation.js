"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ANIMATION_TIMING_FUNCTION_JS = exports.ANIMATION_TIMING_FUNCTION = exports.ANIMATION_DURATION_MS = void 0;
var _bezierEasing = _interopRequireDefault(require("bezier-easing"));
const ANIMATION_DURATION_MS = exports.ANIMATION_DURATION_MS = 300;
const ANIMATION_TIMING_FUNCTION = exports.ANIMATION_TIMING_FUNCTION = 'cubic-bezier(0.66, 0, 0.34, 1)';
const ANIMATION_TIMING_FUNCTION_JS = exports.ANIMATION_TIMING_FUNCTION_JS = (0, _bezierEasing.default)(0.66, 0, 0.34, 1);