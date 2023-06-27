import 'firebase/compat/auth';

import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import React from 'react';

import {Artwork} from '../../globalTypes';
import {ArtworkCard} from '../../src/Components/Artwork/index';
import {newArtworkShell} from '../../src/Components/common/templates';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {
  artwork1,
  artwork2,
  artwork3,
  galleryInquiriesDummyData,
  InquiryArtworkData,
} from '../../src/dummyData';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../styles';
import {galleryStyles} from '../../styles/GalleryPageStyles';

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
    const newArtwork: Artwork = _.cloneDeep(newArtworkShell);
    newArtwork.artworkId = crypto.randomUUID();
    newArtwork.updatedAt = new Date().toISOString();
    newArtwork.createdAt = new Date().toISOString();
    setArtworks({...artworks, [newArtwork.artworkId]: newArtwork});
  };

  const saveArtwork = (artworkId: string, updatedArtwork: Artwork) => {
    const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
    newArtwork[artworkId] = updatedArtwork;
    setArtworks({...newArtwork});
  };

  const deleteArtwork = (artworkId: string) => {
    const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
    delete newArtwork[artworkId];
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
        <Box sx={galleryStyles.container}>
          <Box>
            <Typography variant="h2" sx={galleryStyles.typographyTitle}>
              Artwork
            </Typography>
          </Box>
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
            Object.values(artworks)
              .sort((a, b) => {
                const dateA = a?.createdAt
                  ? new Date(a.createdAt)
                  : new Date(0);
                const dateB = b?.createdAt
                  ? new Date(b.createdAt)
                  : new Date(0);
                return (dateB as any) - (dateA as any);
              })
              .map(artwork => (
                <Box>
                  <ArtworkCard
                    artwork={artwork}
                    saveArtwork={saveArtwork}
                    deleteArtwork={deleteArtwork}
                    inquiries={inquiries[artwork.artworkId as string]}
                  />
                </Box>
              ))}
        </Box>
      </SideNavigationWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  return {props: {data: {data: {}}}};
  // TO DO
  // need a function that gets all artworks
  // need a function that gets all inquiries for art
};
