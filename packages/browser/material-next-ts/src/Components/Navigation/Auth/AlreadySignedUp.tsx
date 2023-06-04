import React from 'react';
import {Typography, Box} from '@mui/material';
import {AuthEnum} from '../../Auth/types';
import Link from 'next/link';
import {styles} from './styles';

export const AlreadySignedUp = ({routeType}: {routeType: AuthEnum}) => {
  return (
    <Box sx={styles.footerBox} data-testid="alreadyHaveAccount">
      <Typography component="div" sx={styles.typography}>
        already have an account? click{' '}
        <Link href={`/Authenticate/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
};
