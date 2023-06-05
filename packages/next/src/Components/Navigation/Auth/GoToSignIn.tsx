import React from 'react';
import {Typography, Box} from '@mui/material';
import {AuthEnum} from '../../Auth/types';
import Link from 'next/link';
import {styles} from './styles';

export const GoToSignIn = ({routeType}: {routeType: AuthEnum}) => {
  return (
    <Box sx={styles.footerBox}>
      <Typography component="div" sx={styles.typography}>
        To go to sign in, click{' '}
        <Link href={`/Authenticate/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
};
