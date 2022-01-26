import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./theme";
import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import { QueryClient, QueryClientProvider } from "react-query";

const GlobalStyle = createGlobalStyle`
 ${reset}
  @font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Cafe24SsurroundAir';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24SsurroundAir.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

* {
  box-sizing: border-box;
}
body {
  color:${(props) => props.theme.white.darker};
  line-height: 1.2;
  background-color: black;
}
a {
  text-decoration:none;
  color:inherit;
}
  li {
    list-style:none;
  }
`;

const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
