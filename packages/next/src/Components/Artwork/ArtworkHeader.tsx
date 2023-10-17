import * as Colors from '@darta-styles'
// import {Artwork} from '@darta-types';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import React from 'react';

import { PRIMARY_MILK} from '../../../styles/index';
// import {UploadArtworksXlsModal} from '../Modals';

export function ArtworkHeader({
  artworkLoading,
  addNewArtwork,
  // handleBatchUpload,
}: {
  artworkLoading: boolean;
  addNewArtwork: () => void;
  // handleBatchUpload: (artworks: {[key: string]: Artwork}) => void;
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
          disabled={artworkLoading}
          sx={{
            backgroundColor: Colors.PRIMARY_950,
            color: PRIMARY_MILK,
            alignSelf: 'center',
            width: '30vw',
            '@media (min-width: 1080px)': {
              width: '20vw',
            },
          }}>
          {artworkLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography sx={{fontWeight: 'bold', fontSize: '0.8rem'}}>
              Add Artwork
            </Typography>
          )}
        </Button>
        {/* <UploadArtworksXlsModal handleBatchUpload={handleBatchUpload} /> */}
      </Box>
    </Box>
  );
}
