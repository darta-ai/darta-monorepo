import * as Colors from '@darta-styles';
import {Artwork,InquiryArtworkData} from '@darta-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';

import {cardStyles} from '../../../styles/CardStyles';
import {currencyConverter} from '../../common/templates';
import { DartaDialogue } from '../Modals';
import {useAppState} from '../State/AppContext';
import {InquiryTable} from '../Tables/InquiryTable';
import {CreateArtwork} from './CreateArtwork';

export function ArtworkCard({
  artwork,
  saveArtwork,
  deleteArtwork,
  inquiries,
  croppingModalOpen,
  setCroppingModalOpen,
  handleDeleteArtworkFromDarta,
}: {
  artwork: Artwork;
  saveArtwork: ({
    updatedArtwork,
  }: {
    updatedArtwork: Artwork;
  }) => Promise<boolean>;
  deleteArtwork: ({artworkId}: {artworkId: string}) => Promise<boolean>;
  inquiries: InquiryArtworkData[] | null;
  croppingModalOpen?: boolean;
  setCroppingModalOpen?: (arg0: boolean) => void;
  handleDeleteArtworkFromDarta: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
}) {
  const {state} = useAppState();
  const [expanded, setExpanded] = React.useState(false);
  const [editArtwork, setEditArtwork] = React.useState<boolean>(false);

  const [saveSpinner, setSaveSpinner] = React.useState(false);
  const [deleteSpinner, setDeleteSpinner] = React.useState(false);

  let exhibition;
  if (
    artwork?.exhibitionId &&
    state.galleryExhibitions[artwork?.exhibitionId]?.exhibitionTitle?.value
  ) {
    const {exhibitionId} = artwork;
    exhibition = state.galleryExhibitions[exhibitionId].exhibitionTitle.value;
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleSave = async (savedArtwork: Artwork) => {
    setSaveSpinner(true);
    try {
      await saveArtwork({updatedArtwork: savedArtwork});
    } catch (error) {
      return
    }
    setSaveSpinner(false);
    setEditArtwork(!editArtwork);
  };

  const handleDelete = async (artworkId: string) => {
    setDeleteSpinner(true);

    try {
      await deleteArtwork({artworkId});
    } catch (error) {
      return
    } finally {
      setDeleteSpinner(false);
      setEditArtwork(false);
    }
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
    <Card
      sx={cardStyles.root}
      data-testid="artwork-card"
      className="artwork-card">
      {displayRed ? (
        <Box
          sx={{...cardStyles.cardContainer, mx: 'auto', width: '100%', p: 1}}
        >
          <Typography
            data-testid="artwork-card-additional-information-warning"
            sx={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
            Additional Information Required. Please Edit Artwork.
          </Typography>
        </Box>
      ) : (
        <Box sx={cardStyles.cardContainer}>
            <Box
              onClick={handleExpandClick}
              sx={cardStyles.informationContainer}
              data-testid="artwork-card-image">
              <Box
                component="img"
                src={artwork?.artworkImage?.value as string}
                alt={artwork?.artworkTitle?.value as string}
                style={cardStyles.artworkMedia}
              />
            </Box>

          <Box sx={cardStyles.informationContainer}>
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
              {exhibition && (
                <Typography
                  paragraph
                  data-testid="artwork-card-medium"
                  color="textSecondary"
                  sx={{fontWeight: 'bold'}}>
                  Exhibition: {exhibition}
                </Typography>
              )}
            </CardContent>
          </Box>

          <Box sx={cardStyles.informationContainer}>
            <CardContent sx={{alignSelf: 'center'}}>
              {artwork?.artworkPrice?.value && (
                <Typography paragraph data-testid="artwork-card-price">
                  Price:{' '}
                  {artwork?.artworkCurrency?.value &&
                    currencyConverter[artwork.artworkCurrency.value]}
                  {
                    Number(
                      artwork?.artworkPrice?.value,
                    ).toLocaleString() as string
                  }
                </Typography>
              )}
              {artwork?.canInquire?.value && (
                <Typography paragraph data-testid="artwork-card-can-inquire">
                  Can Inquire: {artwork?.canInquire?.value}
                </Typography>
              )}
              {artwork?.canInquire?.value && (
                <Typography data-testid="artwork-card-dimensions">
                  Dimensions: {artwork?.artworkDimensions?.text?.value}
                </Typography>
              )}
            </CardContent>
          </Box>
        </Box>
      )}
      <Box>
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            data-testid="artwork-card-description">
            {`Likes: ${artwork?.likes || 0} Dislikes: ${artwork?.dislikes || 0} Views: ${artwork?.views || 0}`}
          </Typography>
        </CardContent>
      </Box>
      <Box>
      <Button
          variant="contained"
          onClick={() => handleClickOpen()}
          sx={{alignSelf: 'center', m: '1vh', backgroundColor: Colors.PRIMARY_100}}
          className="artwork-card-edit"
          data-testid="artwork-card-edit-button">
          <Typography sx={{fontWeight: 'bold'}}>Delete</Typography>
        </Button>
        <Button
          variant="contained"
          onClick={() => setEditArtwork(!editArtwork)}
          sx={{alignSelf: 'center', m: '1vh', backgroundColor: Colors.PRIMARY_800}}
          className="artwork-card-edit"
          data-testid="artwork-card-edit-button">
          <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>Edit</Typography>
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
              croppingModalOpen={croppingModalOpen}
              setCroppingModalOpen={setCroppingModalOpen}
              saveSpinner={saveSpinner}
              deleteSpinner={deleteSpinner}
              handleDeleteArtworkFromDarta={handleDeleteArtworkFromDarta}
            />
          </Box>
        ) : (
          <Box />
        )}
      </Collapse>
        <DartaDialogue
          identifier={artwork?.artworkTitle?.value || 'this artwork'}
          deleteType="this artwork"
          id={artwork?.artworkId as string}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
    </Card>
  );
}

ArtworkCard.defaultProps = {
  croppingModalOpen: false,
  setCroppingModalOpen: () => {},
};
