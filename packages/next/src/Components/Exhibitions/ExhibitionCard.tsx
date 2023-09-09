/* eslint-disable react-native/no-inline-styles */
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

import { Exhibition, Artwork } from '@darta/types';
import {PRIMARY_BLUE, PRIMARY_DARK_BLUE, PRIMARY_DARK_MILK, PRIMARY_GREY, PRIMARY_LIGHTBLUE, PRIMARY_MILK} from '../../../styles';
import {cardStyles} from '../../../styles/CardStyles';
import {ArtworkHeader} from '../Artwork';
import {ExhibitionArtworkList} from './ExhibitionArtworkList';
import {CreateExhibition} from './index';
import { createArtworkForExhibitionAPI } from '../../API/artworks/artworkRoutes';
import {GalleryReducerActions, useAppState} from '../State/AppContext';
import { editArtworkForExhibitionAPI } from '../../API/artworks/artworkRoutes';


const ariaLabel = {'aria-label': 'description'};

export function ExhibitionCard({
  exhibition,
  saveExhibition,
  galleryLocations,
  deleteExhibition,
  exhibitionId,
  galleryName,
}: {
  exhibition: Exhibition;
  saveExhibition: (arg0: string, arg1: Exhibition) => void;
  galleryLocations: string[];
  deleteExhibition: (arg0: string) => void;
  exhibitionId: string;
  galleryName: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [editExhibition, setEditExhibition] = React.useState<boolean>(false);
  const {state, dispatch} = useAppState();
  const [artworks, setArtworks] = React.useState<any>(exhibition.artworks)

  React.useEffect(() => {
    if (exhibition?.artworks){
      setArtworks(exhibition.artworks!)
    }
  }, [])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSave = (savedExhibition: Exhibition) => {
    saveExhibition(savedExhibition.exhibitionId!, savedExhibition);
    setEditExhibition(!editExhibition);
  };

  const handleDelete = (id: string) => {
    deleteExhibition(id);
  };

  const addNewArtwork = async () => {
    const newExhibition: Exhibition = _.cloneDeep(
      state?.galleryExhibitions[exhibitionId],
    );
    let exhibitionOrder
    if (!newExhibition?.artworks || !Object.keys(newExhibition?.artworks)) {
      exhibitionOrder = 0;
    } else {
      exhibitionOrder = Object.keys(newExhibition?.artworks)?.length;
    }


    try{
      const newArtwork = await createArtworkForExhibitionAPI({exhibitionId, exhibitionOrder})
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: {
          ...newExhibition, 
          artworks: {
            ...newExhibition.artworks,
            newArtwork
          }
        },
        exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORK,
        payload: {[newArtwork.artworkId] : newArtwork} as any,
      });
      
    } catch(error){
      // TO-DO: error handling
      console.log(error)
    }

  };

  const [saveSpinner, setSavedSpinner] = React.useState(false)
  const [deleteSpinner, setDeleteSpinner] = React.useState(false)


  const saveArtwork = async (updatedArtwork: Artwork): Promise<boolean> => {
    setSavedSpinner(true)
    const artworkId: string = updatedArtwork.artworkId!
    const tempExhibition = _.cloneDeep(state.galleryExhibitions[exhibitionId]);
    if (tempExhibition?.artworks && tempExhibition?.artworks[artworkId]) {
      tempExhibition.artworks[artworkId] = updatedArtwork;
    }
    try {
      const results = await editArtworkForExhibitionAPI({artwork: updatedArtwork})
      dispatch({
        type: GalleryReducerActions.SAVE_EXHIBITION,
        payload: {
          ...tempExhibition,
          artworks: {
            ...tempExhibition.artworks,
            [results.artworkId] : results
          }
        },
        exhibitionId,
      });
      dispatch({
        type: GalleryReducerActions.SAVE_NEW_ARTWORK,
        payload: {[results.artworkId as string]: results},
      });
      setSavedSpinner(false)
      return Promise.resolve(true)
    } catch(error){
      // TO-DO: error handling
      setSavedSpinner(false)
      return Promise.resolve(false)
    }

  };

  const deleteArtwork = (artworkId: string): Promise<boolean> => {
    setDeleteSpinner(true)
    const tempExhibition = _.cloneDeep(state.galleryExhibitions[exhibitionId]);

    let artwork;
    if (tempExhibition?.artworks && tempExhibition.artworks[artworkId]) {
      artwork = tempExhibition.artworks[artworkId];
    }

    if (!artwork || !tempExhibition || !tempExhibition?.artworks) {
      return Promise.resolve(false)
    }

    if (tempExhibition?.artworks && tempExhibition?.artworks[artworkId]) {
      delete tempExhibition?.artworks[artworkId];
    }

    for (const id in tempExhibition?.artworks) {
      if (
        artwork?.exhibitionOrder &&
        tempExhibition?.artworks[id] &&
        artworks[id].exhibitionOrder > artwork?.exhibitionOrder
      ) {
        tempExhibition.artworks[id]!.exhibitionOrder!--;
      }
    }

    saveExhibition(exhibitionId, tempExhibition);
    setDeleteSpinner(false)
    return Promise.resolve(true)
  };

  const swapExhibitionOrder = (artworkId: string, direction: 'up' | 'down') => {
    const tempArtworks = _.cloneDeep(artworks);
    // Get the artwork for which the arrow was clicked
    const artwork = artworks[artworkId];

    if (!artwork) return;

    // Depending on whether up or down was clicked, find the artwork to swap with
    let swapArtworkId: string | undefined;
    for (const id in artworks) {
      if (
        artworks[id].exhibitionOrder ===
        (direction === 'up'
          ? artwork.exhibitionOrder - 1
          : artwork.exhibitionOrder + 1)
      ) {
        swapArtworkId = id;
        break;
      }
    }

    // If we have found an artwork to swap with
    if (swapArtworkId) {
      // Swap the exhibitionOrder of the two artworks
      [
        tempArtworks[artworkId].exhibitionOrder,
        tempArtworks[swapArtworkId].exhibitionOrder,
      ] = [
        artworks[swapArtworkId].exhibitionOrder,
        artworks[artworkId].exhibitionOrder,
      ];
    }
    const tempExhibition = _.cloneDeep(state.galleryExhibitions[exhibitionId]);
    tempExhibition.artworks = tempArtworks;
    saveExhibition(exhibitionId, tempExhibition);
  };


  const handleBatchUpload = (uploadArtworks: {[key: string]: Artwork}) => {
    const newExhibition: Exhibition = _.cloneDeep(
      state?.galleryExhibitions[exhibitionId],
    );

    if (!newExhibition || !newExhibition?.artworks) return;

    let counter: number = Object.keys(newExhibition?.artworks).length;

    for (const artworkId in uploadArtworks) {
      if (uploadArtworks[artworkId]) {
        // eslint-disable-next-line no-param-reassign
        uploadArtworks[artworkId].exhibitionOrder = counter++;
      }
    }

    newExhibition.artworks = {
      ...newExhibition.artworks,
      ...(uploadArtworks as any),
    };

    saveExhibition(exhibitionId, newExhibition);
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
            Additional Information Required. Please Edit.
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
              <Typography
                paragraph
                data-testid="artwork-card-exhibition-location-string"
                color="textSecondary">
                {exhibition?.exhibitionLocation?.locationString?.value}
              </Typography>
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
                saveExhibition={handleSave}
                cancelAction={setEditExhibition}
                handleDelete={handleDelete}
                galleryLocations={galleryLocations}
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
          <Divider variant="middle" sx={{m: 2, color: PRIMARY_BLUE}} flexItem>
            <Typography sx={{fontWeight: 'bold', color: PRIMARY_BLUE}}>Artworks</Typography>
          </Divider>
          <ArtworkHeader
            addNewArtwork={addNewArtwork}
            handleBatchUpload={handleBatchUpload}
          />
        </Box>
        <ExhibitionArtworkList
          artworks={exhibition?.artworks}
          swapExhibitionOrder={swapExhibitionOrder}
          saveArtwork={saveArtwork}
          deleteArtwork={deleteArtwork}
          saveSpinner={saveSpinner}
          deleteSpinner={deleteSpinner}
        />
      </Box>
    </Card>
  );
}
