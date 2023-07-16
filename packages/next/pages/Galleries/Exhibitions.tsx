import 'firebase/compat/auth';

import {Box, Button, Divider, Typography} from '@mui/material';
import _ from 'lodash';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import React from 'react';

// import {retrieveAllGalleryData} from '../../API/DartaGETrequests';
import {Exhibition, GalleryState} from '../../globalTypes';
import {newExhibitionShell} from '../../src/common/templates';
import authRequired from '../../src/Components/AuthRequired/AuthRequired';
import {ExhibitionCard} from '../../src/Components/Exhibitions/index';
import {DartaJoyride} from '../../src/Components/Navigation/DartaJoyride';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {
  GalleryReducerActions,
  useAppState,
} from '../../src/Components/State/AppContext';
import {dummyExhibition} from '../../src/dummyData';
import {galleryStyles} from '../../styles/GalleryPageStyles';
// import {AuthContext} from '../_app';
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

function GalleryExhibitions() {
  const {state, dispatch} = useAppState();

  const [galleryLocations, setGalleryLocations] = React.useState<string[]>([]);
  const [galleryName, setGalleryName] = React.useState<string | null>();
  React.useEffect(() => {
    setGalleryLocations(getGalleryLocations(state));

    const galName = state?.galleryProfile?.galleryName?.value;
    setGalleryName(galName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewExhibition = () => {
    const newExhibition: Exhibition = _.cloneDeep(newExhibitionShell);
    newExhibition.exhibitionId = crypto.randomUUID();
    newExhibition.createdAt = new Date().toISOString();
    dispatch({
      type: GalleryReducerActions.SAVE_EXHIBITION,
      payload: newExhibition,
      exhibitionId: newExhibition.exhibitionId,
    });
  };

  const saveExhibition = (
    exhibitionId: string,
    updatedExhibition: Exhibition,
  ) => {
    const exhibition = _.cloneDeep(updatedExhibition);
    const exhibitionLocation =
      updatedExhibition?.exhibitionLocation?.exhibitionLocationString?.value;
    const locations = Object.values(state?.galleryProfile);
    const fullExhibitionLocation = locations.filter(
      (locationArrayData: any) => {
        return locationArrayData?.locationString?.value === exhibitionLocation;
      },
    )[0];

    exhibition.exhibitionLocation = fullExhibitionLocation;

    dispatch({
      type: GalleryReducerActions.SAVE_EXHIBITION,
      payload: exhibition,
      exhibitionId,
    });
    dispatch({
      type: GalleryReducerActions.SAVE_NEW_ARTWORKS,
      payload: exhibition.artworks as any,
    });
  };

  const deleteExhibition = (exhibitionId: string) => {
    dispatch({
      type: GalleryReducerActions.DELETE_EXHIBITION,
      exhibitionId,
    });
  };

  const [stepIndex, setStepIndex] = React.useState(0);
  const runJoyride = Object.keys(state?.galleryExhibitions).length;
  const [run, setRun] = React.useState(runJoyride === 0);

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
          steps={exhibitionSteps}
          run={run}
          setRun={setRun}
          stepIndex={stepIndex}
          setStepIndex={setStepIndex}
        />
        <Box sx={galleryStyles.container}>
          <Box>
            <Typography variant="h2" sx={galleryStyles.typographyTitle}>
              Exhibitions
            </Typography>
          </Box>
          <Button
            variant="contained"
            data-testid="save-button"
            className="create-new-exhibition"
            type="submit"
            onClick={() => addNewExhibition()}
            sx={galleryStyles.createNewButton}>
            Create Exhibition
          </Button>
          <Divider
            className="gallery-exhibition-container"
            variant="middle"
            style={galleryStyles.divider}
            flexItem
          />
          {state.galleryExhibitions &&
            Object.values(state.galleryExhibitions)
              .sort((a, b) => {
                const dateA = a?.createdAt
                  ? new Date(a.createdAt)
                  : new Date(0);
                const dateB = b?.createdAt
                  ? new Date(b.createdAt)
                  : new Date(0);
                return (dateB as any) - (dateA as any);
              })
              .map((exhibition: Exhibition) => (
                <Box key={exhibition.exhibitionId}>
                  <ExhibitionCard
                    exhibition={exhibition}
                    saveExhibition={saveExhibition}
                    galleryLocations={galleryLocations}
                    deleteExhibition={deleteExhibition}
                    exhibitionId={exhibition?.exhibitionId}
                    galleryName={galleryName as string}
                  />
                </Box>
              ))}
          {stepIndex >= 2 && run && (
            <Box>
              <ExhibitionCard
                exhibition={dummyExhibition}
                saveExhibition={saveExhibition}
                galleryLocations={galleryLocations}
                deleteExhibition={deleteExhibition}
                exhibitionId="00000-00000-0000"
                galleryName={galleryName as string}
              />
            </Box>
          )}
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

export default authRequired(GalleryExhibitions);
