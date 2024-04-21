import * as Colors from '@darta-styles'
import {Artwork, Exhibition} from '@darta-types';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';

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
    width: '18vw',
    fontSize: '0.8rem',
    '@media (min-width: 1280px)': {
      width: '6vw',
    },
  },
  displayComponentHideMobile: {
    width: '8vw',
    fontSize: '0.8rem',
    display: 'none',
    '@media (min-width: 1280px)': {
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
  isSwappingLoading,
  saveSpinner,
  deleteSpinner,
  exhibitionProps,
  swapExhibitionOrder,
  saveArtwork,
  handleDeleteArtworkFromDarta,
  higherLevelSaveArtwork,
}: {
  artwork: Artwork;
  arrayLength: number;
  index: number;
  saveSpinner: boolean;
  isSwappingLoading: boolean;
  deleteSpinner: boolean;
  exhibitionProps?: Exhibition | null;
  swapExhibitionOrder: ({
    artworkId,
    direction,
  }: {
    artworkId: string;
    direction: 'up' | 'down';
  }) => void;
  saveArtwork: (arg1: Artwork) => Promise<boolean>;
  handleDeleteArtworkFromDarta: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
  higherLevelSaveArtwork?: ({ artwork }: { artwork: Artwork; }) => Promise<void>;
}) {
  const [editArtwork, setEditArtwork] = React.useState<boolean>(false);

  const handleDelete = async (artworkId: string): Promise<void> => {
    await handleDeleteArtworkFromDarta({
      exhibitionId: exhibitionProps?.exhibitionId as string,
      artworkId,
    });
    setEditArtwork(false);
  }

  const handleSave = async (newArtwork: Artwork): Promise<void> => {
    if(higherLevelSaveArtwork){
      await higherLevelSaveArtwork({artwork: newArtwork})
      
    } else {
      await saveArtwork(newArtwork);
    }
    return setEditArtwork(false);
  };

  return (
    <Box style={{minWidth: "75vw"}} key={artwork?.artworkTitle?.value}>
      <ListItem>
        <Box
          sx={dartaListDisplay.toggleContainer}
          className="edit-artwork-order">
          <Box>
            <IconButton
              disabled={artwork.exhibitionOrder === 0 || isSwappingLoading}
              onClick={() =>
                swapExhibitionOrder({
                  artworkId: artwork?.artworkId as string,
                  direction: 'up',
                })
              }>
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
          <Box>
            {isSwappingLoading ? (
              <CircularProgress color="secondary" size={15} />
            ) : (
              <Typography>{Number(artwork?.exhibitionOrder) + 1}</Typography>
            )}
          </Box>
          <Box>
            <IconButton
              disabled={index === arrayLength - 1 || isSwappingLoading}
              onClick={() =>
                swapExhibitionOrder({
                  artworkId: artwork?.artworkId as string,
                  direction: 'down',
                })
              }>
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
          primary={`${
            artwork?.artworkCurrency?.value &&
            currencyConverter[artwork?.artworkCurrency?.value]
          }${
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
              backgroundColor: Colors.PRIMARY_900,
              color: Colors.PRIMARY_50,
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
            exhibitionProps={exhibitionProps}
            cancelAction={setEditArtwork}
            handleSave={handleSave}
            saveSpinner={saveSpinner}
            deleteSpinner={deleteSpinner}
            handleDelete={handleDelete}
            handleDeleteArtworkFromDarta={handleDeleteArtworkFromDarta}
          />
        </Box>
      </Collapse>
      {index !== arrayLength - 1 && !editArtwork && (
        <Divider sx={{mx: 3}} component="li" />
      )}
    </Box>
  );
}

DartaListArtwork.defaultProps = { 
  higherLevelSaveArtwork: undefined,
  exhibitionProps: null,
};

export function ExhibitionArtworkList({
  artworks,
  exhibitionProps,
  saveSpinner,
  isSwappingLoading,
  deleteSpinner,
  swapExhibitionOrder,
  saveArtwork,
  handleDeleteArtworkFromDarta,
  higherLevelSaveArtwork,
}: {
  artworks: any;
  exhibitionProps?: Exhibition | null;
  saveSpinner: boolean;
  isSwappingLoading: boolean;
  deleteSpinner: boolean;
  swapExhibitionOrder: ({
    artworkId,
    direction,
  }: {
    artworkId: string;
    direction: 'up' | 'down';
  }) => void;
  saveArtwork: (arg1: Artwork) => Promise<boolean>;
  handleDeleteArtworkFromDarta: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
  higherLevelSaveArtwork?: ({ artwork }: { artwork: Artwork; }) => Promise<void>;
}) {
  const [mappedArtworks, setMappedArtworks] = React.useState<any>(
    Object.values(artworks).sort(
      (a: any, b: any) =>
        Number(a?.exhibitionOrder) - Number(b?.exhibitionOrder),
    ),
  );
  const [arrayLength, setArrayLength] = React.useState<number>(0);

  React.useEffect(() => {
    const tempMappedArtworks = Object.values(artworks).sort(
      (a: any, b: any) =>
        Number(a?.exhibitionOrder) - Number(b?.exhibitionOrder),
    );
    setMappedArtworks(tempMappedArtworks);
    setArrayLength(tempMappedArtworks?.length);
  }, [artworks]);

  return (
    <List
      sx={{width: '100%', bgcolor: Colors.PRIMARY_50}}
      className="exhibition-artwork-list">
      {mappedArtworks?.map((artwork: Artwork, index: number) => (
        <Box key={artwork?.artworkId}>
          <DartaListArtwork
            artwork={artwork}
            arrayLength={arrayLength}
            index={index}
            exhibitionProps={exhibitionProps}
            swapExhibitionOrder={swapExhibitionOrder}
            isSwappingLoading={isSwappingLoading}
            saveArtwork={saveArtwork}
            saveSpinner={saveSpinner}
            deleteSpinner={deleteSpinner}
            handleDeleteArtworkFromDarta={handleDeleteArtworkFromDarta}
            higherLevelSaveArtwork={higherLevelSaveArtwork}
          />
        </Box>
      ))}
    </List>
  );
}

ExhibitionArtworkList.defaultProps = {
  higherLevelSaveArtwork: undefined,
  exhibitionProps: null,
};