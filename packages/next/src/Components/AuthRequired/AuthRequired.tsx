/* eslint-disable react/jsx-props-no-spreading */
// authRequired.js
import {Box, CircularProgress, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

import {AuthContext} from '../../../pages/_app';

const baseStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    gap: '1vh',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function authRequired(WrappedComponent: any) {
  return function (props: any) {
    const Router = useRouter();
    const {user} = React.useContext(AuthContext);

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
      if (!user) {
        Router.replace('/Authenticate/Galleries');
      }
      setIsLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
      <Box>
        {isLoading ? (
          <Box sx={baseStyles.container}>
            <CircularProgress color="secondary" />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <WrappedComponent {...props} />
        )}
      </Box>
    );
  };
}
