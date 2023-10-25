import * as Colors from '@darta-styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Box, Typography} from '@mui/material';
import React from 'react';
import Dropzone from 'react-dropzone';

const useStyles = {
  dropzone: {
    border: `2px dashed black`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    height: '100%',
    width: '100%',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    '&:hover': {
      borderColor: Colors.PRIMARY_600,
      backgroundColor: Colors.PRIMARY_50,
    },
  },
  icon: {
    fontSize: 48,
    marginBottom: '2vh',
  },
  text: {
    // marginBottom: '2vh',
    fontSize: '1rem',
    textAlign: 'center',
    '@media (min-width: 800px)': {
      fontSize: '1.5rem',
    },
  },
  fileAcceptanceText: {
    fontSize: '0.75rem',
    color: 'textSecondary',
    textAlign: 'center',
    '@media (min-width: 800px)': {
      fontSize: '0.5rem',
    },
  },
};

export function DartaImageInput({
  onDrop,
  instructions,
}: {
  onDrop: any;
  instructions: string;
}) {
  return (
    <Dropzone onDrop={onDrop}>
      {({getRootProps, getInputProps}) => (
        <Box {...getRootProps()} sx={useStyles.dropzone}>
          <input {...getInputProps()} data-testid="imageDropZone" />
          <Typography sx={useStyles.text} variant="h6">
            {instructions}
          </Typography>
          <CloudUploadIcon sx={useStyles.icon} />

          <Typography variant="caption" sx={useStyles.fileAcceptanceText}>
            Accept files: jpg, jpeg, png, pdf
          </Typography>
        </Box>
      )}
    </Dropzone>
  );
}
