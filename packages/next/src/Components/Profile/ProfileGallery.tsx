/* eslint-disable jsx-a11y/img-redundant-alt */
import SettingsIcon from '@mui/icons-material/Settings';
import {Box, IconButton, Typography} from '@mui/material';
import {TourProvider} from '@reactour/tour';
import Head from 'next/head';
import React from 'react';

import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../../styles';

const profileStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    gap: '5%',
    width: '80vw',
    minHeight: '100vh',
    mb: 5,
    alignSelf: 'center',
  },
  galleryHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: '5%',
    height: '40%',
    width: '95%',
  },
  galleryBioContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '0%',
  },
  galleryDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'left',
    width: '60%',
  },
  galleryLocationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: '5%',
    mt: 3,
  },
  galleryAddressContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  galleryBioStyles: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    color: PRIMARY_DARK_GREY,
  },
  divider: {
    width: '100%',
    maxWidth: 360,
    bgcolor: PRIMARY_DARK_GREY,
  },
  imageBox: {
    height: 400,
    width: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  defaultImage: {
    marginTop: '1em',
    maxWidth: '100%',
    borderWidth: 30,
  },
};

const steps = [
  {
    selector: '.edit-profile-button',
    content: 'This is my first Step',
  },
];

export function ProfileGallery({
  isEditingProfile,
  setIsEditingProfile,
}: {
  isEditingProfile: boolean;
  setIsEditingProfile: (T: boolean) => void;
}) {
  const galleryProfileData = {
    galleryName: 'Pat Kirts Gallery 2000',
    galleryPrimaryAddressLine1: 'Gallery Primary Address Line 1',
    galleryPrimaryAddressLine2: 'Gallery Primary Address Line 2',
    galleryPrimaryCity: 'New York City',
    galleryPrimaryState: 'Gallery Primary State',
    galleryPrimaryZip: 'Gallery Primary Zip',
    gallerySecondaryLocation: 'Gallery Secondary Location',
    gallerySecondaryAddressLine1: 'Gallery Secondary Address Line 1',
    gallerySecondaryAddressLine2: 'Gallery Secondary Address Line 2',
    gallerySecondaryCity: 'San Francisco',
    gallerySecondaryState: 'Gallery Secondary State',
    gallerySecondaryZip: 'Gallery Secondary Zip',
    galleryTagline:
      'Features contemporary art, painting, sculpture, video, installations, photography and editions by established and emerging American and international artists.',
    galleryBio:
      "In the fall of 1999, James Cohan Gallery opened on West 57th Street with an exhibition of early work by Gilbert and George. The gallery moved to Chelsea in 2002 with a group show including Fred Tomaselli, Phillip Taaffe and Harry Smith. James Cohan's diverse programming includes solo exhibitions of gallery artists and two thematic group exhibitions every year. James Cohan Gallery operated an additional location in Shanghai, China from 2008 through 2015. This space introduced American and European contemporary art to a Chinese audience, and also introduced a selection of Chinese artists to the gallery’s programs in New York and Shanghai. James Cohan Gallery opened a second New York location at 291 Grand Street in November 2015. Its inaugural exhibition in the Lower East Side neighborhood was a revelatory exhibition of early Robert Smithson drawings. This additional location allows the gallery to expand its ambitious programming with focused and experimental exhibitions of gallery artists. Over the past five years, the gallery has welcomed new artists Firelei Báez, Kathy Butterly, Federico Herrero, Mernet Larsen, Josiah McElheny, the Estate of Lee Mullican, The Propeller Group, Tuan Andrew Nguyen, Eamon Ore-Giron, Matthew Ritchie, Elias Sime, and Grace Weaver to its program, reinforcing its commitment to championing artists whose work, for all its rich disparity, is fundamentally grounded in rigorous engagement with physical and ideological place. Each artist in the gallery program seeks to re-imagine contemporary human experience by engaging critically with historical precedent, while negotiating identity through materiality and process",
    galleryLogo:
      'https://s3.amazonaws.com/files.collageplatform.com.prod/application/599f12405a4091c6048b4568/f1a52b7879c8792b9f00686cca0b86f1.png',
  };
  // const galleryProfileDataEmpty = {
  //   galleryName: '',
  //   galleryPrimaryAddressLine1: '',
  //   galleryPrimaryAddressLine2: '',
  //   galleryPrimaryCity: '',
  //   galleryPrimaryState: '',
  //   galleryPrimaryZip: '',
  //   gallerySecondaryLocation: '',
  //   gallerySecondaryAddressLine1: '',
  //   gallerySecondaryAddressLine2: '',
  //   gallerySecondaryCity: '',
  //   gallerySecondaryState: '',
  //   gallerySecondaryZip: '',
  //   galleryTagline: '',
  //   galleryBio: '',
  //   galleryLogo: '',
  // };

  // const galleryContainsNoData = Object.values(galleryProfileDataEmpty).filter(
  //   value => {
  //     return value !== '';
  //   },
  // );

  return (
    <>
      <Head>
        <title>Gallery | Profile</title>
        <meta name="description" content="Edit your gallery." />
      </Head>
      <TourProvider steps={steps}>
        <Box mb={2} sx={profileStyles.container}>
          <Box sx={profileStyles.galleryHeaderContainer}>
            <Box sx={profileStyles.imageBox}>
              {galleryProfileData?.galleryLogo ? (
                <img
                  src={galleryProfileData?.galleryLogo}
                  alt="upload image"
                  style={profileStyles.defaultImage}
                />
              ) : (
                <Box
                  sx={{...profileStyles.imageBox, border: '1px solid black'}}>
                  <Typography sx={{color: PRIMARY_DARK_GREY}}>
                    Upload Image To Get Started
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={profileStyles.galleryDetails}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
                  {galleryProfileData?.galleryName
                    ? galleryProfileData?.galleryName
                    : 'Edit profile to add gallery name'}
                </Typography>
                <Box sx={profileStyles.galleryBioStyles}>
                  <Typography>{galleryProfileData?.galleryTagline}</Typography>
                </Box>
              </Box>
              <Box sx={profileStyles.galleryLocationContainer}>
                <Box sx={profileStyles.galleryAddressContainer}>
                  <Typography variant="h6" sx={{color: PRIMARY_DARK_GREY}}>
                    {galleryProfileData?.galleryPrimaryCity
                      ? galleryProfileData?.galleryPrimaryCity
                      : 'Edit profile to add gallery address'}
                  </Typography>
                  {galleryProfileData?.galleryPrimaryAddressLine1 && (
                    <Typography sx={{color: PRIMARY_DARK_GREY}}>
                      {galleryProfileData?.galleryPrimaryAddressLine1}
                    </Typography>
                  )}
                  {galleryProfileData?.galleryPrimaryAddressLine2 && (
                    <Typography sx={{color: PRIMARY_DARK_GREY}}>
                      {galleryProfileData?.galleryPrimaryAddressLine2}
                    </Typography>
                  )}
                  <Typography sx={{color: PRIMARY_DARK_GREY}}>-</Typography>
                  {galleryProfileData?.galleryPrimaryState && (
                    <Typography sx={{color: PRIMARY_DARK_GREY}}>
                      {galleryProfileData?.galleryPrimaryState}
                    </Typography>
                  )}
                  {galleryProfileData?.galleryPrimaryZip && (
                    <Typography sx={{color: PRIMARY_DARK_GREY}}>
                      {galleryProfileData?.galleryPrimaryZip}
                    </Typography>
                  )}
                </Box>

                {galleryProfileData?.gallerySecondaryLocation && (
                  <Box sx={profileStyles.galleryAddressContainer}>
                    <Typography variant="h6" sx={{color: PRIMARY_DARK_GREY}}>
                      {galleryProfileData?.gallerySecondaryCity
                        ? galleryProfileData?.gallerySecondaryCity
                        : 'Edit profile to add gallery address'}
                    </Typography>
                    {galleryProfileData?.gallerySecondaryAddressLine1 && (
                      <Typography sx={{color: PRIMARY_DARK_GREY}}>
                        {galleryProfileData?.gallerySecondaryAddressLine1}
                      </Typography>
                    )}
                    {galleryProfileData?.gallerySecondaryAddressLine2 && (
                      <Typography sx={{color: PRIMARY_DARK_GREY}}>
                        {galleryProfileData?.gallerySecondaryAddressLine2}
                      </Typography>
                    )}
                    <Typography sx={{color: PRIMARY_DARK_GREY}}>-</Typography>
                    {galleryProfileData?.galleryPrimaryState && (
                      <Typography sx={{color: PRIMARY_DARK_GREY}}>
                        {galleryProfileData?.gallerySecondaryState}
                      </Typography>
                    )}
                    {galleryProfileData?.galleryPrimaryZip && (
                      <Typography sx={{color: PRIMARY_DARK_GREY}}>
                        {galleryProfileData?.gallerySecondaryZip}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              <Box sx={profileStyles.galleryBioContainer} />
            </Box>
            <Box sx={profileStyles.editButton}>
              <IconButton
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="edit-profile-button">
                <SettingsIcon sx={{color: PRIMARY_BLUE}} />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" sx={{color: PRIMARY_DARK_GREY}}>
              hey
            </Typography>
          </Box>
        </Box>
      </TourProvider>
    </>
  );
}
