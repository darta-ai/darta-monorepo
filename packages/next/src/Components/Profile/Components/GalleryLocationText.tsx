import {Box, Divider, Grid, Typography} from '@mui/material';
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

  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);

  return (
    <Box sx={profileStyles.profile.galleryAddressContainer}>
      {galleryLocationArray && (
        <>
          <Typography variant="h5" sx={profileStyles.profile.addressText}>
            {galleryCity !== undefined ? galleryCity : 'Your Gallery Address'}
            {galleryLocationIsPrivate && '*'}
            <Divider sx={{width: '20%'}} />
          </Typography>
          <Typography sx={{fontSize: '1rem'}}>
            {galleryLocationArray[0]}
            {galleryLocationArray[1]}
            {galleryLocationArray[2]}
            {galleryLocationArray[3]}
            {galleryLocationArray[4]}
          </Typography>
        </>
      )}
      <Box sx={{my: 2}}>
        {(galleryLocationArray ||
          hoursOfOperation?.Monday?.open.value ||
          hoursOfOperation?.Tuesday?.open.value ||
          hoursOfOperation?.Wednesday?.open.value ||
          hoursOfOperation?.Thursday?.open.value ||
          hoursOfOperation?.Friday?.open.value ||
          hoursOfOperation?.Saturday?.open.value ||
          hoursOfOperation?.Sunday?.open.value) && (
          <>
            <Typography variant="h5" sx={profileStyles.profile.addressText}>
              Hours
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={1.5}>
                <Typography />
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Mon
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Tues
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Wed
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Thur
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Fri
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Sat
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  Sun
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={{
                    ...profileStyles.profile.hoursOfOperationText,
                    fontWeight: 'bold',
                  }}>
                  Open
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Monday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Tuesday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Wednesday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Thursday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Friday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Saturday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Sunday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={{
                    ...profileStyles.profile.hoursOfOperationText,
                    fontWeight: 'bold',
                  }}>
                  Close
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Monday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Tuesday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Wednesday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Thursday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Friday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Saturday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography sx={profileStyles.profile.hoursOfOperationText}>
                  {hoursOfOperation?.Sunday.close.value}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
