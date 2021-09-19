
import React from 'react'
import { ThemeProvider } from '@material-ui/core'
import { theme } from './themes/base';
import { MemoryRouter as Router } from 'react-router-dom';
import Main from './components/Main';
import { LoadingSpinnerComponent } from './components/LoadingSpinner';
import { SnackbarProvider } from 'notistack';




const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SnackbarProvider preventDuplicate anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}>
          <Main />
          <LoadingSpinnerComponent />
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
