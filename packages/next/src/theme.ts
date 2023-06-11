import {red} from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';
import {EB_Garamond} from 'next/font/google';

import {PRIMARY_BLUE, PRIMARY_MILK} from '../styles';

export const ebGaramond = EB_Garamond({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['EB Garamond', 'serif'],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_MILK,
    },
    secondary: {
      main: PRIMARY_BLUE,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: PRIMARY_MILK,
    },
  },
  typography: {
    body1: {
      fontFamily: 'Nunito Sans',
    },
    h1: {
      fontFamily: 'EB Garamond',
    },
    h2: {
      fontFamily: 'EB Garamond',
    },
    h3: {
      fontFamily: 'EB Garamond',
    },
    h4: {
      fontFamily: 'EB Garamond',
    },
    h5: {
      fontFamily: 'EB Garamond',
    },
    h6: {
      fontFamily: 'EB Garamond',
    },
  },
});

export default theme;
