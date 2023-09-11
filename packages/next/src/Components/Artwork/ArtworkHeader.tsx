import {Box, Button, Typography} from '@mui/material';
import React from 'react';

import {Artwork} from '@darta/types';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles/index';
import {UploadArtworksXlsModal} from '../Modals';

export function ArtworkHeader({
  addNewArtwork,
  handleBatchUpload,
}: {
  addNewArtwork: () => void;
  handleBatchUpload: (artworks: {[key: string]: Artwork}) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '3vw',
        m: 3,
        justifyContent: 'center',
      }}
      className="gallery-artwork-container">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3vw',
          '@media (min-width:800px)': {
            flexDirection: 'row',
          },
        }}>
        <Button
          variant="contained"
          data-testid="create-new-artwork-button"
          type="submit"
          onClick={() => addNewArtwork()}
          className="create-new-artwork"
          sx={{
            backgroundColor: PRIMARY_BLUE,
            color: PRIMARY_MILK,
            alignSelf: 'center',
          }}>
          <Typography sx={{fontWeight: 'bold', fontSize: '0.8rem'}}>
            Create Artwork
          </Typography>
        </Button>
        <UploadArtworksXlsModal handleBatchUpload={handleBatchUpload} />
      </Box>
    </Box>
  );
}
