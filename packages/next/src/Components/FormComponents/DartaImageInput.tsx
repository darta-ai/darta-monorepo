/* eslint-disable react/jsx-props-no-spreading */
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Box, Typography} from '@mui/material';
import React from 'react';
import Dropzone from 'react-dropzone';

import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles';

const useStyles = {
  dropzone: {
    border: `2px dashed black`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    height: '80%',
    m: 1,
    padding: '2vh',
    width: '80%',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    '&:hover': {
      borderColor: PRIMARY_BLUE,
      backgroundColor: PRIMARY_MILK,
    },
  },
  icon: {
    fontSize: 48,
    marginBottom: '2vh',
  },
  text: {
    marginBottom: '2vh',
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
            Only accept files with extensions: jpg, jpeg,png, pdf
          </Typography>
        </Box>
      )}
    </Dropzone>
  );
}
