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
  identifier,
  deleteType,
  id,
}: {
  open: boolean;
  handleClose: () => void;
  handleDelete: (arg0: string) => void;
  identifier: string;
  deleteType: string;
  id: string;
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="confirm-delete-artwork-modal"
      maxWidth="lg"
      >
      <DialogTitle id="alert-dialog-title">
        {`Do you want to delete both the artwork and the exhibition from darta?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`This action cannot be undone.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Do not delete
        </Button>
        <Button
          variant="contained"
          color="error"
          data-testid="confirm-delete-artwork-button"
          onClick={() => {
            handleDelete(id);
            handleClose();
          }}
          autoFocus>
          Delete Exhibition
        </Button>
        <Button
          variant="contained"
          color="error"
          data-testid="confirm-delete-artwork-button"
          onClick={() => {
            handleDelete(id);
            handleClose();
          }}
          autoFocus>
          Delete Exhibition and Artwork
        </Button>
      </DialogActions>
    </Dialog>
  );
}
