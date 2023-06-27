import {Box, Grid, Typography} from '@mui/material';
import React from 'react';

import {IBusinessLocationData} from '../../../../globalTypes';
import {profileStyles} from './profileStyles';

export function GalleryLocationComponent({
  galleryLocationData,
}: {
  galleryLocationData: IBusinessLocationData | undefined;
}) {
  const businessHours = galleryLocationData?.businessHours;
  const locationString = galleryLocationData?.locationString;
  // Holy fuck this is risky with the array
  const galleryLocationArray = locationString?.value?.split(',');
  const galleryCity = galleryLocationArray?.slice(1, 2);
  const galleryLocationIsPrivate = locationString?.isPrivate;
  const hoursOfOperation = businessHours?.hoursOfOperation;

  return (
    <Box sx={profileStyles.profile.galleryAddressContainer}>
      {galleryLocationArray && (
        <>
          <Typography variant="h5" sx={profileStyles.profile.addressText}>
            {galleryCity ?? 'Your Gallery Address'}
            {galleryLocationIsPrivate && '*'}
          </Typography>
          <Typography sx={profileStyles.profile.addressText}>
            {galleryLocationArray[0]}
            {galleryLocationArray[1]}
            {galleryLocationArray[2]}
            {galleryLocationArray[3]}
            {galleryLocationArray[4]}
          </Typography>
        </>
      )}
      {businessHours && (
        <Box sx={{my: 2}}>
          <Typography variant="h5" sx={profileStyles.profile.addressText}>
            Hours
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={1.5}>
              <Typography />
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Monday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Tuesday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Wednesday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Thursday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Friday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Saturday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Sunday</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Open</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Monday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Tuesday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Wednesday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Thursday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Friday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Saturday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Sunday.open.value}</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>Close</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Monday.close.value}</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Tuesday.close.value}</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Wednesday.close.value}</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Thursday.close.value}</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Friday.close.value}</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Saturday.close.value}</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography>{hoursOfOperation?.Sunday.close.value}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
