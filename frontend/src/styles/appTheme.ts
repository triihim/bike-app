import 'styled-components';

export const appTheme = {
  colors: {
    background: '#ebeced',
    surface: '#FCFAF9',
    primary: '#04A777',
    primaryVariant: '#118965',
    secondary: '#CD5334',
    textLight: '#FCFAF9',
    textDark: '#35393C',
    textDarkVariant: '#4f4f4f',
    divider: '#35393C',
    errorText: '#fad7d8',
    errorBackground: '#cf191e',
    infoText: '#e3f1f9',
    infoBackground: '#61adde',
    successText: '#daf7e3',
    successBackground: '#2ed15e',
  },
};

export type AppTheme = typeof appTheme;
