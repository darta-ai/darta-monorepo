/* eslint-disable no-underscore-dangle */
import * as Colors from '@darta-styles'
import {Artwork, Exhibition} from '@darta-types';
import Block from '@mui/icons-material/Block';
// import QrCodeIcon from '@mui/icons-material/QrCode';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import _ from 'lodash';
import React from 'react';

import {cardStyles} from '../../../styles/CardStyles';
import {
  // createAndEditArtworkForExhibition,
  createArtworkForExhibitionAPI,
  deleteExhibitionArtwork,
  editArtworkForExhibitionAPI,
  // removeArtworkFromExhibition,
  // swapArtworkOrderAPI,
} from '../../API/artworks/artworkRoutes';
import {
  deleteExhibitionAndArtworkAPI,
  editExhibitionAPI,
  publishExhibitionAPI,
  reOrderExhibitionArtworkAPI,
} from '../../API/exhibitions/exhibitionRotes';
import {ArtworkHeader} from '../Artwork';
import {DartaErrorAlert} from '../Modals';
// import { PreviewQRDialogue } from '../Modals/PreviewQRDialogue';
import {GalleryReducerActions, useAppState} from '../State/AppContext';
import {ExhibitionArtworkList} from './ExhibitionArtworkList';
import {CreateExhibition} from './index';

const ariaLabel = {'aria-label': 'description'};

export function ExhibitionCard({
  exhibition,
  galleryLocations,
  exhibitionId,
  galleryName,
  isLatestExhibition,
  higherLevelSaveExhibition,
  higherLevelSaveArtwork,
  higherLevelCreateArtwork,
  higherLevelReOrderArtwork,
  higherLevelDeleteArtwork,
  higherLevelDeleteExhibition,
  higherLevelPublishExhibition,
}: {
  exhibition: Exhibition;
  galleryLocations: string[];
  exhibitionId: string;
  galleryName: string;
  isLatestExhibition: boolean;
  higherLevelSaveExhibition?: ({ exhibition }: { exhibition: Exhibition; }) => Promise<void>;
  higherLevelSaveArtwork?: ({ artwork }: { artwork: Artwork; }) => Promise<void>;
  higherLevelCreateArtwork?: ({ exhibitionId }: { exhibitionId: string; }) => Promise<void>;
  higherLevelReOrderArtwork?: (
    { artworkId, exhibitionId, direction }: { artworkId: string; exhibitionId: string, direction: 'up' | 'down'; }) => Promise<void>;
  higherLevelDeleteArtwork?: ({ artworkId, exhibitionId }: { artworkId: string; exhibitionId: string; }) => Promise<void>;
  higherLevelDeleteExhibition?: ({ exhibitionId }: { exhibitionId: string; }) => Promise<void>;
  higherLevelPublishExhibition?: ({ exhibitionId, isPublished }: { exhibitionId: string; isPublished: boolean; }) => Promise<void>;
}) {
  const [editExhibition, setEditExhibition] = React.useState<boolean>(false);
  const [isEditingExhibition, setIsEditingExhibition] =
    React.useState<boolean>(false);
  const {state, dispatch} = useAppState();
  const [artworks, setArtworks] = React.useState<any>(exhibition.artworks);
  const [errorAlertOpen, setErrorAlertOpen] = React.useState<boolean>(false);
  // const [qrCodeOpen, setQrCodeOpen] = React.useState<boolean>(false);

  const [artworkLoading, setArtworkLoading] = React.useState<boolean>(false);
  const [isSwappingLoading, setIsSwappingLoading] =
    React.useState<boolean>(false);
  
  const [showArtworks, setShowArtwork] = React.useState<boolean>(isLatestExhibition);


  React.useEffect(() => {
    if (exhibition?.artworks) {
      setArtworks(exhibition.artworks!);
    } 
  }, []);

  const [publishSpinner, setPublishSpinner] = React.useState<boolean>(false);

  const publishExhibition = async (updatedExhibition: Exhibition, isPublished: boolean) => {
    setPublishSpinner(true);
    if (higherLevelPublishExhibition){
      await higherLevelPublishExhibition({exhibitionId, isPublished});
      setPublishSpinner(false);
      return;
    }
    try {
      const results = await publishExhibitionAPI({exhibitionId: updatedExhibition.exhibitionId!, isPublished});
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: {...results},
        exhibitionId: results.exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORK,
        payload: results.artworks as any,
      });
    } catch (error) {
      setErrorAlertOpen(true)
    } finally {
      setPublishSpinner(false);
    }
  }

  const setExhibitionStateAndDB = async (updatedExhibition: Exhibition) => {
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
    } catch (error) {
      setErrorAlertOpen(true)
    } 
  }

  const saveExhibition = async (updatedExhibition: Exhibition) => {
    setIsEditingExhibition(true);
    if (higherLevelSaveExhibition){
      await higherLevelSaveExhibition({exhibition: updatedExhibition});
    } else {
      await setExhibitionStateAndDB(updatedExhibition)
    }
    setEditExhibition(!editExhibition);
    setIsEditingExhibition(false);
  };

  const addNewArtwork = async () => {
    if (higherLevelCreateArtwork){
      await higherLevelCreateArtwork({exhibitionId});
      return;
    } 
    setArtworkLoading(true);
    const exhibitionOrder = Object?.keys(artworks)?.length;

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

  // const handleRemoveArtworkFromExhibition = async ({
  //   exhibitionId,
  //   artworkId,
  // }: {
  //   exhibitionId: string;
  //   artworkId: string;
  // }): Promise<boolean> => {
  //   try {
  //     const results = await removeArtworkFromExhibition({
  //       exhibitionId,
  //       artworkId,
  //     });
  //     dispatch({
  //       type: GalleryReducerActions.SAVE_EXHIBITION,
  //       payload: results,
  //       exhibitionId,
  //     });
  //     return Promise.resolve(true);
  //   } catch (error) {
  //     setErrorAlertOpen(true);
  //   }
  //   return Promise.resolve(false);
  // };

  const handleDeleteArtworkFromDarta = async ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<boolean> => {
    try {
      if (higherLevelDeleteArtwork){
        await higherLevelDeleteArtwork({artworkId, exhibitionId});
        return Promise.resolve(true);
      }
      const results = await deleteExhibitionArtwork({exhibitionId, artworkId});
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: results,
        exhibitionId : results.exhibitionId,
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

  // const handleBatchUpload = async (uploadArtworks: {
  //   [key: string]: Artwork;
  // }): Promise<boolean> => {
  //   const newExhibition: Exhibition = _.cloneDeep(
  //     state?.galleryExhibitions[exhibitionId],
  //   );

  //   if (!newExhibition || !newExhibition?.artworks) {
  //     Promise.resolve(false);
  //   }

  //   let counter = Object.values(newExhibition.artworks!).length;

  //   for (const artworkId in uploadArtworks) {
  //     if (uploadArtworks[artworkId]) {
  //       // eslint-disable-next-line no-param-reassign, no-multi-assign
  //       uploadArtworks[artworkId].exhibitionOrder = counter += 1;
  //       // eslint-disable-next-line no-param-reassign
  //       uploadArtworks[artworkId].exhibitionId = exhibitionId;
  //     }
  //   }

  //   const artworkPromises = Object.values(uploadArtworks).map(
  //     (artwork: Artwork) => createAndEditArtworkForExhibition({exhibitionId, artwork}),
  //   );
  //   try {
  //     const results = await Promise.all(artworkPromises);

  //     const resultsObj = results.reduce(
  //       (acc, artwork) => ({...acc, [artwork?.artworkId as string]: artwork}),
  //       {},
  //     );

  //     dispatch({
  //       type: GalleryReducerActions.SAVE_EXHIBITION_ARTWORK,
  //       exhibitionId,
  //       artwork: resultsObj,
  //     });

  //     dispatch({
  //       type: GalleryReducerActions.SET_BATCH_ARTWORK,
  //       payload: resultsObj,
  //     });
  //     return Promise.resolve(true);
  //   } catch (error) {
  //     setErrorAlertOpen(true);
  //     return Promise.resolve(false);
  //   }
  // };

  const deleteExhibition = async ({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<boolean> => {
    if (higherLevelDeleteExhibition){
      await higherLevelDeleteExhibition({exhibitionId});
      return Promise.resolve(true);
    }
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
      return Promise.resolve(false);
    }

  const swapExhibitionOrder = async ({
    artworkId,
    direction,
  }: {
    artworkId: string;
    direction: 'up' | 'down';
  }) => {
    setIsSwappingLoading(true);
    if(higherLevelReOrderArtwork){
      await higherLevelReOrderArtwork({artworkId, exhibitionId, direction});
      setIsSwappingLoading(false);
      return;
    }
    const tempArtworks = _.cloneDeep(
      exhibition?.artworks as {[key: string]: Artwork},
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
          <Box sx={cardStyles.informationContainer}>
            <Box
              component="img"
              src={exhibition?.exhibitionPrimaryImage?.value as string}
              alt={exhibition?.exhibitionTitle?.value as string}
              style={cardStyles.mediaExhibition}
            />
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
              {exhibition.exhibitionDates.exhibitionDuration && 
                exhibition.exhibitionDates.exhibitionDuration.value !== "Ongoing/Indefinite" &&
               exhibition?.exhibitionDates?.exhibitionStartDate?.value &&
                exhibition?.exhibitionDates?.exhibitionEndDate?.value ? (
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
                ): (
                  <Typography
                    data-testid="artwork-card-exhibition-dates"
                    variant="h6"
                    color="textSecondary">
                    {exhibition?.exhibitionDates?.exhibitionDuration?.value}
                  </Typography>
                )
                }
            </CardContent>
          </Box>
          <Box sx={cardStyles.informationContainer}>
            {exhibition?.exhibitionPressRelease?.value && (
              <Box
                style={{
                  width: '95%',
                  padding: '1vh',
                  height: '100%',
                }}>
                <Typography color="textSecondary" sx={{textAlign: 'center'}}>
                  Press Release
                </Typography>
                <TextField
                  hiddenLabel
                  fullWidth
                  multiline
                  rows={12}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                      fontSize: '1rem',
                      fontFamily: 'Nunito Sans',
                    },
                  }}
                  disabled
                  inputProps={ariaLabel}
                  value={exhibition?.exhibitionPressRelease?.value}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '5%',
            alignItems: 'center',
            width: '100%',
            '@media (max-width: 1080px)': {
              flexDirection: 'column',
            },
          }}>
            {/* <Button
              variant="contained"
              className="exhibition-publish-button"
              disabled={publishSpinner}
              style={{backgroundColor: Colors.PRIMARY_50}}
              onClick={() => setQrCodeOpen(true)}
              startIcon={<QrCodeIcon style={{color: Colors.PRIMARY_500}} 
              />}
              sx={{alignSelf: 'center', m: '1vh'}}>
                <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_500}}>
                    Preview
                  </Typography>
              </Button> */}
            {exhibition.published ? (
              <Button
              variant="contained"
              className="exhibition-publish-button"
              disabled={publishSpinner}
              style={{backgroundColor: Colors.PRIMARY_200}}
              onClick={() => publishExhibition({...exhibition}, false)}
              startIcon={<Block style={{color: Colors.PRIMARY_600}} />}
              sx={{alignSelf: 'center', m: '1vh'}}>
            {publishSpinner ? (
              <CircularProgress size={24} />
            ) : (
              <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_600}}>
                Remove Published
              </Typography>
            )}
            </Button>
            ) : (
              <Button
              variant="contained"
              className="exhibition-publish-button"
              disabled={publishSpinner}
              style={{backgroundColor: Colors.PRIMARY_900}}
              onClick={() => publishExhibition({...exhibition}, true)}
              endIcon={<SendIcon style={{color: Colors.PRIMARY_50}} />}
              sx={{alignSelf: 'center', m: '1vh'}}>
                {publishSpinner ? (
                  <CircularProgress size={24} />
                ) : (
                  <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>
                    Publish Exhibition
                  </Typography>
                )}
            </Button>
            )}
          <Button
            variant="contained"
            className="exhibition-edit-button"
            style={{backgroundColor: Colors.PRIMARY_700}}
            onClick={() => setEditExhibition(!editExhibition)}
            sx={{alignSelf: 'center', m: '1vh'}}>
            <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>
              Edit Exhibition
            </Typography>
          </Button>
          <Box>
          <Button
            variant="contained"
            className="exhibition-edit-button"
            style={{backgroundColor: Colors.PRIMARY_900}}
            onClick={() => setShowArtwork(!showArtworks)}
            sx={{alignSelf: 'center', m: '1vh'}}>
            <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>
              {showArtworks ? 'Hide Artwork' : 'Show Artwork'}
            </Typography>
          </Button>
        </Box>
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
                Click <a style={{color: Colors.PRIMARY_600}} href="/Galleries/Profile">here</a> to go to your
                profile page.
              </Typography>
            </Box>
          )}
        </Collapse>
        <Collapse in={showArtworks}>
        <Box>
          <Divider variant="middle" sx={{m: 2, color: Colors.PRIMARY_600}} flexItem>
            <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_600}}>
              Artwork
            </Typography>
          </Divider>
        </Box>
        {/* <Box>
          <ArtworkHeader
            artworkLoading={artworkLoading}
            addNewArtwork={addNewArtwork}
            // handleBatchUpload={handleBatchUpload}
          />
        </Box> */}
        {showArtworks && exhibition?.artworks && (
          <ExhibitionArtworkList
            artworks={exhibition?.artworks}
            isSwappingLoading={isSwappingLoading}
            swapExhibitionOrder={swapExhibitionOrder}
            saveArtwork={saveArtwork}
            saveSpinner={saveSpinner}
            deleteSpinner={deleteSpinner}
            handleDeleteArtworkFromDarta={handleDeleteArtworkFromDarta}
            higherLevelSaveArtwork={higherLevelSaveArtwork}
            exhibitionProps={exhibition}
          />
          )}

          <ArtworkHeader
            artworkLoading={artworkLoading}
            addNewArtwork={addNewArtwork}
            // handleBatchUpload={handleBatchUpload}
          />
      </Collapse>
      <DartaErrorAlert
        errorAlertOpen={errorAlertOpen}
        setErrorAlertOpen={setErrorAlertOpen}
      />
      {/* <PreviewQRDialogue 
        exhibitionId={exhibition._id!}
        galleryId={state.galleryProfile._id!}
        open={qrCodeOpen}
        handleClose={() => {setQrCodeOpen(false)}}
      /> */}
    </Card>
  );
}

ExhibitionCard.defaultProps = {
  higherLevelSaveExhibition: undefined,
  higherLevelSaveArtwork: undefined,
  higherLevelCreateArtwork: undefined,
  higherLevelReOrderArtwork: undefined,
  higherLevelDeleteArtwork: undefined,
  higherLevelDeleteExhibition: undefined,
  higherLevelPublishExhibition: undefined,
};
