// Green sequential gradient palette based on the color scheme

export const greenPaletteLight = ['#CDEBDD', '#B2E2CB', '#8FD8B5', '#54C690', '#31B375', '#359F6D', '#0F7746', '#065731'];
export const greenPaletteDark = greenPaletteLight;
export const greenPalette = mode => mode === 'dark' ? greenPaletteDark : greenPaletteLight;