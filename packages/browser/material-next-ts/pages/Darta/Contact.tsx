// Importing necessary modules and components
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Box, Link} from '@mui/material';

const useStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2%',
    justifyContent: 'space-around',
    width: '100%',
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

const ContactElement = ({
  title,
  blurb,
  email,
  dataTestId,
}: {
  title: string;
  blurb: string;
  email: string;
  dataTestId: string;
}) => {
  return (
    <Box sx={useStyles.contactElementContainer} data-testid={dataTestId}>
      <Typography variant="h4" sx={useStyles.contact}>
        {title}
        <Link href={`mailto:${email}`} color="inherit"></Link>
      </Typography>
      <Typography sx={useStyles.contactText}>{blurb}</Typography>
      <Typography sx={useStyles.reachOutText}>
        <a href={`mailto: ${email}`}>reach out</a>
      </Typography>
    </Box>
  );
};

// Contact component
const Contact = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Darta | Contact</title>
        <meta name="description" content="Get in touch with Darta." />
      </Head>

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
            blurb="Love the mission? Want to work with us? Want equity?"
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
    </React.Fragment>
  );
};

export default Contact;
