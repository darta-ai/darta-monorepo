import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import {Artwork} from 'darta/globalTypes';
import React, {useState} from 'react';

import {InquiryArtworkData} from '../../dummyData';
import {currencyConverter} from '../common/templates';
import {InquiryTable} from '../Tables/InquiryTable';
import {CreateArtwork} from './CreateArtwork';

const useStyles = {
  root: {
    minWidth: '80vw',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',

    margin: 'auto',
    border: '1px solid darkgrey',
  },
  media: {
    height: 200,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: '1vh',
    borderRadius: '0.5vw',
    m: '1vh',
    border: '1px solid #eaeaea',
    alignItems: 'center',
    '@media (min-width: 800px)': {
      flexDirection: 'row',
      width: '85vw',
    },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '@media (min-width: 800px)': {
      flexDirection: 'column',
    },
  },
};

export function ArtworkCard({
  artwork,
  saveArtwork,
  deleteArtwork,
  inquiries,
}: {
  artwork: Artwork;
  saveArtwork: (arg0: string, arg1: Artwork) => void;
  deleteArtwork: (arg0: string) => void;
  inquiries: InquiryArtworkData[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [editArtwork, setEditArtwork] = useState<boolean>(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSave = (savedArtwork: Artwork) => {
    saveArtwork(savedArtwork.artworkId!, savedArtwork);
    setEditArtwork(!editArtwork);
  };

  const handleDelete = (artworkId: string) => {
    return deleteArtwork(artworkId);
  };

  return (
    <Card sx={useStyles.root}>
      {editArtwork ? (
        <CreateArtwork
          newArtwork={artwork}
          cancelAction={setEditArtwork}
          saveArtwork={handleSave}
          handleDelete={handleDelete}
        />
      ) : (
        <>
          <Box sx={useStyles.cardContainer}>
            <Box>
              <CardActionArea
                onClick={handleExpandClick}
                sx={{display: 'flex', flexDirection: 'column'}}>
                <img
                  src={artwork.artworkImage.value as string}
                  alt={artwork.artworkTitle.value as string}
                  style={useStyles.media}
                />
              </CardActionArea>
            </Box>
            <Box sx={{alignSelf: 'center'}}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {artwork.artistName.value}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {artwork.artworkTitle.value}
                </Typography>
                <Typography paragraph color="textSecondary">
                  Medium: {artwork.artworkMedium.value}
                </Typography>
              </CardContent>
            </Box>
            <CardContent sx={{alignSelf: 'center'}}>
              {artwork?.artworkPrice?.value && (
                <Typography paragraph>
                  Price:{' '}
                  {artwork.artworkCurrency.value &&
                    currencyConverter[artwork.artworkCurrency.value]}
                  {
                    Number(
                      artwork?.artworkPrice?.value,
                    ).toLocaleString() as string
                  }
                </Typography>
              )}
              <Typography paragraph>
                Can Inquire: {artwork.canInquire.value}
              </Typography>
              <Typography paragraph>
                Dimensions: {artwork.artworkDimensions.text.value}
              </Typography>
            </CardContent>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setEditArtwork(!editArtwork)}
              sx={{alignSelf: 'center', m: '1vh'}}>
              <Typography>Edit</Typography>
            </Button>
          </Box>
          {artwork.canInquire.value === 'Yes' && (
            <>
              <CardActions>
                <Box
                  sx={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '80vw',
                  }}>
                  <Typography variant="h6" color="textSecondary">
                    Inquires
                  </Typography>
                  <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more">
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </CardActions>

              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <InquiryTable
                    inquiryData={inquiries}
                    artist={artwork.artistName.value as string}
                  />
                </CardContent>
              </Collapse>
            </>
          )}
        </>
      )}
    </Card>
  );
}

export default ArtworkCard;
