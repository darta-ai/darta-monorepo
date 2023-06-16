import {Box, Typography} from '@mui/material';
import React from 'react';

import {profileStyles} from './profileStyles';

export function GalleryLocationComponent({
  galleryLocationString,
  galleryLocationIsPrivate,
}: {
  galleryLocationString: string;
  galleryLocationIsPrivate: boolean | null | undefined;
}) {
  // Holy fuck this is risky with the array
  const galleryLocationArray = galleryLocationString?.split(',');
  return (
    <Box sx={profileStyles.profile.galleryAddressContainer}>
      <Typography variant="h6" sx={profileStyles.profile.addressText}>
        {galleryLocationArray[1] ?? 'Your Gallery Address'}
        {galleryLocationIsPrivate && '*'}
      </Typography>
      {galleryLocationArray[0] && (
        <Typography sx={profileStyles.profile.addressText}>
          {galleryLocationArray[0]}
        </Typography>
      )}
      {galleryLocationArray[2] && (
        <Typography sx={profileStyles.profile.addressText}>
          {galleryLocationArray[2]}
        </Typography>
      )}
    </Box>
  );
}
