import * as React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider, EmotionCache} from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import {Footer} from '../src/Components/Navigation/Footer';
import {PRIMARY_MILK} from '../styles';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/700.css';
import {auth} from '../browserFirebase/firebaseApp';
import {onAuthStateChanged} from 'firebase/auth';
export {app, db, auth} from '../browserFirebase/firebaseApp';
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
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Darta | Buy for love</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContext.Provider value={{user, setUser}}>
          <Component {...pageProps} sx={{backgroundColor: PRIMARY_MILK}} />
          <Footer />
        </AuthContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
