import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

export function DartaDialogue({
  open,
  handleClose,
  handleDelete,
  artworkTitle,
  artworkId,
  artistName,
}: {
  open: boolean;
  handleClose: () => void;
  handleDelete: (arg0: string) => void;
  artworkTitle: string;
  artworkId: string;
  artistName: string;
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this artwork from darta?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`You are about to delete ${artworkTitle} by ${artistName} from darta. This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Do not delete
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(artworkId);
              handleClose();
            }}
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
