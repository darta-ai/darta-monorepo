import {Box, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';

import {AuthEnum} from '../../Auth/types';
import {styles} from './styles';

export function GoToSignIn({routeType}: {routeType: AuthEnum}) {
  return (
    <Box sx={styles.footerBox}>
      <Typography component="div" sx={styles.typography}>
        To go to sign in, click{' '}
        <Link href={`/Authenticate/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
}
