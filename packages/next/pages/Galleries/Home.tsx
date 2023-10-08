import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Head from 'next/head';
import React from 'react';

import {galleryPamphletData} from '../../data/pamphletPages';
import {AuthEnum} from '../../src/Components/Auth/types';
import {GalleryHeader} from '../../src/Components/Navigation/Headers/GalleryHeader';
import {PamphletLeft} from '../../src/Components/Pamphlet/pamphletLeft';
import {PamphletRight} from '../../src/Components/Pamphlet/pamphletRight';

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>
      <GalleryHeader />
      <Container maxWidth="xl" sx={{mt: '20vh'}}>
        {galleryPamphletData && (
          <Box
            sx={{
              my: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {galleryPamphletData &&
              galleryPamphletData.map((d: any, index: number) => {
                const isEven = index % 2 === 0;
                if (isEven) {
                  return (
                    <PamphletRight
                      key={d?.headline}
                      headline={d?.headline}
                      line1={d?.line1}
                      line2={d?.line2}
                      line3={d?.line3}
                      index={index}
                      authType={AuthEnum.galleries}
                    />
                  );
                } 
                  return (
                    <PamphletLeft
                      key={d?.headline}
                      headline={d?.headline}
                      line1={d?.line1}
                      line2={d?.line2}
                      line3={d?.line3}
                      index={index}
                      authType={AuthEnum.galleries}
                    />
                  );
              })}
          </Box>
        )}
      </Container>
    </>
  );
}
