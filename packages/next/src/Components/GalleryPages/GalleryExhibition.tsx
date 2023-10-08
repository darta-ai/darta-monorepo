import 'firebase/compat/auth';

import * as Colors from '@darta-styles';
import {Exhibition, GalleryState} from '@darta-types';
import {Box, Button, CircularProgress,Typography} from '@mui/material';
import Head from 'next/head';
import React from 'react';

import {AuthContext} from '../../../pages/_app';
import {galleryStyles} from '../../../styles/GalleryPageStyles';
import {createExhibitionAPI} from '../../API/exhibitions/exhibitionRotes';
import {dummyExhibition} from '../../dummyData';
import {ExhibitionCard} from '../Exhibitions/index';
import {DartaJoyride} from '../Navigation/DartaJoyride';
import {GalleryReducerActions, useAppState} from '../State/AppContext';

// need a function that gets all artworks
// need a function that gets all inquiries for art

// Joyride steps
const exhibitionSteps = [
  {
    target: '.gallery-exhibition-container',
    content: 'This is your exhibition page.',
  },
  {
    target: '.create-new-exhibition',
    content: 'Click here to create a new exhibition.',
  },
  {
    target: '.artwork-card',
    content: 'When an exhibition is created, it will appear here.',
  },
  {
    target: '.exhibition-edit-button',
    content: 'You can edit the details of the exhibition here.',
  },
  {
    target: '.create-new-artwork',
    content: 'You can add artworks to the exhibition by clicking here.',
  },
  {
    target: '.upload-new-artwork',
    content: 'Alternatively, you can batch upload by clicking here.',
  },
  {
    target: '.exhibition-artwork-list',
    content: 'The artworks in your exhibition will appear here.',
  },
  {
    target: '.exhibition-artwork-edit',
    content: 'Edit your artworks here.',
  },
  {
    target: '.edit-artwork-order',
    content: 'Change the ordering of your artworks by clicking here.',
  },
];

export const getGalleryLocations = (state: GalleryState): string[] => {
  const galleryLocations = [];

  if (!state?.galleryProfile?.galleryLocation0?.locationString?.value)
    return ['edit profile to add gallery locations'];

  if (state?.galleryProfile?.galleryLocation0?.locationString?.value) {
    galleryLocations.push(
      state?.galleryProfile?.galleryLocation0?.locationString?.value,
    );
  }
  if (state?.galleryProfile?.galleryLocation1?.locationString?.value) {
    galleryLocations.push(
      state?.galleryProfile?.galleryLocation1?.locationString?.value,
    );
  }
  if (state?.galleryProfile?.galleryLocation2?.locationString?.value) {
    galleryLocations.push(
      state?.galleryProfile?.galleryLocation2?.locationString?.value,
    );
  }
  if (state?.galleryProfile?.galleryLocation3?.locationString?.value) {
    galleryLocations.push(
      state?.galleryProfile?.galleryLocation3?.locationString?.value,
    );
  }
  if (state?.galleryProfile?.galleryLocation4?.locationString?.value) {
    galleryLocations.push(
      state?.galleryProfile?.galleryLocation4?.locationString?.value,
    );
  }

  return galleryLocations;
};

export function GalleryExhibition() {
  const {state, dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);

  const [galleryLocations, setGalleryLocations] = React.useState<string[]>([]);
  const [galleryName, setGalleryName] = React.useState<string | null>();
  React.useEffect(() => {
    setGalleryLocations(getGalleryLocations(state));

    const galName = state?.galleryProfile?.galleryName?.value;
    setGalleryName(galName);
  }, []);

  const [isLoadingExhibition, setLoadingExhibition] = React.useState<boolean>(false)

  const addNewExhibition = async () => {
    setLoadingExhibition(true)
    try {
      const results = await createExhibitionAPI();
      if (results?.exhibitionId) {
        dispatch({
          type: GalleryReducerActions.SAVE_EXHIBITION,
          payload: results,
          exhibitionId: results.exhibitionId,
        });
      } else {
        setLoadingExhibition(false)
        throw new Error();
      }
    } catch (error) {
      // TO-DO: throw error for frontend
    }
    setLoadingExhibition(false)
  };

  const [stepIndex, setStepIndex] = React.useState(0);
  const runJoyride = Object.keys(state?.galleryExhibitions).length;
  const [run, setRun] = React.useState(runJoyride === 0);

  React.useEffect(() => {
    const letTempJR = Object.keys(state?.galleryExhibitions).length;
    setRun(letTempJR === 0);
  }, [state?.galleryExhibitions]);

  return (
    <>
      <Head>
        <title>Darta | Exhibition</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <DartaJoyride
        steps={exhibitionSteps}
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
              className="gallery-exhibition-container"
              sx={galleryStyles.typographyTitle}>
              Exhibitions
            </Typography>
          </Box>
          <Box sx={galleryStyles.navigationButtonContainer}>
            <Button
              variant="contained"
              data-testid="save-button"
              className="create-new-exhibition"
              type="submit"
              onClick={() => addNewExhibition()}
              disabled={
                !state.galleryProfile.isValidated || !user?.emailVerified
              }
              sx={galleryStyles.createNewButton}>
              {isLoadingExhibition ? (
                <CircularProgress sx={{color: Colors.PRIMARY_50}} size={24} />
              ):
              (
              <Typography sx={{fontWeight: 'bold'}}>
                Create Exhibition
              </Typography>
              )
            }

            </Button>
          </Box>
        </Box>
        <Box sx={galleryStyles.pageNavigationContainer}>
          {state.galleryExhibitions &&
            Object.values(state.galleryExhibitions)
              .sort((a, b) => {
                const dateA = a?.exhibitionDates?.exhibitionEndDate?.value
                  ? new Date(a?.exhibitionDates?.exhibitionEndDate?.value)
                  : new Date(0);
                const dateB = b?.exhibitionDates?.exhibitionEndDate?.value
                  ? new Date(b?.exhibitionDates?.exhibitionEndDate?.value)
                  : new Date(0);
                return (dateB as any) - (dateA as any);
              })
              .map((exhibition: Exhibition) => (
                <Box key={exhibition?.exhibitionId} sx={{my: 2}}>
                  <ExhibitionCard
                    exhibition={exhibition}
                    galleryLocations={galleryLocations}
                    exhibitionId={exhibition?.exhibitionId}
                    galleryName={galleryName as string}
                  />
                </Box>
              ))}
          {stepIndex >= 2 && run && (
            <Box>
              <ExhibitionCard
                exhibition={dummyExhibition}
                galleryLocations={galleryLocations}
                exhibitionId="00000-00000-0000"
                galleryName={galleryName as string}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
