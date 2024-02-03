

// React page where user can view all galleries in a table format with their current exhibitions 

import { Box } from '@mui/material';
import React from 'react';

import { SignInForm } from '../../src/Components/Auth';
import { AuthEnum } from '../../src/Components/Auth/types';
import { BaseHeader } from '../../src/Components/Navigation/Headers/BaseHeader';


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:800px)': {
      padding: '10vh',
      flexDirection: 'row',
    },

    boarderRadius: '30px',
  },
};

export default function GalleryAdmin() {
  // const [exhibitions] = React.useState<ExhibitionPreviewAdmin[]>([]);

  return (
    <>
      <BaseHeader />
      <Box sx={styles.container}>
          <SignInForm signInType={AuthEnum.admin} />
      </Box>
    </>
  );
}


