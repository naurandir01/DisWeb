import * as React from 'react';
import useId from '@mui/utils/useId';
import { ChartStore } from "../plugins/utils/ChartStore.js";
import { CHART_CORE_PLUGINS } from "../plugins/corePlugins/index.js";
import { extractPluginParamsFromProps } from "./extractPluginParamsFromProps.js";
let globalId = 0;

/**
 * This is the main hook that setups the plugin system for the chart.
 *
 * It manages the data used to create the charts.
 *
 * @param inPlugins All the plugins that will be used in the chart.
 * @param props The props passed to the chart.
 * @param seriesConfig The set of helpers used for series-specific computation.
 */
export function useCharts(inPlugins, props, seriesConfig) {
  const chartId = useId();
  const plugins = React.useMemo(() => [...CHART_CORE_PLUGINS, ...inPlugins], [inPlugins]);
  const pluginParams = extractPluginParamsFromProps({
    plugins,
    props
  });
  pluginParams.id = pluginParams.id ?? chartId;
  const instanceRef = React.useRef({});
  const instance = instanceRef.current;
  const publicAPI = useChartApiInitialization(props.apiRef);
  const innerChartRootRef = React.useRef(null);
  const innerSvgRef = React.useRef(null);
  const storeRef = React.useRef(null);
  if (storeRef.current == null) {
    // eslint-disable-next-line react-compiler/react-compiler
    globalId += 1;
    const initialState = {
      cacheKey: {
        id: globalId
      }
    };
    plugins.forEach(plugin => {
      if (plugin.getInitialState) {
        Object.assign(initialState, plugin.getInitialState(pluginParams, initialState, seriesConfig));
      }
    });
    storeRef.current = new ChartStore(initialState);
  }
  const runPlugin = plugin => {
    const pluginResponse = plugin({
      instance,
      params: pluginParams,
      plugins: plugins,
      store: storeRef.current,
      svgRef: innerSvgRef,
      chartRootRef: innerChartRootRef,
      seriesConfig
    });
    if (pluginResponse.publicAPI) {
      Object.assign(publicAPI.current, pluginResponse.publicAPI);
    }
    if (pluginResponse.instance) {
      Object.assign(instance, pluginResponse.instance);
    }
  };
  plugins.forEach(runPlugin);
  const contextValue = React.useMemo(() => ({
    store: storeRef.current,
    publicAPI: publicAPI.current,
    instance,
    svgRef: innerSvgRef,
    chartRootRef: innerChartRootRef
  }), [instance, publicAPI]);
  return {
    contextValue
  };
}
function initializeInputApiRef(inputApiRef) {
  if (inputApiRef.current == null) {
    inputApiRef.current = {};
  }
  return inputApiRef;
}
export function useChartApiInitialization(inputApiRef) {
  const fallbackPublicApiRef = React.useRef({});
  if (inputApiRef) {
    return initializeInputApiRef(inputApiRef);
  }
  return fallbackPublicApiRef;
}