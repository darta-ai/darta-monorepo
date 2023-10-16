import { PRIMARY_50, PRIMARY_400, PRIMARY_800 } from '@darta-styles';
import {Box, LinearProgress, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export function ConfirmDeleteExhibitionArtwork({
  artworkId,
  exhibitionId,
  open,
  handleClose,
  handleDeleteArtworkFromDarta,
  handleRemoveArtworkFromExhibition,
}: {
  artworkId: string;
  exhibitionId: string;
  open: boolean;
  handleClose: () => void;
  handleDeleteArtworkFromDarta: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
  handleRemoveArtworkFromExhibition: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
}) {
  const [isSpinner, setSpinner] = React.useState<boolean>(false);

  const handleDelete = async () => {
    setSpinner(true);
    await handleDeleteArtworkFromDarta({exhibitionId, artworkId});
    setSpinner(false);
    handleClose();
  };

  const handleRemove = async () => {
    setSpinner(true);
    await handleRemoveArtworkFromExhibition({exhibitionId, artworkId});
    setSpinner(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="confirm-delete-artwork-modal"
      maxWidth="lg">
      <DialogTitle id="alert-dialog-title">
        <Typography sx={{fontWeight: 'bold'}} variant="h6">
          Do you want to delete the artwork from darta?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description-1">
          <Typography sx={{fontWeight: 'bold'}}>
            This action cannot be undone.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isSpinner ? (
          <Box sx={{width: '100%'}}>
            <LinearProgress color="primary" />
          </Box>
        ) : (
          <>

            <Button
              variant="contained"
              style={{backgroundColor: PRIMARY_400}}
              data-testid="confirm-delete-artwork-button"
              onClick={() => {
                handleRemove();
              }}
              autoFocus>
              <Typography sx={{fontWeight: 'bold'}}>
                Remove From Exhibition
              </Typography>
            </Button>
            <Button
              variant="contained"
              style={{backgroundColor: PRIMARY_400}}
              data-testid="confirm-delete-artwork-button"
              onClick={() => {
                handleDelete();
              }}
              autoFocus>
              <Typography sx={{fontWeight: 'bold'}}>
                Delete Artwork From Darta
              </Typography>
            </Button>
            <Button variant="contained" style={{backgroundColor: PRIMARY_800}} onClick={handleClose}>
              <Typography sx={{fontWeight: 'bold', color: PRIMARY_50}}>Do Not Delete</Typography>
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
