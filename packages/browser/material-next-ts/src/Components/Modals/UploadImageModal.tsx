import * as React from 'react';
import {
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  Button,
} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles';
import Image from 'next/image';

const modalStyles = {
  dialogueContainer: {
    color: PRIMARY_MILK,
  },
  button: {
    color: PRIMARY_BLUE,
  },
  modalContainer: {
    color: PRIMARY_MILK,
    display: 'flex',
    flexDirection: 'column',
    gap: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export function ImageUploadModal({
  actionText,
  dialogueTitle,
  dialogueText,
}: {
  actionText: string;
  dialogueTitle: string;
  dialogueText: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState('');

  const backupImage = require(`../../../public/static/images/UploadImage.png`);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewUrl(''); // Reset preview URL when dialog is closed
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(event.target.files[0]);
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Implement your own image upload logic here
      console.log(selectedFile);
      setOpen(false);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        {actionText}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogueTitle}</DialogTitle>
        <DialogContent sx={modalStyles.modalContainer}>
          <DialogContentText>{dialogueText}</DialogContentText>
          <Box>
            <Image
              src={previewUrl ? previewUrl : backupImage}
              alt="upload image"
              style={{marginTop: '1em', maxWidth: '100%', borderWidth: 30}}
              height={400}
              width={400}
            />
          </Box>
          <Box sx={{alignItems: 'center'}}>
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
              style={{display: 'none'}}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span">
                Select Image
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{...modalStyles.button, color: 'red'}}>
            Cancel
          </Button>
          <Button onClick={handleUpload} sx={modalStyles.button}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
