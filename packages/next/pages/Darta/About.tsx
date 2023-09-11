/* eslint-disable react/no-array-index-key */
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';
import React from 'react';

import {BaseHeader} from '../../src/Components/Navigation/Headers/BaseHeader';
import {getAbout} from '../../src/ThirdPartyAPIs/firebaseDB';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../styles';

const aboutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5%',
    width: '100%',
    mb: 5,
    alignSelf: 'center',
    '@media (min-width: 800px)': {
      paddingTop: '7vh',
    },
  },
  imageContainer: {
    minWidth: '25vh',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    '@media (min-width: 800px)': {
      height: '15vh',
      width: '10vh',
    },
  },
  imageSize: {
    minWidth: '25vh',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (min-width: 800px)': {
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
    fontFamily: 'Nunito Sans',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width:800px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'Nunito Sans',
    color: PRIMARY_DARK_GREY,
    fontSize: '1.3rem',
    '@media (min-width: 800px)': {},
    cursor: 'default',
  },
  typographyH3: {
    fontFamily: 'Nunito Sans',
    color: PRIMARY_DARK_GREY,
    fontSize: '1.2rem',
    '@media (min-width: 800px)': {
      fontSize: '1.75rem',
    },
    cursor: 'default',
  },
  peopleContainer: {
    display: 'flex',
    flexDirection: 'column',
    '@media (min-width: 760px)': {
      flexDirection: 'row',
    },
  },
  card: {
    width: '90vw',
    '@media (min-width: 800px)': {
      width: '20vw',
    },
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
  const beliefs = Object.keys(data)
    .filter(key => key.includes('DartaBelief'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('DartaBelief', ''), 10);
      const numB = parseInt(b.replace('DartaBelief', ''), 10);

      return numA - numB;
    });
  const values = Object.keys(data)
    .filter(key => key.includes('DartaCoreValue'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('DartaCoreValue', ''), 10);
      const numB = parseInt(b.replace('DartaCoreValue', ''), 10);

      return numA - numB;
    });

  return (
    <>
      <Head>
        <title>{data.HeadTitle}</title>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>
      <BaseHeader />
      <Container
        maxWidth="md"
        sx={aboutStyles.container}
        data-testid="about-container">
        <Box data-testid="headline-box">
          <Typography
            variant="h2"
            sx={aboutStyles.typographyTitle}
            data-testid="headline">
            {data.Headline}
          </Typography>
          <Box component="span" m={1} data-testid="values-list">
            {values.map((value, index) => (
              <ListItem
                data-testid={`value-item-${index}`}
                key={`value-item-${index}`}>
                <Typography
                  paragraph
                  sx={aboutStyles.typography}
                  data-testid={`value-item-text-${index}`}>
                  {data[value]}
                </Typography>
              </ListItem>
            ))}
          </Box>
        </Box>
        <Box data-testid="beliefs-box">
          <Typography
            variant="h2"
            sx={aboutStyles.typographyTitle}
            data-testid="beliefs-title">
            Our Beliefs
          </Typography>
          <List sx={{listStyleType: 'disc', pl: 3}} data-testid="beliefs-list">
            {beliefs.map((belief, index) => (
              <Box
                data-testid={`belief-box-${index}`}
                key={`belief-box-${index}`}>
                <ListItem
                  sx={{display: 'list-item'}}
                  data-testid={`belief-item-${index}`}>
                  <Typography
                    sx={aboutStyles.typography}
                    data-testid={`belief-text-${index}`}>
                    {data[belief]}
                  </Typography>
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
        <Box data-testid="who-we-are-box">
          <Typography
            variant="h2"
            sx={aboutStyles.typographyTitle}
            data-testid="who-we-are-title">
            Who we are
          </Typography>
          <Typography
            sx={{...aboutStyles.typography, my: '5%'}}
            data-testid="who-we-are-text">
            {data.WhoWeAre}
          </Typography>
        </Box>
        <Grid
          container
          sx={aboutStyles.peopleContainer}
          spacing={12}
          data-testid="founders-grid">
          <Grid item data-testid="founder-1-grid">
            <Card sx={aboutStyles.card} data-testid="founder-1-card">
              <div
                style={aboutStyles.imageSize}
                data-testid="founder-1-image-container">
                <Box
                  component="img"
                  src="/static/images/About/Founder1.jpeg"
                  title="Founder 1"
                  style={aboutStyles.image}
                  alt="Founder 1"
                  data-testid="founder-1-image"
                />
              </div>
              <CardContent data-testid="founder-1-card-content">
                <Typography variant="h5" data-testid="founder-1-name">
                  {data.Person1}
                </Typography>
                <Typography
                  variant="h6"
                  data-testid="founder-1-responsibilities">
                  {data.Person1Responsibilities}
                </Typography>
                {/* <Typography variant="body1" data-testid="founder-1-bio">{data.Person1Bio}</Typography> */}
                <Typography variant="body1" data-testid="founder-1-email">
                  <a
                    href={`mailto: ${data.Person1Email}`}
                    data-testid="founder-1-email-link">
                    {data.Person1Email}
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} data-testid="founder-2-grid">
            <Card sx={aboutStyles.card} data-testid="founder-2-card">
              <div
                style={aboutStyles.imageSize}
                data-testid="founder-2-image-container">
                <Box
                  component="img"
                  src="/static/images/About/Founder2.jpeg"
                  title="Founder 2"
                  style={aboutStyles.image}
                  alt="Founder 2"
                  data-testid="founder-2-image"
                />
              </div>
              <CardContent data-testid="founder-2-card-content">
                <Typography variant="h5" data-testid="founder-2-name">
                  {data.Person2}
                </Typography>
                <Typography
                  variant="h6"
                  data-testid="founder-2-responsibilities">
                  {data.Person2Responsibilities}
                </Typography>
                {/* <Typography variant="body1" data-testid="founder-2-bio">{data.Person2Bio}</Typography> */}
                <Typography variant="body1" data-testid="founder-2-email">
                  <a
                    href={`mailto: ${data.Person2Email}`}
                    data-testid="founder-2-email-link">
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
    return {props: {data: {data: {}}}};
  }
};
