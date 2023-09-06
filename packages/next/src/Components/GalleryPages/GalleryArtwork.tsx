import 'firebase/compat/auth';

import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';
import React from 'react';

import {Artwork} from '@darta/types';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles';
import {galleryStyles} from '../../../styles/GalleryPageStyles';
// import authRequired from 'common/AuthRequired/AuthRequired';
import {newArtworkShell} from '../../common/templates';
import {
  artwork1,
  galleryInquiriesDummyData,
  InquiryArtworkData,
} from '../../dummyData';
import {ArtworkCard} from '../Artwork/index';
import {DartaRadioFilter, DartaTextFilter} from '../Filters';
import {UploadArtworksXlsModal} from '../Modals';
import {DartaJoyride} from '../Navigation/DartaJoyride';
import {GalleryReducerActions, useAppState} from '../State/AppContext';
import { createArtwork, deleteArtworkAPI } from '../../API/artworks/artworkRoutes';

// Reactour steps
const artworkSteps = [
  {
    target: '.gallery-artwork-container',
    content: 'This is your artwork page.',
  },
  {
    target: '.create-new-artwork',
    content: 'Click here to create a new artwork.',
  },
  {
    target: '.upload-new-artwork',
    content:
      'Alternatively, you can batch upload artwork from an excel. Please read the instructions carefully.',
  },
  {
    target: '.search-artworks',
    content:
      'You can search for individual artworks by artist or artwork name.',
  },
  {
    target: '.search-has-inquiries',
    content:
      'When an artwork has inquiries from users, you will be able to filter by artworks that have inquiries.',
  },
  {
    target: '.artwork-card',
    content: 'When an artwork is created, it will appear here.',
  },
  {
    target: '.artwork-card-edit',
    content: 'You can edit the details of the artwork here.',
  },
];

export function GalleryArtwork() {
  const {state, dispatch} = useAppState();

  const [displayArtworks, setDisplayArtworks] = React.useState<Artwork[]>();
  const [inquiries, setInquiries] = React.useState<{
    [key: string]: InquiryArtworkData[];
  } | null>(null);

  console.log({state})

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

  const handleBatchUpload = (uploadArtworks: {[key: string]: Artwork}) => {
    dispatch({
      type: GalleryReducerActions.SAVE_NEW_ARTWORKS,
      payload: {...uploadArtworks},
    });
  };

  const addNewArtwork = async () => {
    const newArtwork: Artwork = _.cloneDeep(newArtworkShell);
    newArtwork.artworkId = crypto.randomUUID();
    newArtwork.updatedAt = new Date().toISOString();
    newArtwork.createdAt = new Date().toISOString();
    let results;
    try{
      results = await createArtwork(newArtwork)
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORKS,
        payload: {[newArtwork.artworkId]: results},
      });
    } catch (error: any){
      //TO-DO: error handling modal
      console.log(error)
    }
  };

  const saveArtwork = (artworkId: string, updatedArtwork: Artwork) => {
    dispatch({
      type: GalleryReducerActions.SAVE_NEW_ARTWORKS,
      payload: {[artworkId]: updatedArtwork},
    });
  };

  const deleteArtwork = async (artworkId: string) => {
    try{
      const results = await deleteArtworkAPI(artworkId)
      console.log(results)
      if (results.success){
        dispatch({type: GalleryReducerActions.DELETE_ARTWORKS, artworkId});
      }
    } catch(error){
      console.log(error)
    }
  };

  const [croppingModalOpen, setCroppingModalOpen] = React.useState(true);

  const [searchString, setSearchString] = React.useState<string | undefined>();
  const [filterString, setFilterString] = React.useState<string | undefined>();
  const [
    isSortedAscending,
    // setIsSortedAscending
  ] = React.useState<boolean>(true);

  const searchByString = (
    query: string | undefined,
    currentArtworks = state.galleryArtworks,
  ): Artwork[] | unknown[] => {
    if (!query) return Object.values(currentArtworks);
    let results = Object.values(currentArtworks);
    if (displayArtworks) {
      results = Object.values(displayArtworks).filter((item: Artwork) => {
        const {artistName, artworkTitle} = item;
        const medium = item?.artworkMedium;
        const lowercaseQuery = query.toLowerCase();
        const lowercaseMedium = medium?.value?.toLowerCase();
        const lowercaseArtistName = artistName?.value?.toLowerCase();
        const lowercaseArtworkTitle = artworkTitle?.value?.toLowerCase();

        return (
          lowercaseMedium?.includes(lowercaseQuery) ||
          lowercaseArtistName?.includes(lowercaseQuery) ||
          lowercaseArtworkTitle?.includes(lowercaseQuery)
        );
      });
    }

    return results;
  };

  const filterByInquiry = (query: string | unknown): void => {
    let results;
    if (!inquiries) return;
    const artworksWithInquiriesIds = Object?.keys(inquiries);
    switch (query) {
      case 'All':
        results = searchByString(searchString);
        if (!results) return;
        return setDisplayArtworks(results as Artwork[]);
      case 'Has Inquiries':
        results = Object.values(state.galleryArtworks)?.filter(artwork =>
          artworksWithInquiriesIds.includes(artwork.artworkId!),
        );
        return setDisplayArtworks(results);
      case 'None':
        results = Object.values(state.galleryArtworks)?.filter(
          artwork => !artworksWithInquiriesIds.includes(artwork.artworkId!),
        );
        return setDisplayArtworks(results);
      default:
    }
  };

  React.useEffect(() => {
    if (searchString) {
      const searchResults = searchByString(searchString);
      if (searchResults) {
        setDisplayArtworks(searchResults as Artwork[]);
      }
    } else {
      setDisplayArtworks(Object?.values(state.galleryArtworks));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  React.useEffect(() => {
    filterByInquiry(filterString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);

  React.useEffect(() => {
    setDisplayArtworks(Object?.values(state.galleryArtworks));
  }, [state.galleryArtworks]);

  const toolTips = {
    filterBy: "Filter by the status of the artwork's inquiries.",
    searchBy: "Search by the artwork's title, artist, or medium.",
  };

  const [stepIndex, setStepIndex] = React.useState(0);
  const runJoyride = Object.keys(state?.galleryArtworks).length;
  const [run, setRun] = React.useState(runJoyride === 0);

  React.useEffect(() => {
    const letTempJR = Object.keys(state?.galleryArtworks).length;
    setRun(letTempJR === 0);
  }, [state?.galleryArtworks]);

  return (
    <>
      <Head>
        <title>Darta | Artwork</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <DartaJoyride
        steps={artworkSteps}
        run={run}
        setRun={setRun}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
      />
      <Box sx={galleryStyles.container}>
        <Box sx={galleryStyles.artworkDisplayValues}>
          <Box sx={galleryStyles.navigationHeader}>
            <Box sx={{alignItems: 'flex-start'}}>
              <Typography
                className="gallery-artwork-container"
                variant="h2"
                sx={galleryStyles.typographyTitle}>
                Artwork
              </Typography>
            </Box>
            <Box sx={galleryStyles.navigationButtonContainer}>
              <Button
                variant="contained"
                data-testid="create-new-artwork-button"
                type="submit"
                onClick={() => addNewArtwork()}
                className="create-new-artwork"
                sx={{
                  backgroundColor: PRIMARY_BLUE,
                  color: PRIMARY_MILK,
                  alignSelf: 'center',
                }}>
                Create Artwork
              </Button>
              <UploadArtworksXlsModal handleBatchUpload={handleBatchUpload} />
            </Box>
          </Box>
          <Box sx={galleryStyles.pageNavigationContainer}>
            <Box sx={galleryStyles.filterContainer}>
              <Box className="search-artworks">
                <DartaTextFilter
                  toolTips={toolTips}
                  fieldName="searchBy"
                  value={searchString}
                  handleInputChange={setSearchString}
                />
              </Box>
              <Box className="search-has-inquiries">
                <DartaRadioFilter
                  toolTips={toolTips}
                  fieldName="filterBy"
                  options={['All', 'Has Inquiries', 'None']}
                  defaultValue="All"
                  handleRadioFilter={setFilterString}
                />
              </Box>
            </Box>

            {inquiries && displayArtworks && (
              <Box sx={{display: 'flex', gap: '1vh', flexDirection: 'column'}}>
                {isSortedAscending
                  ? displayArtworks
                      ?.sort((a, b) => {
                        const dateA = a?.createdAt
                          ? new Date(a.createdAt)
                          : new Date(0);
                        const dateB = b?.createdAt
                          ? new Date(b.createdAt)
                          : new Date(0);
                        return (dateB as any) - (dateA as any);
                      })
                      .map(artwork => (
                        <Box key={artwork.artworkId}>
                          <ArtworkCard
                            artwork={artwork as Artwork}
                            saveArtwork={saveArtwork}
                            deleteArtwork={deleteArtwork}
                            croppingModalOpen={croppingModalOpen}
                            setCroppingModalOpen={setCroppingModalOpen}
                            inquiries={
                              inquiries[artwork?.artworkId!] ??
                              ([] as InquiryArtworkData[])
                            }
                          />
                        </Box>
                      ))
                  : displayArtworks
                      ?.sort((a, b) => {
                        const dateA = a?.createdAt
                          ? new Date(a.createdAt)
                          : new Date(0);
                        const dateB = b?.createdAt
                          ? new Date(b.createdAt)
                          : new Date(0);
                        return (dateA as any) - (dateB as any);
                      })
                      .map(artwork => (
                        <Box>
                          <ArtworkCard
                            artwork={artwork as Artwork}
                            saveArtwork={saveArtwork}
                            deleteArtwork={deleteArtwork}
                            croppingModalOpen={croppingModalOpen}
                            setCroppingModalOpen={setCroppingModalOpen}
                            inquiries={
                              inquiries[artwork?.artworkId!] ??
                              ([] as InquiryArtworkData[])
                            }
                          />
                        </Box>
                      ))}
              </Box>
            )}
            {stepIndex >= 5 && run && (
              <Box>
                <ArtworkCard
                  artwork={Object.values({...artwork1})[0] as Artwork}
                  saveArtwork={saveArtwork}
                  deleteArtwork={deleteArtwork}
                  croppingModalOpen={croppingModalOpen}
                  setCroppingModalOpen={setCroppingModalOpen}
                  inquiries={[] as InquiryArtworkData[]}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
