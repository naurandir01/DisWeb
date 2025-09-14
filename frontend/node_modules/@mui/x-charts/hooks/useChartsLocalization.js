"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartsLocalization = void 0;
var React = _interopRequireWildcard(require("react"));
var _ChartsLocalizationProvider = require("../ChartsLocalizationProvider/ChartsLocalizationProvider");
const useChartsLocalization = () => {
  const localization = React.useContext(_ChartsLocalizationProvider.ChartsLocalizationContext);
  if (localization === null) {
    throw new Error(['MUI X Charts: Can not find the charts localization context.', 'It looks like you forgot to wrap your component in ChartsLocalizationProvider.', 'This can also happen if you are bundling multiple versions of the `@mui/x-charts` package'].join('\n'));
  }
  return localization;
};
exports.useChartsLocalization = useChartsLocalization;