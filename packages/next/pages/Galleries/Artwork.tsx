import 'firebase/compat/auth';

import {Box, Button, Container} from '@mui/material';
import _ from 'lodash';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import React from 'react';

import {Artwork} from '../../globalTypes';
import {ArtworkCard} from '../../src/Components/Artwork/index';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {
  artwork1,
  artwork2,
  artwork3,
  galleryInquiriesDummyData,
  InquiryArtworkData,
} from '../../src/dummyData';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY, PRIMARY_MILK} from '../../styles';

const aboutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    gap: '2vh',
    my: 10,
    minHeight: '100vh',
    minWidth: '80vw',
    alignSelf: 'center',
    '@media (minWidth: 800px)': {
      paddingTop: '7vh',
    },
  },
  uploadImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '5%',
    alignItems: 'center',
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
  button: {
    color: PRIMARY_BLUE,
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTextField: {
    width: '100%',
  },
};

const newArtworkShell: Artwork = {
  artworkTitle: {
    value: '',
  },
  published: false,
  artistName: {
    value: '',
  },
  artworkImage: {
    value: '',
  },
  artworkImagesArray: [],
  artworkMedium: {
    value: '',
  },
  artworkPrice: {
    value: '',
    isPrivate: false,
  },
  artworkCurrency: {
    value: 'USD',
  },
  canInquire: {
    value: '',
  },
  artworkDescription: {
    value: '',
  },
  slug: {
    value: '',
  },
  artworkDimensions: {
    height: {
      value: '',
    },
    text: {
      value: '',
    },
    width: {
      value: '',
    },
    depth: {
      value: '',
    },
    unit: {
      value: 'in',
    },
  },
  artworkCreatedYear: {
    value: '',
  },
};

// need a function that gets all artworks
// need a function that gets all inquiries for art

export default function GalleryProfile() {
  const [artworks, setArtworks] = React.useState<{[key: string]: Artwork}>({
    ...artwork2,
    ...artwork1,
    ...artwork3,
  });

  const [inquiries, setInquiries] = React.useState<{
    [key: string]: InquiryArtworkData[];
  } | null>(null);

  React.useEffect(() => {
    const inquiriesArray = Object.values(galleryInquiriesDummyData);
    const sortedInquiries: {[key: string]: InquiryArtworkData[]} = {};
    inquiriesArray.forEach((inquiry: InquiryArtworkData) => {
      if (sortedInquiries[inquiry.artworkId!]) {
        sortedInquiries[inquiry.artworkId!].push(inquiry);
      } else {
        sortedInquiries[inquiry.artworkId!] = [inquiry];
      }
    });
    setInquiries(sortedInquiries);
  }, []);

  const addNewArtwork = () => {
    const newArtwork: Artwork = _.deepClone(newArtworkShell);
    newArtwork.artworkId = crypto.randomUUID();
    setArtworks({...artworks, [newArtwork.artworkId]: newArtwork});
  };

  const saveArtwork = (artworkId: string, updatedArtwork: Artwork) => {
    const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
    newArtwork[artworkId] = updatedArtwork;
    setArtworks({...newArtwork});
  };

  return (
    <>
      <Head>
        <title>Darta | Gallery</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <SideNavigationWrapper>
        <Container maxWidth="md" sx={aboutStyles.container}>
          <Button
            variant="contained"
            data-testid="save-button"
            type="submit"
            onClick={() => addNewArtwork()}
            sx={{
              backgroundColor: PRIMARY_BLUE,
              color: PRIMARY_MILK,
              width: '50%',
              alignSelf: 'center',
            }}>
            Create Artwork
          </Button>
          {inquiries &&
            Object.values(artworks).map(artwork => (
              <Box>
                <ArtworkCard
                  artwork={artwork}
                  saveArtwork={saveArtwork}
                  inquiries={inquiries[artwork.artworkId as string]}
                />
              </Box>
            ))}
        </Container>
      </SideNavigationWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  return {props: {data: {data: {}}}};
  // try {
  //   // const aboutData = (await getGallery()) as null;
  // } catch (e) {
  //   return {props: {data: {data: {}}}};
  // }
};
