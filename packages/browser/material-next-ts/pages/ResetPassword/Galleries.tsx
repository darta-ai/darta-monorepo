import React from 'react';
import {Box} from '@mui/material';
import {
  ForgotPasswordWelcome,
  ForgotPasswordForm,
} from '../../src/Components/Auth/';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '180vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:800px)': {
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
        <ForgotPasswordWelcome />
        <ForgotPasswordForm />
      </Box>
    </>
  );
}
