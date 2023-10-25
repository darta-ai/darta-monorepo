import * as Colors from '@darta-styles';
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
import Head from 'next/head';
import React from 'react';

import {aboutData} from '../../data/pamphletPages';
import {BaseHeader} from '../../src/Components/Navigation/Headers/BaseHeader';
import {PRIMARY_DARK_GREY} from '../../styles';

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
    color: Colors.PRIMARY_800,
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

export default function About() {
  return (
    <>
      <Head>
        <title>{aboutData.HeadTitle}</title>
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
            {aboutData.Headline}
          </Typography>
          <Box component="span" m={1} data-testid="values-list">
            {aboutData?.DartaCoreValue1 && (
              <ListItem data-testid="value-item-1" key="value-item-1">
                <Typography
                  paragraph
                  sx={aboutStyles.typography}
                  data-testid="value-item-text-1">
                  {aboutData.DartaCoreValue1}
                </Typography>
              </ListItem>
            )}
            {aboutData?.DartaCoreValue2 && (
              <ListItem data-testid="value-item-2" key="value-item-2">
                <Typography
                  paragraph
                  sx={aboutStyles.typography}
                  data-testid="value-item-text-2">
                  {aboutData.DartaCoreValue2}
                </Typography>
              </ListItem>
            )}
            {aboutData?.DartaCoreValue3 && (
              <ListItem data-testid="value-item-3" key="value-item-3">
                <Typography
                  paragraph
                  sx={aboutStyles.typography}
                  data-testid="value-item-text-3">
                  {aboutData.DartaCoreValue3}
                </Typography>
              </ListItem>
            )}
            {aboutData?.DartaCoreValue4 && (
              <ListItem data-testid="value-item-4" key="value-item-4">
                <Typography
                  paragraph
                  sx={aboutStyles.typography}
                  data-testid="value-item-text-4">
                  {aboutData.DartaCoreValue4}
                </Typography>
              </ListItem>
            )}
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
            {aboutData?.DartaBelief1 && (
              <Box data-testid="belief-box-1" key="belief-box-1">
                <ListItem
                  sx={{display: 'list-item'}}
                  data-testid="belief-item-1">
                  <Typography
                    sx={aboutStyles.typography}
                    data-testid="belief-text-1">
                    {aboutData.DartaBelief1}
                  </Typography>
                </ListItem>
              </Box>
            )}
            {aboutData?.DartaBelief2 && (
              <Box data-testid="belief-box-2" key="belief-box-2">
                <ListItem
                  sx={{display: 'list-item'}}
                  data-testid="belief-item-2">
                  <Typography
                    sx={aboutStyles.typography}
                    data-testid="belief-text-2">
                    {aboutData.DartaBelief2}
                  </Typography>
                </ListItem>
              </Box>
            )}
            {aboutData?.DartaBelief3 && (
              <Box data-testid="belief-box-3" key="belief-box-3">
                <ListItem
                  sx={{display: 'list-item'}}
                  data-testid="belief-item-3">
                  <Typography
                    sx={aboutStyles.typography}
                    data-testid="belief-text-3">
                    {aboutData.DartaBelief3}
                  </Typography>
                </ListItem>
              </Box>
            )}
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
            {aboutData.WhoWeAre}
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
                  {aboutData.Person1}
                </Typography>
                <Typography
                  variant="h6"
                  data-testid="founder-1-responsibilities">
                  {aboutData.Person1Responsibilities}
                </Typography>
                {/* <Typography variant="body1" data-testid="founder-1-bio">{data.Person1Bio}</Typography> */}
                <Typography variant="body1" data-testid="founder-1-email">
                  <a style={{color: Colors.PRIMARY_400}}
                    href={`mailto: ${aboutData.Person1Email}`}
                    data-testid="founder-1-email-link">
                    {aboutData.Person1Email}
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
                  {aboutData.Person2}
                </Typography>
                <Typography
                  variant="h6"
                  data-testid="founder-2-responsibilities">
                  {aboutData.Person2Responsibilities}
                </Typography>
                {/* <Typography variant="body1" data-testid="founder-2-bio">{data.Person2Bio}</Typography> */}
                <Typography variant="body1" data-testid="founder-2-email">
                  <a style={{color: Colors.PRIMARY_400}}
                    href={`mailto: ${aboutData.Person2Email}`}
                    data-testid="founder-2-email-link">
                    {aboutData.Person2Email}
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
