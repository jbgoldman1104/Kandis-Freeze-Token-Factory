import React from 'react'
import ReactDOM from 'react-dom'
import { createTheme } from '@mui/material/styles';
import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider'

import './index.scss'
import App from './App'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
      <React.StrictMode>
        <WalletProvider {...chainOptions}>
          <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </WalletProvider>
      </React.StrictMode>,
    document.getElementById('root'),
  )
})
