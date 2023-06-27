import 'firebase/compat/auth';

import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import React from 'react';

import {Exhibition} from '../../globalTypes';
import {newExhibitionShell} from '../../src/Components/common/templates';
import {ExhibitionCard} from '../../src/Components/Exhibitions/index';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {galleryStyles} from '../../styles/GalleryPageStyles';

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

  const saveExhibition = (
    exhibitionId: string,
    updatedExhibition: Exhibition,
  ) => {
    const newExhibitions: {[key: string]: Exhibition} =
      _.cloneDeep(exhibitions);
    newExhibitions[exhibitionId] = updatedExhibition;
    setNewExhibitions({...newExhibitions});
  };

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
          {exhibitions &&
            Object.values(exhibitions).map(exhibition => (
              <Box>
                <ExhibitionCard
                  exhibition={exhibition}
                  saveExhibition={saveExhibition}
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
  // try {
  //   // const aboutData = (await getGallery()) as null;
  // } catch (e) {
  //   return {props: {data: {data: {}}}};
  // }
};

// if (typeof window !== 'undefined' && !loaded.current) {
//   if (!document.querySelector('#google-maps')) {
//     loadScript(
//       `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`,
//       document.querySelector('head'),
//       'google-maps',
//     );
//   }

//   loaded.current = true;
// }

// const fetch = React.useMemo(
//   () =>
//     debounce(
//       (
//         request: {input: string},
//         callback: (results?: readonly PlaceType[]) => void,
//       ) => {
//         (autocompleteService.current as any).getPlacePredictions(
//           request,
//           callback,
//         );
//       },
//       400,
//     ),
//   [],
// );

// React.useEffect(() => {
//   let active = true;

//   if (!autocompleteService.current && (window as any).google) {
//     autocompleteService.current = new (
//       window as any
//     ).google.maps.places.AutocompleteService();
//   }
//   if (!autocompleteService.current) {
//     return undefined;
//   }

//   if (inputValue === '') {
//     setOptions(value ? [value] : []);
//     return undefined;
//   }

//   fetch({input: inputValue}, (results?: readonly PlaceType[]) => {
//     if (active) {
//       let newOptions: readonly PlaceType[] = [];

//       if (value) {
//         newOptions = [value];
//       }

//       console.log(results);
//       if (results) {
//         newOptions = [...newOptions, ...results];
//       }

//       setOptions(newOptions);
//     }
//   });

//   return () => {
//     active = false;
//   };
// }, [value, inputValue, fetch]);
