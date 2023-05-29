import React from 'react';
import {Box, Typography} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY, PRIMARY_MILK} from '../../styles';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '180vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:600px)': {
      padding: '10vh',
      flexDirection: 'row',
      height: '100vh',
    },

    boarderRadius: '30px',
  },
};

export default function ForgotPassword() {
  return (
    <>
      <Box sx={styles.container}>
        <Typography>forgot password</Typography>
      </Box>
    </>
  );
}
