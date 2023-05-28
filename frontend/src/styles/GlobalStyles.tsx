import { DefaultTheme, createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  html {
    overflow: scroll;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    background: ${(props) => props.theme.colors.background}}
    color: ${(props) => props.theme.colors.textDark}
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};

    :hover {
      color: ${(props) => props.theme.colors.primaryVariant};
    }
  }
`;

export { GlobalStyles };
