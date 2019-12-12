import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
}

body {
  margin: 0 auto;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F0F1F2;
  overflow-x: auto;
  
  .MuiButton-root {
    text-transform: unset;
    font-size: 12px;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > div.wrapper {
      display: flex;
      flex: 1;
      overflow-y: auto;

      & > div {
        &:not(.staking) {
          padding-top: 16px;
          margin: 0 auto;
          min-width: 1280px;
          max-width: 1440px;
        }
      }
    }
  }
}

h6, p {
  margin: 0;
}

ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
`

export default GlobalStyle
