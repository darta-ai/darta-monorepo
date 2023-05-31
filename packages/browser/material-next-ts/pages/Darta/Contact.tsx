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
  },
  contact: {
    marginBottom: 1,
    fontWeight: 'bold',
  },
  contactElementContainer: {
    display: 'flex',
    width: '80%',
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 18,
    textAlign: 'center',
  },
  reachOutText: {
    fontSize: 18,
    textAlign: 'center',
  },
};

const ContactElement = ({
  title,
  blurb,
  email,
}: {
  title: string;
  blurb: string;
  email: string;
}) => {
  return (
    <Box sx={useStyles.contactElementContainer}>
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

      <Container maxWidth="md" sx={useStyles.container}>
        <Box>
          <Typography variant="h2" sx={useStyles.title}>
            Get In Touch
          </Typography>
        </Box>
        <Box sx={useStyles.contactLinksContainer}>
          <ContactElement
            title="support"
            blurb="Have questions about your account or using the app?"
            email="support@darta.works"
          />
          <ContactElement
            title="collaborate"
            blurb="Love the mission? Want to work with us? Want equity?"
            email="collaborate@darta.works"
          />
          <ContactElement
            title="press"
            blurb="If you're a writer or editor and want to connect on a story."
            email="press@darta.works"
          />
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Contact;
