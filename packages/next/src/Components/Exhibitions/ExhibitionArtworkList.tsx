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
import React from 'react';

import {Artwork} from '@darta/types';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles';
import {currencyConverter} from '../../common/templates';
import {CreateArtwork} from '../Artwork/index';


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
    width: '12vw',
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

function DartaListArtwork({
  artwork,
  arrayLength,
  index,
  saveSpinner,
  deleteSpinner,
  swapExhibitionOrder,
  saveArtwork,
  deleteArtwork,
} : {
  artwork: Artwork;
  arrayLength: number;
  index: number;
  saveSpinner: boolean;
  deleteSpinner: boolean;
  swapExhibitionOrder: (arg0: string, arg1: 'up' | 'down') => void;
  saveArtwork: (arg1: Artwork) => Promise<boolean>;
  deleteArtwork: (arg0: string) => Promise<boolean>;
}){

  const [editArtwork, setEditArtwork] = React.useState<boolean>(false);

  const handleSave = async (newArtwork: Artwork) => {
    await saveArtwork(newArtwork)
    setEditArtwork(false)
  }

  const handleDelete = async (artworkId: string) => {
    if(artwork.artworkId){
      await deleteArtwork(artworkId)
    }
    setEditArtwork(!editArtwork)
  }

  return (
    <Box key={artwork?.artworkTitle?.value}>
    <ListItem>
      <Box
        sx={dartaListDisplay.toggleContainer}
        className="edit-artwork-order">
        <Box>
          <IconButton
            disabled={index === 0}
            onClick={() => swapExhibitionOrder(artwork?.artworkId as string, 'up')}>
            <ArrowDropUpIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography>{Number(artwork?.exhibitionOrder) + 1}</Typography>
        </Box>
        <Box>
          <IconButton
            disabled={index === arrayLength - 1}
            onClick={() => swapExhibitionOrder(artwork?.artworkId as string, 'down')}>
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
        primary={`${artwork?.artworkCurrency?.value && currencyConverter[artwork?.artworkCurrency?.value]}${
          artwork?.artworkPrice?.value
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
          handleSave={handleSave}
          handleDelete={handleDelete}
          saveSpinner={saveSpinner}
          deleteSpinner={deleteSpinner}
          isExhibition={true}
        />
      </Box>
    </Collapse>
    {index !== arrayLength - 1 && !editArtwork && (
      <Divider sx={{mx: 3}} component="li" />
    )}
  </Box>
  )

}

export function ExhibitionArtworkList({
  artworks,
  saveSpinner,
  deleteSpinner,
  swapExhibitionOrder,
  saveArtwork,
  deleteArtwork,
}: {
  artworks: any;
  saveSpinner: boolean;
  deleteSpinner: boolean;
  swapExhibitionOrder: (arg0: string, arg1: 'up' | 'down') => void;
  saveArtwork: (arg1: Artwork) => Promise<boolean>;
  deleteArtwork: (arg0: string) => Promise<boolean>;
}) {


  const [mappedArtworks, setMappedArtworks] = React.useState<any>(Object.values(artworks).sort(
    (a: any, b: any) => a?.exhibitionOrder - b?.exhibitionOrder,
  ))
  const [arrayLength, setArrayLength] = React.useState<number>(0)

  React.useEffect(() => {
    const tempMappedArtworks = Object.values(artworks).sort(
      (a: any, b: any) => a?.exhibitionOrder - b?.exhibitionOrder,
    );
    setMappedArtworks(tempMappedArtworks)
    setArrayLength(tempMappedArtworks.length)
  }, [artworks])

  return (
    <List
      sx={{width: '100%', bgcolor: PRIMARY_MILK}}
      className="exhibition-artwork-list">
      {mappedArtworks.map((artwork: any, index: number) => (
        <DartaListArtwork 
        artwork={artwork}
        arrayLength={arrayLength}
        index={index}
        swapExhibitionOrder={swapExhibitionOrder}
        saveArtwork={saveArtwork}
        deleteArtwork={deleteArtwork}
        saveSpinner={saveSpinner}
        deleteSpinner={deleteSpinner}
        />
      ))}
    </List>
  );
}
