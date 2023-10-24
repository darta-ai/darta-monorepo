import * as Colors from '@darta-styles'
import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';

import {BaseHeader} from '../src/Components/Navigation/Headers/BaseHeader';
import { MainLanding } from '../src/Components/Pamphlet/MainLanding';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '170vh',
    height: '100%',
    backgroundColor: Colors.PRIMARY_500,
    '@media (min-width:800px)': {
      minHeight: '90vh',
    },
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Darta | Welcome</title>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>
      <BaseHeader />
      <Box sx={styles.container}>
        <MainLanding />
      </Box>
      </>
  );
}
