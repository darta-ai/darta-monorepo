import 'firebase/compat/auth';

import {Container} from '@mui/material';
import Head from 'next/head';
import React from 'react';

import {IGalleryProfileData} from '../../globalTypes';
import authRequired from '../../src/Components/AuthRequired/AuthRequired';
import {DartaJoyride} from '../../src/Components/Navigation/DartaJoyride';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {EditProfileGallery, ProfileGallery} from '../../src/Components/Profile';
import {
  GalleryReducerActions,
  useAppState,
} from '../../src/Components/State/AppContext';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../styles';

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
      'Otherwise, you can add artworks to the Darta platform by clicking here.',
  },
];

const aboutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '5%',
    width: '80vw',
    minHeight: '100vh',
    mt: 5,
    alignSelf: 'center',
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

// About component
function GalleryProfile() {
  const {state, dispatch} = useAppState();
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
    !state?.galleryProfile?.galleryName?.value,
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
        <title>Darta | Gallery</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <SideNavigationWrapper>
        <DartaJoyride
          steps={profileSteps}
          run={run}
          setRun={setRun}
          stepIndex={stepIndex}
          setStepIndex={setStepIndex}
        />
        <Container sx={aboutStyles.container}>
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
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              galleryProfileData={
                {
                  ...state.galleryProfile,
                  isValidated: true,
                } as IGalleryProfileData
              }
            />
          )}
        </Container>
      </SideNavigationWrapper>
    </>
  );
}

export default authRequired(GalleryProfile);
