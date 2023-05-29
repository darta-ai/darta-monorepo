import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import {getPamphlet} from '../browserFirebase/firebaseDB';
import {PamphletRight} from '../src/Components/Pamphlet/pamphletRight';
import {PamphletLeft} from '../src/Components/Pamphlet/pamphletLeft';
import {PRIMARY_MILK} from '../styles';
import type {GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';

export default function Home({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {pamphletData} = data;
  return (
    <>
      <Head>
        <title>Darta | Welcome</title>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>
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
  const pamphletData = (await getPamphlet()) as any[];
  return {props: {data: {pamphletData}}};
};
