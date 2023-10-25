/* eslint-disable no-underscore-dangle */
import * as Colors from '@darta-styles'
import {Artwork,  InquiryArtworkData } from '@darta-types';
import {Box, Button, Typography} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Head from 'next/head';
import React from 'react';

import {AuthContext} from '../../../pages/_app';
import {galleryStyles} from '../../../styles/GalleryPageStyles';
import {
  createArtworkAPI,
  deleteArtworkAPI,
  deleteExhibitionArtwork,
  editArtworkAPI,
  listArtworkInquiresAPI,
  removeArtworkFromExhibition,
} from '../../API/artworks/artworkRoutes';
// import authRequired from 'common/AuthRequired/AuthRequired';
import {
  artwork1,
} from '../../dummyData';
import {ArtworkCard} from '../Artwork/index';
import {DartaRadioFilter, DartaTextFilter} from '../Filters';
import {DartaErrorAlert, UploadArtworksXlsModal} from '../Modals';
import {DartaJoyride} from '../Navigation/DartaJoyride';
import {GalleryReducerActions, useAppState} from '../State/AppContext';

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
];

export function GalleryArtwork() {
  const {state, dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);

  const [displayArtworks, setDisplayArtworks] = React.useState<Artwork[]>();
  const [inquiries, setInquiries] = React.useState<{
    [key: string]: InquiryArtworkData[];
  } | null>(null);
  const [errorAlertOpen, setErrorAlertOpen] = React.useState<boolean>(false);

  const handleBatchUpload = (uploadArtworks: {[key: string]: Artwork}) => {
    dispatch({
      type: GalleryReducerActions.SAVE_NEW_ARTWORK,
      payload: {...uploadArtworks},
    });
  };

  const addNewArtwork = async () => {
    let results;
    try {
      results = await createArtworkAPI();
      if (results?.artworkId) {
        dispatch({
          type: GalleryReducerActions.SAVE_NEW_ARTWORK,
          payload: {[results.artworkId]: results},
        });
      } else {
        throw new Error('did not receive an artwork');
      }
    } catch (error: any) {
      setErrorAlertOpen(true);
    }
  };

  const saveArtwork = async ({
    updatedArtwork,
  }: {
    updatedArtwork: Artwork;
  }): Promise<boolean> => {
    try {
      const results: Artwork = await editArtworkAPI({artwork: updatedArtwork});
      if (results && results?.exhibitionId && results?.artworkId) {
        dispatch({
          type: GalleryReducerActions.SAVE_EXHIBITION_ARTWORK,
          artwork: {[results.artworkId]: updatedArtwork},
          exhibitionId: results.exhibitionId,
        });
      }
      if (results && results?.artworkId) {
        dispatch({
          type: GalleryReducerActions.SAVE_NEW_ARTWORK,
          payload: {[results.artworkId as string]: updatedArtwork},
        });
      } else {
        throw new Error('unable to edit artwork');
      }
    } catch {
      setErrorAlertOpen(true);
    }
    return Promise.resolve(true);
  };

  const deleteArtwork = async ({
    artworkId,
  }: {
    artworkId: string;
  }): Promise<boolean> => {
    try {
      const results = await deleteArtworkAPI(artworkId);
      if (results.success) {
        dispatch({type: GalleryReducerActions.DELETE_ARTWORK, artworkId});
      } else {
        throw new Error('unable to edit artwork');
      }
    } catch (error) {
      setErrorAlertOpen(true);
    }
    return Promise.resolve(false);
  };

  const handleRemoveArtworkFromExhibition = async ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<boolean> => {
    try {
      const results = await removeArtworkFromExhibition({
        exhibitionId,
        artworkId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: results,
        exhibitionId,
      });
      return Promise.resolve(true);
    } catch (error) {
      setErrorAlertOpen(true);
    }
    return Promise.resolve(false);
  };

  const handleDeleteArtworkFromDarta = async ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<boolean> => {
    try {
      const results = await deleteExhibitionArtwork({exhibitionId, artworkId});
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: results,
        exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.DELETE_ARTWORK,
        artworkId,
      });
      return Promise.resolve(true);
    } catch (error) {
      setErrorAlertOpen(true);
    }
    return Promise.resolve(false);
  };

  const [croppingModalOpen, setCroppingModalOpen] = React.useState(true);

  
  const [page, setPage] = React.useState(1);
  const [resultsPerPage] = React.useState(7)
  const [numberOfPages] = React.useState(Math.ceil(Object.values(state.galleryArtworks).length / resultsPerPage))
  
  const getArtworksByPagination = (value: number) => {
    const startIndex = (value - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = Object.values(state.galleryArtworks).slice(startIndex, endIndex);
    return paginatedResults
  };

  const handlePaginationChange = (event: any, value: number) => {
    setPage(value);
    const results = getArtworksByPagination(value)
    setDisplayArtworks(results)
  };

  const [searchString, setSearchString] = React.useState<string | undefined>();
  const [filterString, setFilterString] = React.useState<string | undefined>();

  const searchByString = (
    query: string | undefined,
   
  ): Artwork[] | unknown[] => {

    if (!query) {
      return getArtworksByPagination(page)
    }
    const currentArtworks = state.galleryArtworks;
    return Object.values(currentArtworks).filter((item: Artwork) => {
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
  };

  function filterByInquiry(query: string | unknown): any{
    let results;
    if (!inquiries) return;
    const artworksWithInquiriesIds = Object?.keys(inquiries);
    switch (query) {
      case 'All':
        results = searchByString(searchString);
        if (!results) return;
        setDisplayArtworks(results as Artwork[]);
        break;
      case 'Has Inquiries':
        results = Object.values(state.galleryArtworks)?.filter(artwork =>
          artworksWithInquiriesIds.includes(artwork._id!),
        );
        setDisplayArtworks(results);
        break;
      case 'None':
        results = Object.values(state.galleryArtworks)?.filter(
          artwork => !artworksWithInquiriesIds.includes(artwork._id!),
        );
        setDisplayArtworks(results);
        break;
      default:
        break;
    }
  };


  // Inquires
  React.useEffect(() => {
    const fetchInquires = async () => {
      const res = await listArtworkInquiresAPI()
      const inquiriesArray:InquiryArtworkData[] = Object.values(res);
      const sortedInquiries: {[key: string]: InquiryArtworkData[]} = {};
      inquiriesArray.forEach((inquiry: InquiryArtworkData) => {
        if (sortedInquiries[inquiry.artwork_id!]) {
          sortedInquiries[inquiry.artwork_id!].push(inquiry);
        } else {
          sortedInquiries[inquiry.artwork_id!] = [inquiry];
        }
      });
      setInquiries(sortedInquiries);
    }
    fetchInquires()
    const results = getArtworksByPagination(1)
    setDisplayArtworks(results)
  }, []);

  React.useEffect(() => {
    if (searchString) {
      const searchResults = searchByString(searchString);
      if (searchResults) {
        setDisplayArtworks(searchResults as Artwork[]);
      }
    } else {
      const results = getArtworksByPagination(page)
      setDisplayArtworks(results)
    }
  }, [searchString]);

  React.useEffect(() => {
    filterByInquiry(filterString);
  }, [filterString]);

  React.useEffect(() => {
    const results = getArtworksByPagination(page)
    setDisplayArtworks(results)
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
                disabled={
                  !state.galleryProfile.isValidated || !user?.emailVerified
                }
                sx={{
                  backgroundColor: Colors.PRIMARY_950,
                  color: Colors.PRIMARY_50,
                  alignSelf: 'center',
                }}>
                <Typography sx={{fontWeight: 'bold'}}>Add Artwork</Typography>
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
                {displayArtworks
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
                              inquiries[artwork?._id!] ??
                              ([] as InquiryArtworkData[])
                            }
                            handleRemoveArtworkFromExhibition={
                              handleRemoveArtworkFromExhibition
                            }
                            handleDeleteArtworkFromDarta={
                              handleDeleteArtworkFromDarta
                            }
                          />
                        </Box>
                      ))
                          }
                  
              </Box>
            )}
            {stepIndex >= 5 && run && (
              <Box>
                <ArtworkCard
                  artwork={Object.values({...artwork1})[0] as Artwork}
                  saveArtwork={() => Promise.resolve(true)}
                  deleteArtwork={() => Promise.resolve(true)}
                  croppingModalOpen={croppingModalOpen}
                  setCroppingModalOpen={setCroppingModalOpen}
                  inquiries={[] as InquiryArtworkData[]}
                  handleRemoveArtworkFromExhibition={() =>
                    Promise.resolve(true)
                  }
                  handleDeleteArtworkFromDarta={() => Promise.resolve(true)}
                />
              </Box>
            )}
          </Box>
          <Box style={{alignSelf: 'center'}}>
            {!searchString && (<Pagination count={numberOfPages} page={page} onChange={handlePaginationChange}/>)}
          </Box>
        </Box>
      </Box>
      <DartaErrorAlert
        errorAlertOpen={errorAlertOpen}
        setErrorAlertOpen={setErrorAlertOpen}
      />
    </>
  );
}
