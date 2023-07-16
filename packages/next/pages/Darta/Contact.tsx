// Importing necessary modules and components
import {Box, Container, Link, Typography} from '@mui/material';
import Head from 'next/head';
import React from 'react';

import {BaseHeader} from '../../src/Components/Navigation/Headers/BaseHeader';

const useStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2%',
    justifyContent: 'space-around',
    my: 3,
    alignSelf: 'center',
    height: '100vh',
    '@media (min-width: 800px)': {
      height: '100vh',
    },
  },
  contactLinksContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    gap: '7vh',
    '@media (min-width: 800px)': {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
    },
  },
  root: {
    padding: 3,
    marginTop: 3,
  },
  title: {
    alignSelf: 'center',
    fontSize: 40,
    '@media (min-width: 750px)': {
      fontSize: 50,
    },
  },
  contact: {
    marginBottom: 1,
    fontSize: 28,
    fontWeight: 'bold',
    '@media (min-width: 750px)': {
      fontSize: 35,
    },
  },
  contactElementContainer: {
    display: 'flex',
    width: '80%',
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    textAlign: 'center',
    '@media (min-width: 750px)': {
      fontSize: 18,
    },
  },
  reachOutText: {
    fontSize: 16,
    textAlign: 'center',
    '@media (min-width: 750px)': {
      fontSize: 18,
    },
  },
};

function ContactElement({
  title,
  blurb,
  email,
  dataTestId,
}: {
  title: string;
  blurb: string;
  email: string;
  dataTestId: string;
}) {
  return (
    <Box sx={useStyles.contactElementContainer} data-testid={dataTestId}>
      <Typography variant="h4" sx={useStyles.contact}>
        {title}
        <Link href={`mailto:${email}`} color="inherit" />
      </Typography>
      <Typography sx={useStyles.contactText}>{blurb}</Typography>
      <Typography sx={useStyles.reachOutText}>
        <a href={`mailto: ${email}`}>reach out</a>
      </Typography>
    </Box>
  );
}

// Contact component
function Contact() {
  return (
    <>
      <Head>
        <title>Darta | Contact</title>
        <meta name="description" content="Get in touch with Darta." />
      </Head>
      <BaseHeader />
      <Container
        maxWidth="md"
        sx={useStyles.container}
        data-testid="contact-container">
        <Box data-testid="title-box">
          <Typography sx={useStyles.title} data-testid="contact-title">
            Get In Touch
          </Typography>
        </Box>
        <Box
          sx={useStyles.contactLinksContainer}
          data-testid="contact-links-container">
          <ContactElement
            title="support"
            blurb="Have questions about your account or using the app?"
            email="support@darta.works"
            dataTestId="contact-element-support"
          />
          <ContactElement
            title="collaborate"
            blurb="Love the mission? Want to work with us?"
            email="collaborate@darta.works"
            dataTestId="contact-element-collaborate"
          />
          <ContactElement
            title="press"
            blurb="If you're a writer or editor and want to connect on a story."
            email="press@darta.works"
            dataTestId="contact-element-press"
          />
        </Box>
      </Container>
    </>
  );
}

export default Contact;
