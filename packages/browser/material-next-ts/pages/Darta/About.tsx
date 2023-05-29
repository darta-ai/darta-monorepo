import React from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
} from '@mui/material';
import type {GetStaticProps, InferGetStaticPropsType} from 'next';
import {getAbout} from '../../browserFirebase/firebaseDB';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../styles';
import Image from 'next/image';

const aboutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5%',
    width: '100%',
    mb: 5,
    alignSelf: 'center',
    '@media (min-width:800px)': {
      paddingTop: '7vh',
    },
  },
  imageContainer: {
    minWidth: '50%',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    '@media (min-width:800px)': {
      height: '200px',
      width: '150px',
    },
  },
  imageSize: {
    minWidth: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (min-width:800px)': {
      minWidth: '100%',
      height: '100%',
    },
  },
  image: {
    width: `100%`,
    height: 'unset',
    alignSelf: 'center',
    borderRadius: 20,
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width:600px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:800px)': {
      fontSize: '1.3rem',
    },
    cursor: 'default',
  },
  typographyH3: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1.2rem',
    '@media (min-width:800px)': {
      fontSize: '1.75rem',
    },
    cursor: 'default',
  },
};

type AboutData = {
  HeadTitle: string;
  DartaCoreValue: string;
  Headline: string;
  WhoWeAre: string;
  DartaBelief1?: string;
  DartaBelief2?: string;
  DartaBelief3?: string;
  DartaBelief4?: string;
};

// About component
export default function About({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const beliefs = Object.keys(data).filter(key => key.includes('DartaBelief'));
  const values = Object.keys(data).filter(key =>
    key.includes('DartaCoreValue'),
  );
  return (
    <>
      <Head>
        <title>{data.HeadTitle}</title>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>

      <Container maxWidth="md" sx={aboutStyles.container}>
        <Box>
          <Typography variant="h2" sx={aboutStyles.typographyTitle}>
            {data.Headline}
          </Typography>
          <Box component="span" m={1}>
            {values.map(value => (
              <ListItem>
                <Typography sx={aboutStyles.typography}>
                  {data[value]}
                </Typography>
              </ListItem>
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="h2" sx={aboutStyles.typographyTitle}>
            Our Beliefs
          </Typography>
          <List sx={{listStyleType: 'disc', pl: 3}}>
            {beliefs.map((belief, index) => (
              <Box key={index}>
                <ListItem sx={{display: 'list-item'}}>
                  <Typography sx={aboutStyles.typography}>
                    {data[belief]}
                  </Typography>
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
        <Box>
          <Typography variant="h2" sx={aboutStyles.typographyTitle}>
            Who we are
          </Typography>
          <Typography sx={{...aboutStyles.typography, marginTop: '3%'}}>
            {data.WhoWeAre}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <div style={aboutStyles.imageSize}>
                <Image
                  src="/static/images/About/Founder1.jpeg" // Replace with your actual image path
                  title="Founder 1"
                  width={150}
                  height={150}
                  style={aboutStyles.image}
                  alt="Founder 1"
                />
              </div>
              <CardContent>
                <Typography variant="h5">{data.Person1}</Typography>
                <Typography variant="h6">
                  {data.Person1Responsibilities}
                </Typography>
                <Typography variant="body1">{data.Person1Bio}</Typography>
                <Typography variant="body1">
                  contact:{' '}
                  <a href={`mailto: ${data.Person1Email}`}>
                    {data.Person1Email}
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <div style={aboutStyles.imageSize}>
                <Image
                  src="/static/images/About/Founder1.jpeg" // Replace with your actual image path
                  title="Founder 1"
                  width={150}
                  height={150}
                  style={aboutStyles.image}
                  alt="Founder 1"
                />
              </div>
              <CardContent>
                <Typography variant="h5">{data.Person2}</Typography>
                <Typography variant="h6">
                  {data.Person2Responsibilities}
                </Typography>
                <Typography variant="body1">{data.Person2Bio}</Typography>
                <Typography variant="body1">
                  contact:{' '}
                  <a href={`mailto: ${data.Person2Email}`}>
                    {data.Person2Email}
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

type AboutDataFB = {
  data: AboutData;
};

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  try {
    const aboutData = (await getAbout()) as AboutDataFB;
    return {props: {data: aboutData}};
  } catch (e) {
    console.log(e);
    return {props: {data: {data: {}}}};
  }
};
