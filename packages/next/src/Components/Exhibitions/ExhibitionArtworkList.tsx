/* eslint-disable no-unsafe-optional-chaining */
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import * as React from 'react';

import {Artwork, Exhibition} from '../../../globalTypes';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles';
import {currencyConverter} from '../../common/templates';
import {CreateArtwork} from '../Artwork/index';
import {useAppState} from '../State/AppContext';

const dartaListDisplay = {
  toggleContainer: {
    height: '10vh',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '5vw',
  },
  displayComponentShowMobile: {
    width: '10vw',
    fontSize: '0.8rem',
    '@media (min-width: 780px)': {
      width: '6vw',
    },
  },
  displayComponentHideMobile: {
    width: '8vw',
    fontSize: '0.8rem',
    display: 'none',
    '@media (min-width: 780px)': {
      display: 'flex',
      flexDirection: 'column',
      width: '10vw',
    },
  },
};

function DartaListItem({
  artwork,
  index,
  arrayLength,
  swapExhibitionOrder,
  saveArtwork,
  deleteArtwork,
}: {
  artwork: Artwork;
  index: number;
  arrayLength: number;
  swapExhibitionOrder: (arg0: string, arg1: 'up' | 'down') => void;
  saveArtwork: (arg0: string, arg1: Artwork) => void;
  deleteArtwork: (arg0: string) => boolean;
}) {
  const artworkPrice = artwork?.artworkPrice?.value;
  const artworkCurrency = artwork?.artworkCurrency?.value;
  const [editArtwork, setEditArtwork] = React.useState<boolean>(false);
  const handleSave = (updatedArtwork: Artwork) => {
    if (!artwork.artworkId) return;
    saveArtwork(artwork?.artworkId, updatedArtwork);
    setEditArtwork(!editArtwork);
  };
  const handleDelete = (artworkId: string) => {
    if (!artworkId) return;
    const results = deleteArtwork(artworkId);
    if (results) {
      setEditArtwork(!editArtwork);
    }
  };

  return (
    <Box key={artwork?.artworkTitle?.value}>
      <ListItem>
        <Box
          sx={dartaListDisplay.toggleContainer}
          className="edit-artwork-order">
          <Box>
            <IconButton
              disabled={index === 0}
              onClick={() => swapExhibitionOrder(artwork?.artworkId, 'up')}>
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
          <Box>
            <Typography>{Number(artwork?.exhibitionOrder) + 1}</Typography>
          </Box>
          <Box>
            <IconButton
              disabled={index === arrayLength - 1}
              onClick={() => swapExhibitionOrder(artwork?.artworkId, 'down')}>
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
        </Box>

        <ListItemAvatar sx={dartaListDisplay.displayComponentShowMobile}>
          <Avatar
            variant="square"
            alt={`${artwork?.artistName?.value}`}
            src={`${artwork?.artworkImage?.value}`}
          />
        </ListItemAvatar>
        <ListItemText
          sx={dartaListDisplay.displayComponentShowMobile}
          primary={`${artwork?.artworkTitle?.value}`}
          secondary={
            <Typography
              sx={{display: 'inline'}}
              component="span"
              variant="body2"
              color="text.primary">
              {`${artwork?.artistName?.value}`}
            </Typography>
          }
        />

        <ListItemText
          sx={dartaListDisplay.displayComponentHideMobile}
          primary={artwork?.artworkMedium?.value}
          secondary={
            <Typography
              sx={{display: 'inline'}}
              component="span"
              variant="body2"
              color="text.primary">
              {artwork?.artworkDimensions?.text?.value}
            </Typography>
          }
        />
        <ListItemText
          sx={dartaListDisplay.displayComponentHideMobile}
          primary={`${artworkCurrency && currencyConverter[artworkCurrency]}${
            artworkPrice
              ? Number(artwork?.artworkPrice?.value).toLocaleString()
              : '-'
          }`}
          secondary={
            <Typography
              sx={{display: 'inline'}}
              component="span"
              variant="body2"
              color="text.primary">
              {`Can Inquire: ${artwork?.canInquire?.value}`}
            </Typography>
          }
        />
        <Box sx={dartaListDisplay.displayComponentShowMobile}>
          <Button
            sx={{
              backgroundColor: PRIMARY_BLUE,
              color: PRIMARY_MILK,
              alignSelf: 'center',
            }}
            className="exhibition-artwork-edit"
            onClick={() => setEditArtwork(!editArtwork)}
            color="secondary"
            variant="contained">
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '0.8rem',
                '@media (min-width: 780px)': {
                  fontSize: '0.8rem',
                },
              }}>
              Edit
            </Typography>
          </Button>
        </Box>
      </ListItem>
      <Collapse in={editArtwork}>
        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CreateArtwork
            newArtwork={artwork}
            cancelAction={setEditArtwork}
            saveArtwork={handleSave}
            handleDelete={handleDelete}
          />
        </Box>
      </Collapse>
      {index !== arrayLength - 1 && !editArtwork && (
        <Divider sx={{mx: 3}} component="li" />
      )}
    </Box>
  );
}

export function ExhibitionArtworkList({
  artworks,
  saveExhibition,
  exhibitionId,
}: {
  artworks: any;
  saveExhibition: (arg0: string, arg1: Exhibition) => void;
  exhibitionId: string;
}) {
  const {state} = useAppState();

  const mappedArtworks = Object.values(artworks).sort(
    (a: any, b: any) => a?.exhibitionOrder - b?.exhibitionOrder,
  );

  const saveArtwork = (artworkId: string, updatedArtwork: Artwork) => {
    const tempExhibition = _.cloneDeep(state.galleryExhibitions[exhibitionId]);
    if (tempExhibition?.artworks && tempExhibition?.artworks[artworkId]) {
      tempExhibition.artworks[artworkId] = updatedArtwork;
    }
    saveExhibition(exhibitionId, tempExhibition);
  };

  const deleteArtwork = (artworkId: string) => {
    const tempExhibition = _.cloneDeep(state.galleryExhibitions[exhibitionId]);

    let artwork;
    if (tempExhibition?.artworks && tempExhibition?.artworks[artworkId]) {
      artwork = tempExhibition?.artworks[artworkId];
    }

    if (!artwork || !tempExhibition || tempExhibition?.artworks) return false;

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
    return true;
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

  return (
    <List
      sx={{width: '100%', bgcolor: PRIMARY_MILK}}
      className="exhibition-artwork-list">
      {mappedArtworks.map((artwork: any, index: number) => (
        <DartaListItem
          artwork={artwork}
          index={index}
          arrayLength={mappedArtworks?.length}
          swapExhibitionOrder={swapExhibitionOrder}
          saveArtwork={saveArtwork}
          deleteArtwork={deleteArtwork}
        />
      ))}
    </List>
  );
}
