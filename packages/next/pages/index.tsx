import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';
import * as React from 'react';

import {getPamphlet} from '../browserFirebase/firebaseDB';
import {AuthEnum} from '../src/Components/Auth/types';
import {BaseHeader} from '../src/Components/Navigation/Headers/BaseHeader';
import {PamphletLeft} from '../src/Components/Pamphlet/pamphletLeft';
import {PamphletRight} from '../src/Components/Pamphlet/pamphletRight';

export default function Home({
  staticData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {pamphletData} = staticData;
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
                if (isEven) {
                  return (
                    <PamphletRight
                      key={data?.headline}
                      headline={data?.headline}
                      line1={data?.line1}
                      line2={data?.line2}
                      line3={data?.line3}
                      index={index}
                      authType={AuthEnum.home}
                    />
                  );
                } else {
                  return (
                    <PamphletLeft
                      key={data?.headline}
                      headline={data?.headline}
                      line1={data?.line1}
                      line2={data?.line2}
                      line3={data?.line3}
                      index={index}
                      authType={AuthEnum.home}
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
  staticData: any;
}> = async () => {
  const pamphletData = (await getPamphlet()) as any[];
  return {props: {staticData: {pamphletData}}};
};
