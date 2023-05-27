import React from 'react';
import {Typography, Box} from '@mui/material';
import {AuthEnum} from '../../Auth/types';
import Link from 'next/link';
import {styles} from './styles'

export const ForgotPassword = ({routeType}: {routeType: AuthEnum}) => {
  return (
    <Box sx={styles.footerBox}>
      <Typography component="div" sx={styles.typography}>
        for got your password? click{' '}
        {/* <Link href={`/ResetPassword/${routeType}`}>here</Link> */}
      </Typography>
    </Box>
  );
};
