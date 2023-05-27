import { DefaultTheme, createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    background: ${(props) => props.theme.colors.background}}
  }
`;

export { GlobalStyles };
