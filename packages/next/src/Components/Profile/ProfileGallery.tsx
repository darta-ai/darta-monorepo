import SettingsIcon from '@mui/icons-material/Settings';
import {Box, Button, Typography} from '@mui/material';
// import {TourProvider} from '@reactour/tour';
import Head from 'next/head';
import React from 'react';

import {PRIMARY_BLUE} from '../../../styles';
import {InquiryTable} from '../Tables/InquiryTable';
import {GalleryLocationComponent} from './GalleryLocationText';
import {profileStyles} from './profileStyles';
import {IGalleryProfileData} from './types';

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
                  alt="gallery logo"
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
                <GalleryLocationComponent
                  galleryLocationString={
                    galleryProfileData?.galleryPrimaryLocation?.value!
                  }
                  galleryLocationIsPrivate={
                    galleryProfileData?.gallerySecondaryLocation?.isPrivate
                  }
                />

                {galleryProfileData?.gallerySecondaryLocation?.value && (
                  <GalleryLocationComponent
                    galleryLocationString={
                      galleryProfileData?.gallerySecondaryLocation?.value
                    }
                    galleryLocationIsPrivate={
                      galleryProfileData?.gallerySecondaryLocation?.isPrivate
                    }
                  />
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
