"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPluginParamsFromProps = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
const _excluded = ["apiRef"];
const extractPluginParamsFromProps = _ref => {
  let {
      plugins
    } = _ref,
    props = (0, _objectWithoutPropertiesLoose2.default)(_ref.props, _excluded);
  const paramsLookup = {};
  plugins.forEach(plugin => {
    Object.assign(paramsLookup, plugin.params);
  });
  const pluginParams = {};
  Object.keys(props).forEach(propName => {
    const prop = props[propName];
    if (paramsLookup[propName]) {
      pluginParams[propName] = prop;
    }
  });
  const defaultizedPluginParams = plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams({
        params: acc
      });
    }
    return acc;
  }, pluginParams);
  return defaultizedPluginParams;
};
exports.extractPluginParamsFromProps = extractPluginParamsFromProps;