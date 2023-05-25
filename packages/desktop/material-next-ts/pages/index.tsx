import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import {getPamphlet} from '../frontendFirebase/firebaseDB';
import {PamphletRight} from '../src/Components/Pamphlet/pamphletRight';
import {PamphletLeft} from '../src/Components/Pamphlet/pamphletLeft';
import {PRIMARY_MILK} from '../styles';

Home.getInitialProps = async () => {
  const pamphletData = await getPamphlet();
  return {pamphletData};
};

export default function Home({pamphletData}: {pamphletData: any}) {
  return (
    <Container maxWidth="lg">
      {pamphletData && (
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10%',
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
  );
}
