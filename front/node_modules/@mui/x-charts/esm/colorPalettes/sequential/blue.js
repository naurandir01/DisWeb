// Blue sequential gradient palette based on the color scheme

export const bluePaletteLight = ['#BDDEFF', '#99CCFF', '#66B2FF', '#2E96FF', '#0064D6', '#0D47A1', '#0A367B', '#072555'];
export const bluePaletteDark = bluePaletteLight;
export const bluePalette = mode => mode === 'dark' ? bluePaletteDark : bluePaletteLight;