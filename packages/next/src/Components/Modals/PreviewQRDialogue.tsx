import * as Colors from '@darta-styles';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from 'qrcode'
import React from 'react';

export function PreviewQRDialogue({
  open,
  handleClose,
  galleryId,
  exhibitionId,
}: {
  open: boolean;
  handleClose: () => void;
  galleryId: string;
  exhibitionId: string;
}) {

  const [qrCode, setQRCode] = React.useState<string>('')

  React.useEffect(() => {
    const generateQR = async () => {
        const text = `https://darta.art/exhibitions?galleryId=${galleryId}exhibitionId=${exhibitionId}`
        const results = await QRCode.toDataURL(text)
        setQRCode(results)
    }
    generateQR()
  }, [])

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
          variant="h6">Preview</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
          <Typography
            sx={{
              fontWeight: 'bold',
            }}>{`Scan this QR code with your camera to take you to a preview of the exhibition.
             The exhibition will be hidden from users until you publish it.`}</Typography>
            {qrCode && (
              <Box
                component="img"
                sx={{alignSelf:'center', alignItems: 'center'}}
                alt="Your description"
                src={qrCode}
              />
              )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" style={{backgroundColor: Colors.PRIMARY_800}} onClick={handleClose}>
          <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>Close</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
