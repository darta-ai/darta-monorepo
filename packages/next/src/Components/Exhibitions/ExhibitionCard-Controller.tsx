/* eslint-disable react-native/no-inline-styles */
import {Artwork, Exhibition} from '@darta-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import _ from 'lodash';
import React from 'react';

import {PRIMARY_MILK} from '../../../styles';
import {PRIMARY_600} from '@darta-styles'
import {cardStyles} from '../../../styles/CardStyles';
import {
  createAndEditArtworkForExhibition,
  createArtworkForExhibitionAPI,
  deleteExhibitionArtwork,
  editArtworkForExhibitionAPI,
  removeArtworkFromExhibition,
  // swapArtworkOrderAPI,
} from '../../API/artworks/artworkRoutes';
import {
  deleteExhibitionAndArtworkAPI,
  deleteExhibitionOnlyAPI,
  editExhibitionAPI,
  reOrderExhibitionArtworkAPI,
} from '../../API/exhibitions/exhibitionRotes';
import {ArtworkHeader} from '../Artwork';
import {DartaErrorAlert} from '../Modals';
import {GalleryReducerActions, useAppState} from '../State/AppContext';
import {ExhibitionArtworkList} from './ExhibitionArtworkList';
import {CreateExhibition} from './index';

const ariaLabel = {'aria-label': 'description'};

export function ExhibitionCard({
  exhibition,
  galleryLocations,
  exhibitionId,
  galleryName,
}: {
  exhibition: Exhibition;
  galleryLocations: string[];
  exhibitionId: string;
  galleryName: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [editExhibition, setEditExhibition] = React.useState<boolean>(false);
  const [isEditingExhibition, setIsEditingExhibition] =
    React.useState<boolean>(false);
  const {state, dispatch} = useAppState();
  const [artworks, setArtworks] = React.useState<any>(exhibition.artworks);
  const [errorAlertOpen, setErrorAlertOpen] = React.useState<boolean>(false);
  const [artworkLoading, setArtworkLoading] = React.useState<boolean>(false);
  const [isSwappingLoading, setIsSwappingLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (exhibition?.artworks) {
      setArtworks(exhibition.artworks!);
    }
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const saveExhibition = async (updatedExhibition: Exhibition) => {
    setIsEditingExhibition(true);
    const exhibitionClone = _.cloneDeep(updatedExhibition);
    const exhibitionLocation =
      exhibitionClone?.exhibitionLocation?.locationString?.value;
    const locations = Object.values(state?.galleryProfile);

    let matchedValue;
    for (const [, value] of Object.entries(locations)) {
      if (
        value?.locationString?.value === exhibitionLocation ||
        value?.locationString?.value ===
          exhibitionClone?.exhibitionLocation?.locationString
      ) {
        matchedValue = value;
        break; // Exit the loop once you find a match.
      }
    }

    exhibitionClone.exhibitionLocation = {...matchedValue};

    try {
      const results = await editExhibitionAPI({
        exhibition: exhibitionClone,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: {...results, artworks: {...exhibitionClone.artworks}},
        exhibitionId: results.exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORK,
        payload: results.artworks as any,
      });
      setEditExhibition(!editExhibition);
    } catch (error) {
      setErrorAlertOpen(true);
    }
    setIsEditingExhibition(false);
  };

  const addNewArtwork = async () => {
    setArtworkLoading(true);
    const exhibitionOrder = Object?.keys(artworks).length;

    try {
      const {artwork} = await createArtworkForExhibitionAPI({
        exhibitionId,
        exhibitionOrder,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION_ARTWORK,
        artwork: {[artwork.artworkId as string]: artwork},
        exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORK,
        payload: {[artwork.artworkId as string]: artwork} as any,
      });
    } catch (error) {
      setErrorAlertOpen(true);
    }
    setArtworkLoading(false);
  };

  const [saveSpinner, setSavedSpinner] = React.useState(false);
  const [
    deleteSpinner,
    // setDeleteSpinner
  ] = React.useState(false);

  const saveArtwork = async (updatedArtwork: Artwork): Promise<boolean> => {
    setSavedSpinner(true);
    const artworkId: string = updatedArtwork.artworkId!;
    const tempExhibition = _.cloneDeep(state.galleryExhibitions[exhibitionId]);
    if (tempExhibition?.artworks && tempExhibition?.artworks[artworkId]) {
      tempExhibition.artworks[artworkId] = updatedArtwork;
    }
    try {
      const results = await editArtworkForExhibitionAPI({
        artwork: updatedArtwork,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: {
          ...tempExhibition,
          artworks: {
            ...tempExhibition.artworks,
            [results.artworkId]: results,
          },
        },
        exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORK,
        payload: {[results.artworkId as string]: results},
      });
      setSavedSpinner(false);
      return Promise.resolve(true);
    } catch (error) {
      // TO-DO: error handling
      setErrorAlertOpen(true);
      setSavedSpinner(false);
      return Promise.resolve(false);
    }
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

  const handleBatchUpload = async (uploadArtworks: {
    [key: string]: Artwork;
  }): Promise<boolean> => {
    const newExhibition: Exhibition = _.cloneDeep(
      state?.galleryExhibitions[exhibitionId],
    );

    if (!newExhibition || !newExhibition?.artworks) {
      Promise.resolve(false);
    }

    let counter = Object.values(newExhibition.artworks!).length;

    for (const artworkId in uploadArtworks) {
      if (uploadArtworks[artworkId]) {
        // eslint-disable-next-line no-param-reassign
        uploadArtworks[artworkId].exhibitionOrder = counter++;
        // eslint-disable-next-line no-param-reassign
        uploadArtworks[artworkId].exhibitionId = exhibitionId;
      }
    }

    const artworkPromises = Object.values(uploadArtworks).map(
      (artwork: Artwork) => {
        return createAndEditArtworkForExhibition({exhibitionId, artwork});
      },
    );
    try {
      const results = await Promise.all(artworkPromises);

      const resultsObj = results.reduce(
        (acc, artwork) => ({...acc, [artwork?.artworkId as string]: artwork}),
        {},
      );

      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION_ARTWORK,
        exhibitionId,
        artwork: resultsObj,
      });

      dispatch({
        type: GalleryReducerActions.SET_BATCH_ARTWORK,
        payload: resultsObj,
      });
      return Promise.resolve(true);
    } catch (error) {
      setErrorAlertOpen(true);
      return Promise.resolve(false);
    }
  };

  const deleteExhibition = async ({
    exhibitionId,
    deleteArtworks = false,
  }: {
    exhibitionId: string;
    deleteArtworks?: boolean;
  }): Promise<boolean> => {
    if (deleteArtworks) {
      try {
        await deleteExhibitionAndArtworkAPI({exhibitionId});
        dispatch({
          type: GalleryReducerActions.DELETE_EXHIBITION,
          exhibitionId,
        });
        return Promise.resolve(true);
      } catch (error) {
        setErrorAlertOpen(true);
        // TO-DO: error handling
      }
    } else {
      try {
        await deleteExhibitionOnlyAPI({exhibitionId});
        dispatch({
          type: GalleryReducerActions.DELETE_EXHIBITION,
          exhibitionId,
        });
        return Promise.resolve(true);
      } catch (error) {
        setErrorAlertOpen(true);
        // TO-DO: error handling
      }
    }
    return Promise.resolve(false);
  };

  const swapExhibitionOrder = async ({
    artworkId,
    direction,
  }: {
    artworkId: string;
    direction: 'up' | 'down';
  }) => {
    setIsSwappingLoading(true);
    const tempArtworks = _.cloneDeep(
      state.galleryExhibitions[exhibitionId].artworks,
    );
    if (!tempArtworks) return;
    if (!tempArtworks[artworkId]) return;
    const currentIndex = tempArtworks[artworkId].exhibitionOrder;

    if (currentIndex === undefined || currentIndex === null) return;

    const desiredIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (!currentIndex && currentIndex !== 0) {
      throw new Error('oops');
    }

    try {
      const results = await reOrderExhibitionArtworkAPI({
        exhibitionId,
        artworkId,
        desiredIndex,
        currentIndex,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION_ARTWORK,
        artwork: {...results},
        exhibitionId,
      });
    } catch (error) {
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION_ARTWORK,
        artwork: {...tempArtworks},
        exhibitionId,
      });
      setErrorAlertOpen(true);
    }
    setIsSwappingLoading(false);
  };

  const displayRed =
    !exhibition?.exhibitionTitle?.value ||
    !exhibition?.exhibitionPrimaryImage?.value ||
    !exhibition?.exhibitionPressRelease?.value ||
    !exhibition?.exhibitionDates?.exhibitionStartDate?.value ||
    !exhibition?.exhibitionDates?.exhibitionEndDate?.value;

  return (
    <Card
      sx={cardStyles.root}
      data-testid="exhibition-card"
      className="artwork-card">
      {displayRed ? (
        <Box
          sx={{
            ...cardStyles.cardContainer,
            borderColor: 'orange',
            borderWidth: '0.2vh',
            justifyContent: 'center',
          }}>
          <Typography
            data-testid="artwork-card-additional-information-warning"
            sx={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
            Additional Information Required.
          </Typography>
          <Typography
            data-testid="artwork-card-additional-information-warning"
            sx={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
            Please Edit Exhibition.
          </Typography>
        </Box>
      ) : (
        <Box sx={cardStyles.cardContainer}>
          <Box sx={{width: '35vw', m: 1}}>
            <Box
              onClick={handleExpandClick}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '15vh',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}
              data-testid="exhibition-card-image">
              <Box>
                <Box
                  component="img"
                  src={exhibition?.exhibitionPrimaryImage?.value as string}
                  alt={exhibition?.exhibitionTitle?.value as string}
                  style={cardStyles.mediaExhibition}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={cardStyles.informationContainer}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                sx={{fontStyle: 'italic'}}
                data-testid="artwork-card-exhibition-title">
                {exhibition?.exhibitionTitle?.value}
              </Typography>
              {exhibition.exhibitionArtist?.value && (
                <Typography variant="h6" color="textSecondary">
                  {exhibition.exhibitionArtist?.value}
                </Typography>
              )}
              <Typography
                paragraph
                data-testid="artwork-card-exhibition-location-string"
                color="textSecondary">
                {exhibition?.exhibitionLocation?.locationString?.value}
              </Typography>
              {exhibition?.exhibitionDates?.exhibitionStartDate?.value &&
                exhibition?.exhibitionDates?.exhibitionEndDate?.value && (
                  <Typography
                    data-testid="artwork-card-exhibition-dates"
                    variant="h6"
                    color="textSecondary">
                    {dayjs(
                      exhibition?.exhibitionDates?.exhibitionStartDate?.value,
                    ).format('MM/DD/YYYY')}
                    {' - '}
                    {dayjs(
                      exhibition?.exhibitionDates?.exhibitionEndDate?.value,
                    ).format('MM/DD/YYYY')}
                  </Typography>
                )}
            </CardContent>
          </Box>
          <Box sx={cardStyles.informationContainer}>
            {exhibition?.exhibitionPressRelease?.value && (
              <Box
                style={{
                  marginRight: '1vw',
                }}>
                <Typography color="textSecondary" sx={{textAlign: 'center'}}>
                  Press Release
                </Typography>
                <TextField
                  hiddenLabel
                  fullWidth
                  multiline
                  rows={6}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                      fontSize: '1rem',
                      fontFamily: 'Nunito Sans',
                    },
                  }}
                  disabled={true}
                  inputProps={ariaLabel}
                  value={exhibition?.exhibitionPressRelease?.value}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Button
            variant="contained"
            className="exhibition-edit-button"
            color={displayRed ? 'warning' : 'secondary'}
            onClick={() => setEditExhibition(!editExhibition)}
            sx={{alignSelf: 'center', m: '1vh'}}>
            <Typography sx={{fontWeight: 'bold', color: PRIMARY_MILK}}>
              Edit Exhibition
            </Typography>
          </Button>
        </Box>
        <Collapse in={editExhibition}>
          {editExhibition && galleryName && (
            <Box>
              <CreateExhibition
                newExhibition={exhibition}
                saveExhibition={saveExhibition}
                cancelAction={setEditExhibition}
                handleDelete={deleteExhibition}
                galleryLocations={galleryLocations}
                isEditingExhibition={isEditingExhibition}
                galleryName={galleryName}
              />
            </Box>
          )}
          {!galleryName && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Typography variant="h5">
                You must create a gallery profile before you can create an
                exhibition.
              </Typography>
              <Typography variant="h6">
                Click <a href="/Galleries/Profile">here</a> to go to your
                profile page.
              </Typography>
            </Box>
          )}
        </Collapse>
        <Box>
          <Divider variant="middle" sx={{m: 2, color: PRIMARY_600}} flexItem>
            <Typography sx={{fontWeight: 'bold', color: PRIMARY_600}}>
              Artworks
            </Typography>
          </Divider>
          <ArtworkHeader
            artworkLoading={artworkLoading}
            addNewArtwork={addNewArtwork}
            handleBatchUpload={handleBatchUpload}
          />
        </Box>
        {exhibition?.artworks && (
          <ExhibitionArtworkList
            artworks={exhibition?.artworks}
            isSwappingLoading={isSwappingLoading}
            swapExhibitionOrder={swapExhibitionOrder}
            saveArtwork={saveArtwork}
            saveSpinner={saveSpinner}
            deleteSpinner={deleteSpinner}
            handleRemoveArtworkFromExhibition={
              handleRemoveArtworkFromExhibition
            }
            handleDeleteArtworkFromDarta={handleDeleteArtworkFromDarta}
          />
        )}
      </Box>
      <DartaErrorAlert
        errorAlertOpen={errorAlertOpen}
        setErrorAlertOpen={setErrorAlertOpen}
      />
    </Card>
  );
}
