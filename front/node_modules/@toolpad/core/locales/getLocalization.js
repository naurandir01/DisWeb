"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalization = void 0;
const getLocalization = translations => {
  return {
    components: {
      MuiLocalizationProvider: {
        defaultProps: {
          localeText: {
            ...translations
          }
        }
      }
    }
  };
};
exports.getLocalization = getLocalization;