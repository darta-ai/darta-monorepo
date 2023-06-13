import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';
import * as React from 'react';

import {getGalleryPamphlet} from '../../browserFirebase/firebaseDB';
import {AuthEnum} from '../../src/Components/Auth/types';
import {GalleryHeader} from '../../src/Components/Navigation/Headers/GalleryHeader';
import {PamphletLeft} from '../../src/Components/Pamphlet/pamphletLeft';
import {PamphletRight} from '../../src/Components/Pamphlet/pamphletRight';

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
              pamphletData.map((d: any, index: number) => {
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
                } else {
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
                }
              })}
          </Box>
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  const pamphletData = (await getGalleryPamphlet()) as any[];
  return {props: {data: {pamphletData}}};
};
