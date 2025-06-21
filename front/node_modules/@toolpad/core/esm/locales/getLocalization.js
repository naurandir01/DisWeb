export const getLocalization = translations => {
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