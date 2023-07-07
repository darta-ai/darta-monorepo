/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/700.css';

import {CacheProvider, EmotionCache} from '@emotion/react';
import {Box, CircularProgress} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {onAuthStateChanged} from 'firebase/auth';
import type {AppProps} from 'next/app';
import Head from 'next/head';
// import Script from 'next/script';
import React from 'react';

import {Footer} from '../src/Components/Navigation/Footer';
import {AppContextProvider} from '../src/Components/State/AppContext';
import createEmotionCache from '../src/createEmotionCache';
import theme from '../src/theme';
import {PRIMARY_MILK} from '../styles';
import {auth} from '../ThirdPartyAPIs/firebaseApp';

export {app, auth, db} from '../ThirdPartyAPIs/firebaseApp';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export const baseStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    border: '1px solid #eaeaea',
    alignSelf: 'center',
    borderRadius: '0.5vw',
    gap: '1vh',
    alignContent: 'center',
    '@media (min-width: 800px)': {
      width: '80vw',
    },
  },
};

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
interface IAuthContext {
  user: any | null;
  setUser: (user: any | null) => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  user: null,
  setUser: () => {},
});

// Declares a module and modifies the ElementType of the JSX namespace.
// This is an advanced TypeScript feature where you can declare new types or modify existing ones.
// It's often used for augmenting types when using third-party libraries that don't have perfect TypeScript support.

export default function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const [user, setUser] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = React.useMemo(() => ({user, setUser}), [user, setUser]);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Darta | Buy for love</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContext.Provider value={value}>
          <AppContextProvider>
            {isLoading ? (
              <Box sx={baseStyles.container}>
                <CircularProgress />
              </Box>
            ) : (
              <Component {...pageProps} sx={{backgroundColor: PRIMARY_MILK}} />
            )}
          </AppContextProvider>
          <Footer />
        </AuthContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
