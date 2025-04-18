import * as Colors from '@darta-styles'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';


const modalStyles = {
  dialogueContainer: {
    color: Colors.PRIMARY_50,
  },
  button: {
    color: Colors.PRIMARY_600,
  },
  modalContainer: {
    color: Colors.PRIMARY_50,
    display: 'flex',
    flexDirection: 'column',
    gap: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImage: {
    marginTop: '1em',
    maxWidth: '100%',
    borderWidth: 30,
  },
  displayNone: {
    display: 'none',
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
      setOpen(false);
    } else {
      // console.log('No file selected');
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
              src={previewUrl}
              alt="upload image"
              style={modalStyles.defaultImage}
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
              style={modalStyles.displayNone}
            />
            <Button variant="contained" component="span">
              Select Image
            </Button>
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
