import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {getGalleryPamphlet} from '../../browserFirebase/firebaseDB';
import {PamphletRight} from '../../src/Components/Pamphlet/pamphletRight';
import {PamphletLeft} from '../../src/Components/Pamphlet/pamphletLeft';

import {GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';
import {GalleryHeader} from '../../src/Components/Navigation/Headers/GalleryHeader';
import {AuthEnum} from '../../src/Components/Auth/types';

export default function Home({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {pamphletData} = data;
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>
      <GalleryHeader />
      <Container maxWidth="lg">
        {pamphletData && (
          <Box
            sx={{
              my: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {pamphletData &&
              pamphletData.map((data: any, index: number) => {
                const isEven = index % 2 === 0;
                const pamphletData = data;
                if (isEven) {
                  return (
                    <PamphletRight
                      key={index}
                      headline={pamphletData?.headline}
                      line1={pamphletData?.line1}
                      line2={pamphletData?.line2}
                      line3={pamphletData?.line3}
                      index={index}
                      authType={AuthEnum.galleries}
                    />
                  );
                } else {
                  return (
                    <PamphletLeft
                      key={index}
                      headline={pamphletData?.headline}
                      line1={pamphletData?.line1}
                      line2={pamphletData?.line2}
                      line3={pamphletData?.line3}
                      index={index}
                      authType={AuthEnum.galleries}
                    />
                  );
                }
              })}
          </Box>
        )}
      </Container>
    </>
  );
}

type PamphletData = {
  pamphletData: any;
};

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  const pamphletData = (await getGalleryPamphlet()) as any[];
  return {props: {data: {pamphletData}}};
};
