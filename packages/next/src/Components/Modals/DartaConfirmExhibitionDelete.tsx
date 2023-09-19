import {Box, LinearProgress, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export function DartaConfirmExhibitionDelete({
  open,
  handleClose,
  handleDelete,
  id,
}: {
  open: boolean;
  handleClose: () => void;
  handleDelete: ({
    exhibitionId,
    deleteArtworks,
  }: {
    exhibitionId: string;
    deleteArtworks?: boolean | undefined;
  }) => Promise<boolean>;

  id: string;
}) {
  const [isSpinner, setSpinner] = React.useState<boolean>(false);

  const deleteExhibition = async () => {
    setSpinner(true);
    await handleDelete({exhibitionId: id, deleteArtworks: false});
    setSpinner(false);
    handleClose();
  };

  const deleteArtworks = async () => {
    setSpinner(true);
    await handleDelete({exhibitionId: id, deleteArtworks: true});
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
        <Typography sx={{fontWeight: 'bold'}} variant="h5">
          Do you want to delete both the artwork and the exhibition from darta?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography
            sx={{
              fontWeight: 'bold',
            }}>
            This action cannot be undone.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isSpinner ? (
          <Box sx={{width: '100%'}}>
            <LinearProgress color="error" />
          </Box>
        ) : (
          <>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              <Typography sx={{fontWeight: 'bold'}}>Do not delete</Typography>
            </Button>
            <Button
              variant="contained"
              color="error"
              data-testid="confirm-delete-artwork-button"
              onClick={() => deleteExhibition()}
              autoFocus>
              <Typography sx={{fontWeight: 'bold'}}>
                Delete Exhibition
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="error"
              data-testid="confirm-delete-artwork-button"
              onClick={() => deleteArtworks()}
              autoFocus>
              <Typography sx={{fontWeight: 'bold'}}>
                Delete Exhibition and Artwork
              </Typography>
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
