import {red} from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';
import {EB_Garamond} from 'next/font/google';

import {PRIMARY_MILK} from '../styles';
import {PRIMARY_600, PRIMARY_50, PRIMARY_950} from '@darta-styles'

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
      main: PRIMARY_50,
    },
    text: {
      primary: PRIMARY_950,
    },
    secondary: {
      main: PRIMARY_600,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: PRIMARY_50,
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
