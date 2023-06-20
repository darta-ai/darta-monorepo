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
    height: '100%',
    padding: '2vh',
    width: '100%',
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
          <input {...getInputProps()} />
          <Typography sx={{textAlign: 'center'}} variant="h6">
            {instructions}
          </Typography>
          <CloudUploadIcon sx={useStyles.icon} />

          <Typography variant="caption" color="textSecondary">
            Only accept files with extensions: jpg, png, pdf
          </Typography>
        </Box>
      )}
    </Dropzone>
  );
}
