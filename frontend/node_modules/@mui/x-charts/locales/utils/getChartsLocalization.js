"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChartsLocalization = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
/**
 * Helper to pass translation to all charts thanks to the MUI theme.
 * @param chartsTranslations The translation object.
 * @returns an object to pass the translation by using the MUI theme default props
 */
const getChartsLocalization = chartsTranslations => {
  return {
    components: {
      MuiChartsLocalizationProvider: {
        defaultProps: {
          localeText: (0, _extends2.default)({}, chartsTranslations)
        }
      }
    }
  };
};
exports.getChartsLocalization = getChartsLocalization;