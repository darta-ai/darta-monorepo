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
import React from 'react';

import {Artwork} from '../../../globalTypes';
import {currencyConverter} from '../../common/templates';
import {InquiryArtworkData} from '../../dummyData';
import {InquiryTable} from '../Tables/InquiryTable';
import {CreateArtwork} from './CreateArtwork';

const useStyles = {
  root: {
    minWidth: '85vw',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '20vh',
    maxWidth: '70vw',
    margin: 'auto',
    border: '1px solid darkgrey',
  },
  media: {
    minHeight: '15vh',
    '@media (min-width: 800px)': {
      minHeight: '50vh',
    },
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
    justifyContent: 'space-between',
    gap: '1vh',
    borderRadius: '0.5vw',
    m: '1vh',
    border: '1px solid #eaeaea',
    // minHeight: '50vh',
    alignItems: 'center',
    '@media (min-width: 800px)': {
      flexDirection: 'row',
      width: '85vw',
      minHeight: '15vh',
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
  croppingModalOpen,
  setCroppingModalOpen,
}: {
  artwork: Artwork;
  saveArtwork: (arg0: string, arg1: Artwork) => void;
  deleteArtwork: (arg0: string) => void;
  inquiries: InquiryArtworkData[] | null;
  croppingModalOpen?: boolean;
  setCroppingModalOpen?: (arg0: boolean) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [editArtwork, setEditArtwork] = React.useState<boolean>(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSave = (savedArtwork: Artwork) => {
    saveArtwork(savedArtwork.artworkId!, savedArtwork);
    setEditArtwork(!editArtwork);
  };

  const handleDelete = (artworkId: string) => {
    deleteArtwork(artworkId);
    return setEditArtwork(false);
  };

  const displayRed =
    !artwork?.artistName?.value ||
    !artwork?.artworkTitle?.value ||
    !artwork?.artworkImage?.value ||
    !artwork?.artworkMedium?.value ||
    !artwork?.canInquire?.value ||
    !artwork?.artworkDimensions?.widthIn.value ||
    !artwork?.artworkDimensions?.heightIn.value;

  return (
    <Card sx={useStyles.root} data-testid="artwork-card">
      <Box
        sx={{
          ...useStyles.cardContainer,
          borderColor: displayRed ? 'orange' : null,
          borderWidth: displayRed ? '0.2vh' : null,
        }}>
        <Box sx={{width: '25vw'}}>
          <CardActionArea
            onClick={handleExpandClick}
            sx={{display: 'flex', flexDirection: 'column', maxHeight: '15vh'}}
            data-testid="artwork-card-image">
            <img
              src={artwork?.artworkImage?.value as string}
              alt={artwork?.artworkTitle?.value as string}
              style={useStyles.media}
            />
          </CardActionArea>
        </Box>
        <Box
          sx={{
            alignSelf: 'center',
            width: '35vw',
            textOverflow: 'ellipsis',
            textAlign: 'start',
          }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              data-testid="artwork-card-artist-name"
              sx={{textOverflow: 'ellipsis'}}>
              {artwork?.artistName?.value}
            </Typography>
            <Typography
              data-testid="artwork-card-artwork-title"
              variant="h6"
              color="textSecondary">
              {artwork?.artworkTitle?.value}
            </Typography>
            <Typography
              paragraph
              data-testid="artwork-card-medium"
              color="textSecondary">
              Medium: {artwork?.artworkMedium?.value}
            </Typography>
          </CardContent>
        </Box>
        <CardContent sx={{alignSelf: 'center', width: '35vw'}}>
          {artwork?.artworkPrice?.value && (
            <Typography paragraph data-testid="artwork-card-price">
              Price:{' '}
              {artwork?.artworkCurrency?.value &&
                currencyConverter[artwork.artworkCurrency.value]}
              {Number(artwork?.artworkPrice?.value).toLocaleString() as string}
            </Typography>
          )}
          <Typography paragraph data-testid="artwork-card-can-inquire">
            Can Inquire: {artwork?.canInquire?.value}
          </Typography>
          <Typography data-testid="artwork-card-dimensions">
            Dimensions: {artwork?.artworkDimensions?.text?.value}
          </Typography>
        </CardContent>
      </Box>
      <Box>
        {displayRed && (
          <Typography
            data-testid="artwork-card-additional-information-warning"
            sx={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
            Additional Information Required. Please Edit.
          </Typography>
        )}
      </Box>
      <Box>
        <Button
          variant="contained"
          color={displayRed ? 'warning' : 'secondary'}
          onClick={() => setEditArtwork(!editArtwork)}
          sx={{alignSelf: 'center', m: '1vh'}}
          data-testid="artwork-card-edit-button">
          <Typography sx={{fontWeight: 'bold'}}>Edit</Typography>
        </Button>
      </Box>
      {artwork?.canInquire?.value === 'Yes' &&
        inquiries &&
        Object.values(inquiries).length > 0 && (
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
                <Typography
                  variant="h6"
                  color="textSecondary"
                  data-testid="artwork-card-inquiries-label">
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
                  artist={artwork?.artistName?.value as string}
                />
              </CardContent>
            </Collapse>
          </>
        )}
      <Collapse in={editArtwork}>
        {editArtwork ? (
          <Box>
            <CreateArtwork
              newArtwork={artwork}
              cancelAction={setEditArtwork}
              saveArtwork={handleSave}
              handleDelete={handleDelete}
              croppingModalOpen={croppingModalOpen}
              setCroppingModalOpen={setCroppingModalOpen}
            />
          </Box>
        ) : (
          <Box />
        )}
      </Collapse>
    </Card>
  );
}

ArtworkCard.defaultProps = {
  croppingModalOpen: false,
  setCroppingModalOpen: () => {},
};
