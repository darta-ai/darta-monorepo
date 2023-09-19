import 'firebase/compat/auth';

import {IGalleryProfileData} from '@darta/types';
import {Box, Button, Typography} from '@mui/material';
import Head from 'next/head';
import React from 'react';

import {AuthContext} from '../../../pages/_app';
import {galleryStyles} from '../../../styles/GalleryPageStyles';
import {DartaJoyride} from '../Navigation/DartaJoyride';
import {EditProfileGallery, ProfileGallery} from '../Profile';
import {GalleryReducerActions, useAppState} from '../State/AppContext';

// Reactour steps
const profileSteps = [
  {
    target: '.profile-gallery-container',
    content: 'This is your profile for your gallery.',
  },
  {
    target: '.edit-profile-button',
    content:
      'Click Edit to add your gallery name, locations, and contact information.',
  },
  {
    target: '.gallery-navigation-exhibitions',
    content:
      "When you're ready, you can create and edit your exhibitions here.",
  },
  {
    target: '.gallery-navigation-artwork',
    content:
      'Otherwise, you can add, track, and manage artwork on the Darta platform by clicking here.',
  },
];

// About component
export function GalleryProfile() {
  const {state, dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);
  const [isEditingProfile, setIsEditingProfile] =
    React.useState<boolean>(false);

  const setGalleryProfileData = (galleryProfileData: IGalleryProfileData) => {
    dispatch({
      type: GalleryReducerActions.SET_PROFILE,
      payload: galleryProfileData,
    });
  };

  const [stepIndex, setStepIndex] = React.useState(0);
  const [run, setRun] = React.useState(
    !state?.galleryProfile?.galleryBio?.value,
  );

  React.useEffect(() => {
    if (!state?.galleryProfile?.galleryName?.value && isEditingProfile) {
      setRun(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingProfile]);
  return (
    <>
      <Head>
        <title>Darta | Profile</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <DartaJoyride
        steps={profileSteps}
        run={run}
        setRun={setRun}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
      />
      <Box sx={galleryStyles.container}>
        <Box sx={galleryStyles.navigationHeader}>
          <Box sx={{alignItems: 'flex-start'}}>
            <Typography
              variant="h2"
              sx={galleryStyles.typographyTitle}
              className="profile-gallery-container">
              Profile
            </Typography>
          </Box>
          <Box sx={galleryStyles.navigationButtonContainer}>
            <Button
              variant="contained"
              data-testid="edit-profile-button"
              className="edit-profile-button"
              type="submit"
              disabled={
                !state?.galleryProfile?.isValidated || !user?.emailVerified
              }
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              sx={galleryStyles.createNewButton}>
              <Typography sx={{fontWeight: 'bold'}}>Edit Profile</Typography>
            </Button>
          </Box>
        </Box>

        <Box sx={galleryStyles.pageNavigationContainer}>
          {isEditingProfile ? (
            <EditProfileGallery
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              setGalleryProfileData={setGalleryProfileData}
              galleryProfileData={
                {
                  ...state.galleryProfile,
                  isValidated: true,
                } as IGalleryProfileData
              }
            />
          ) : (
            <ProfileGallery
              galleryProfileData={
                {
                  ...state.galleryProfile,
                } as IGalleryProfileData
              }
            />
          )}
        </Box>
      </Box>
    </>
  );
}
