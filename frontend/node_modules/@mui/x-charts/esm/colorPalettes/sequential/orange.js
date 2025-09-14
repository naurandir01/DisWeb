// Orange sequential gradient palette based on the color scheme

export const orangePaletteLight = ['#FBDBC3', '#F9BD92', '#F99F5D', '#FF7A19', '#FD620B', '#E15100', '#AC3E00', '#822F00'];
export const orangePaletteDark = orangePaletteLight;
export const orangePalette = mode => mode === 'dark' ? orangePaletteDark : orangePaletteLight;