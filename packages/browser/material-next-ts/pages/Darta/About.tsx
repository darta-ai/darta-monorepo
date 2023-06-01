import React from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
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
    '@media (min-width: 800px)': {
      paddingTop: '7vh',
    },
  },
  imageContainer: {
    minWidth: '20vh',
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
    minWidth: '20vh',
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
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width:800px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (minWidth: 800px)': {
      fontSize: '1.3rem',
    },
    cursor: 'default',
  },
  typographyH3: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1.2rem',
    '@media (minWidth: 800px)': {
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
              <ListItem data-testid={`value-item-${index}`}>
                <Typography
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
              <Box key={index} data-testid={`belief-box-${index}`}>
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
            sx={{...aboutStyles.typography, marginTop: '3%'}}
            data-testid="who-we-are-text">
            {data.WhoWeAre}
          </Typography>
        </Box>
        <Grid container spacing={6} data-testid="founders-grid">
          <Grid item xs={12} sm={3} data-testid="founder-1-grid">
            <Card data-testid="founder-1-card">
              <div
                style={aboutStyles.imageSize}
                data-testid="founder-1-image-container">
                <Image
                  src="/static/images/About/Founder1.jpeg" // Replace with your actual image path
                  title="Founder 1"
                  width={150}
                  height={150}
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
            <Card data-testid="founder-2-card">
              <div
                style={aboutStyles.imageSize}
                data-testid="founder-2-image-container">
                <Image
                  src="/static/images/About/Founder2.jpeg"
                  title="Founder 1"
                  width={150}
                  height={150}
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
