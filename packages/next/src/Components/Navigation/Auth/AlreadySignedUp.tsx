import {Box, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';

import {AuthEnum} from '../../Auth/types';
import {styles} from './styles';

export function AlreadySignedUp({routeType}: {routeType: AuthEnum}) {
  return (
    <Box sx={styles.footerBox} data-testid="alreadyHaveAccount">
      <Typography component="div" sx={styles.typography}>
        already have an account? click{' '}
        <Link href={`/Authenticate/${routeType}`}>here</Link>
      </Typography>
    </Box>
  );
}
