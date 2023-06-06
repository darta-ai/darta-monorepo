import {Box, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';

import {AuthEnum} from '../../Auth/types';
import {styles} from './styles';

export function NeedAnAccount({routeType}: {routeType: AuthEnum}) {
  return (
    <Box sx={styles.footerBox}>
      <Typography component="div" sx={styles.typography}>
        need an account? click{' '}
        <Link href={`/CreateAccount/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
}
