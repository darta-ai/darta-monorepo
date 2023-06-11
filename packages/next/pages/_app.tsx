/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/700.css';

import {CacheProvider, EmotionCache} from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {onAuthStateChanged} from 'firebase/auth';
import {AppProps} from 'next/app';
import Head from 'next/head';
// import Script from 'next/script';
import * as React from 'react';

import {Footer} from '../src/Components/Navigation/Footer';
import createEmotionCache from '../src/createEmotionCache';
import theme from '../src/theme';
import {PRIMARY_MILK} from '../styles';
import {auth} from '../ThirdPartyAPIs/firebaseApp';

export {app, auth, db} from '../ThirdPartyAPIs/firebaseApp';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export const AuthContext = React.createContext<{
  user: any | null;
  setUser: (user: any | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export default function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const [user, setUser] = React.useState<any | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
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
          <Component {...pageProps} sx={{backgroundColor: PRIMARY_MILK}} />
          <Footer />
        </AuthContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
