import 'firebase/compat/auth';

import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import React from 'react';

import {Exhibition} from '../../globalTypes';
import {ArtworkCard} from '../../src/Components/Artwork/index';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {galleryStyles} from '../../styles/GalleryPageStyles';

const newExhibitionShell: Exhibition = {
  exhibitionTitle: '',
  pressRelease: '',
  mediumsUsed: [],
  artists: [],
  artworks: {},
  published: false,
  slug: '',
  exhibitionId: '',
};

// need a function that gets all artworks
// need a function that gets all inquiries for art

export default function GalleryExhibitions() {
  const [exhibitions, setNewExhibitions] = React.useState<{
    [key: string]: Exhibition;
  }>({});

  const addNewExhibition = () => {
    const newExhibition: Exhibition = _.cloneDeep(newExhibitionShell);
    newExhibition.exhibitionId = crypto.randomUUID();
    setNewExhibitions({
      ...exhibitions,
      [newExhibition.exhibitionId]: newExhibition,
    });
  };

  // const saveArtwork = (artworkId: string, updatedArtwork: Artwork) => {
  //   const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
  //   newArtwork[artworkId] = updatedArtwork;
  //   setArtworks({...newArtwork});
  // };

  // const deleteArtwork = (artworkId: string) => {
  //   const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
  //   delete newArtwork[artworkId];
  //   setArtworks({...newArtwork});
  // };

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
        <Box sx={galleryStyles.container}>
          <Box>
            <Typography variant="h2" sx={galleryStyles.typographyTitle}>
              Exhibitions
            </Typography>
          </Box>
          <Button
            variant="contained"
            data-testid="save-button"
            type="submit"
            onClick={() => addNewExhibition()}
            sx={galleryStyles.createNewButton}>
            Create Exhibition
          </Button>
        </Box>
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
