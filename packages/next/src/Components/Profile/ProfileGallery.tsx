/* eslint-disable jsx-a11y/img-redundant-alt */
import SettingsIcon from '@mui/icons-material/Settings';
import {Box, Button, Typography} from '@mui/material';
// import {TourProvider} from '@reactour/tour';
import Head from 'next/head';
import React from 'react';

import {PRIMARY_BLUE} from '../../../styles';
// import {InquiryTable} from '../Inquires/InquiryTable';
import {profileStyles} from './profileStyles';
import {IGalleryProfileData} from './types';

// type GalleryInquiryStats =
//   | 'inquired'
//   | 'responded to'
//   | 'negotiation'
//   | 'accepted'
//   | 'Purchase Agreement Sent'
//   | 'Payment Received'
//   | 'declined'
//   | 'archived';

// const galleryInquiriesDummyData = {
//   '0': {
//     id: '1',
//     artist: 'Jane Doe',
//     workURL:
//       'https://d32dm0rphc51dk.cloudfront.net/aY71CL0-0ktA3W2hIHV12g/larger.jpg',
//     name: 'John Doe',
//     contactInformation: 'JohnDoe@gmail.com',
//     status: 'inquired',
//     workId: '241204124',
//     inquiredAt: '2021-10-10',
//     updatedAt: '2021-10-10',
//   },
//   '1': {
//     id: '1',
//     artist: 'Jane Doe',
//     workURL:
//       'https://d32dm0rphc51dk.cloudfront.net/aY71CL0-0ktA3W2hIHV12g/larger.jpg',
//     name: 'John Doe',
//     contactInformation: 'JohnDoe@gmail.com',
//     status: 'inquired',
//     workId: '241204124',
//   },
// };

export function ProfileGallery({
  isEditingProfile,
  setIsEditingProfile,
  galleryProfileData,
}: {
  isEditingProfile: boolean;
  galleryProfileData: IGalleryProfileData;
  setIsEditingProfile: (T: boolean) => void;
}) {
  return (
    <>
      <Head>
        <title>Gallery | Profile</title>
        <meta name="description" content="Your darta profile." />
      </Head>
      <Box mb={2} sx={profileStyles.container}>
        <Box sx={profileStyles.profile.editButtonProfile}>
          <Button
            variant="outlined"
            sx={{color: PRIMARY_BLUE}}
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            startIcon={<SettingsIcon sx={{color: PRIMARY_BLUE}} />}>
            Edit
          </Button>
        </Box>
        <Box sx={profileStyles.profile.galleryInfoContainer}>
          <Box sx={profileStyles.profile.galleryHeaderContainer}>
            <Box sx={profileStyles.profile.imageBox}>
              {galleryProfileData?.galleryLogo ? (
                <img
                  src={galleryProfileData?.galleryLogo.value}
                  alt="upload image"
                  style={profileStyles.profile.defaultImage}
                />
              ) : (
                <Box
                  sx={{
                    ...profileStyles.profile.imageBox,
                    border: '1px solid black',
                  }}>
                  <Typography sx={profileStyles.profile.addressText}>
                    Edit gallery information to get started
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={profileStyles.profile.galleryDetails}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
                  {galleryProfileData?.galleryName?.value
                    ? galleryProfileData?.galleryName.value
                    : 'Your Gallery Name'}
                </Typography>
                <Box sx={profileStyles.profile.galleryBioStyles}>
                  <Typography>
                    {galleryProfileData?.galleryBio?.value}
                  </Typography>
                </Box>
              </Box>
              <Box sx={profileStyles.profile.galleryLocationContainer}>
                <Box sx={profileStyles.profile.galleryAddressContainer}>
                  <Typography
                    variant="h6"
                    sx={profileStyles.profile.addressText}>
                    {galleryProfileData?.galleryPrimaryCity?.value
                      ? galleryProfileData?.galleryPrimaryCity?.value
                      : 'Your Gallery Address'}
                    {galleryProfileData?.galleryPrimaryLocation?.isPrivate &&
                      '*'}
                  </Typography>
                  {galleryProfileData?.galleryPrimaryAddressLine1?.value && (
                    <Typography sx={profileStyles.profile.addressText}>
                      {galleryProfileData?.galleryPrimaryAddressLine1?.value}
                    </Typography>
                  )}
                  {galleryProfileData?.galleryPrimaryAddressLine2?.value && (
                    <Typography sx={profileStyles.profile.addressText}>
                      {galleryProfileData?.galleryPrimaryAddressLine2?.value}
                    </Typography>
                  )}
                  <Typography sx={profileStyles.profile.addressText}>
                    -
                  </Typography>
                  {galleryProfileData?.galleryPrimaryState?.value && (
                    <Typography sx={profileStyles.profile.addressText}>
                      {galleryProfileData?.galleryPrimaryState?.value}
                    </Typography>
                  )}
                  {galleryProfileData?.galleryPrimaryZip?.value && (
                    <Typography sx={profileStyles.profile.addressText}>
                      {galleryProfileData?.galleryPrimaryZip?.value}
                    </Typography>
                  )}
                </Box>

                {galleryProfileData?.gallerySecondaryLocation?.value && (
                  <Box sx={profileStyles.profile.galleryAddressContainer}>
                    <Typography
                      variant="h6"
                      sx={profileStyles.profile.addressText}>
                      {galleryProfileData?.gallerySecondaryCity?.value
                        ? galleryProfileData?.gallerySecondaryCity?.value
                        : 'Gallery Address'}
                    </Typography>
                    {galleryProfileData?.gallerySecondaryAddressLine1 && (
                      <Typography sx={profileStyles.profile.addressText}>
                        {
                          galleryProfileData?.gallerySecondaryAddressLine1
                            ?.value
                        }
                      </Typography>
                    )}
                    {galleryProfileData?.gallerySecondaryAddressLine2 && (
                      <Typography sx={profileStyles.profile.addressText}>
                        {
                          galleryProfileData?.gallerySecondaryAddressLine2
                            ?.value
                        }
                      </Typography>
                    )}
                    <Typography sx={profileStyles.profile.addressText}>
                      -
                    </Typography>
                    {galleryProfileData?.galleryPrimaryState && (
                      <Typography sx={profileStyles.profile.addressText}>
                        {galleryProfileData?.gallerySecondaryState?.value}
                      </Typography>
                    )}
                    {galleryProfileData?.galleryPrimaryZip && (
                      <Typography sx={profileStyles.profile.addressText}>
                        {galleryProfileData?.gallerySecondaryZip?.value}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              <Box sx={profileStyles.profile.galleryBioContainer}>
                <Typography variant="h6" sx={{textAlign: 'center'}}>
                  Primary Contact
                </Typography>
                <Typography sx={{textAlign: 'center'}}>
                  {galleryProfileData?.primaryContact?.value
                    ? galleryProfileData?.primaryContact?.value
                    : 'Your Primary Contact'}
                  {galleryProfileData?.primaryContact?.isPrivate && '*'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>{/* <InquiryTable /> */}</Box>
      </Box>
    </>
  );
}
