import {Box, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';

import {AuthEnum} from '../../Auth/types';
import {styles} from './styles';

export function ForgotPassword({routeType}: {routeType: AuthEnum}) {
  return (
    <Box sx={styles.footerBox}>
      <Typography component="div" sx={styles.typography}>
        for got your password? click{' '}
        <Link href={`/ResetPassword/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
}
