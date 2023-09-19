import {IBusinessLocationData} from '@darta/types';
import {Box, Divider, Grid, Typography} from '@mui/material';
import React from 'react';

import {profileStyles} from './profileStyles';

export function GalleryLocationComponent({
  galleryLocationData,
  testIdData,
}: {
  galleryLocationData: IBusinessLocationData | undefined;
  testIdData: string;
}) {
  const businessHours = galleryLocationData?.businessHours;
  const locationString = galleryLocationData?.locationString;
  // Holy fuck this is risky with the array
  const galleryLocationArray = locationString?.value?.split(',');
  const galleryCity =
    galleryLocationData?.city?.value ?? galleryLocationArray?.slice(1, 2);
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
          <Typography
            variant="h5"
            sx={profileStyles.profile.addressText}
            data-testid={`${testIdData}-city-data`}>
            {galleryCity !== undefined ? galleryCity : 'Your Gallery Address'}
            {galleryLocationIsPrivate && '*'}
            <Divider sx={{width: '20%'}} />
          </Typography>
          <Typography
            sx={{fontSize: '1rem'}}
            data-testid={`${testIdData}-city-data-details`}>
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
            <Typography
              data-testid={`${testIdData}-hours`}
              variant="h5"
              sx={profileStyles.profile.addressText}>
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
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-monday-open`}>
                  {hoursOfOperation?.Monday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Monday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-tuesday-open`}>
                  {hoursOfOperation?.Tuesday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Tuesday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-wednesday-open`}>
                  {hoursOfOperation?.Wednesday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Wednesday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-thursday-open`}>
                  {hoursOfOperation?.Thursday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Thursday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-friday-open`}>
                  {hoursOfOperation?.Friday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Friday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-saturday-open`}>
                  {hoursOfOperation?.Saturday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Saturday.open.value}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-sunday-open`}>
                  {hoursOfOperation?.Sunday.open.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Sunday.open.value}
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
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-monday-close`}>
                  {hoursOfOperation?.Monday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Monday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-tuesday-close`}>
                  {hoursOfOperation?.Tuesday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Tuesday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-wednesday-close`}>
                  {hoursOfOperation?.Wednesday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Wednesday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-thursday-close`}>
                  {hoursOfOperation?.Thursday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Thursday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-friday-close`}>
                  {hoursOfOperation?.Friday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Friday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-saturday-close`}>
                  {hoursOfOperation?.Saturday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Saturday.close.value}
                </Typography>
              </Grid>

              <Grid item xs={1.5}>
                <Typography
                  sx={profileStyles.profile.hoursOfOperationText}
                  data-testid={`${testIdData}-hours-sunday-close`}>
                  {hoursOfOperation?.Sunday.close.value === 'Closed'
                    ? '-'
                    : hoursOfOperation?.Sunday.close.value}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
