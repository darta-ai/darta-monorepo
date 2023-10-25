import * as Colors from '@darta-styles';
import {Typography} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export function DartaDialogue({
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
      data-testid="confirm-delete-artwork-modal">
      <DialogTitle id="alert-dialog-title">
        <Typography
          sx={{fontWeight: 'bold'}}
          variant="h6">{`Are you sure you want to delete ${deleteType}?`}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography
            sx={{
              fontWeight: 'bold',
            }}>{`You are about to delete ${identifier} from darta. This action cannot be undone.`}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{backgroundColor: Colors.PRIMARY_400}}
          data-testid="confirm-delete-artwork-button"
          onClick={() => {
            handleDelete(id);
            handleClose();
          }}
          autoFocus>
          <Typography sx={{fontWeight: 'bold'}}>Delete</Typography>
        </Button>
        <Button variant="contained" style={{backgroundColor: Colors.PRIMARY_800}} onClick={handleClose}>
          <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>Do not delete</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
