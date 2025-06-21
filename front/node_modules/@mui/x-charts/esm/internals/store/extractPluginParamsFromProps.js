import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["apiRef"];
export const extractPluginParamsFromProps = _ref => {
  let {
      plugins
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref.props, _excluded);
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