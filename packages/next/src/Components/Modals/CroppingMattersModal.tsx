import {Button, Dialog, DialogActions, DialogContent} from '@mui/material';
import Image from 'next/image';
import React from 'react';

const croppingMatters = require(`../../../public/static/images/croppingMatters.png`);

export function CroppingMattersModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      data-testid="cropping-matters-modal"
      sx={{minHeight: '60vh', minWidth: '60vw'}}>
      <DialogContent>
        <Image src={croppingMatters} width={550} alt="Modal Image" />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          variant="contained"
          data-testid="dismiss-cropping-matters-modal">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
