import React from 'react';
import {Typography, Box} from '@mui/material';
import {AuthEnum} from '../../Auth/types';
import Link from 'next/link';
import {styles} from './styles';

export const NeedAnAccount = ({routeType}: {routeType: AuthEnum}) => {
  return (
    <Box sx={styles.footerBox}>
      <Typography component="div" sx={styles.typography}>
        need an account? click{' '}
        <Link href={`/CreateAccount/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
};
