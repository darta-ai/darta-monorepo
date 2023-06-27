import SettingsIcon from '@mui/icons-material/Settings';
import {Box, Button, Divider, Typography} from '@mui/material';
// import {TourProvider} from '@reactour/tour';
import Head from 'next/head';
import React from 'react';

import {IGalleryProfileData} from '../../../globalTypes';
import {PRIMARY_BLUE} from '../../../styles';
// import {InquiryTable} from '../Tables/InquiryTable';
import {GalleryLocationComponent} from './Components/GalleryLocationText';
import {profileStyles} from './Components/profileStyles';

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
                  src={galleryProfileData?.galleryLogo?.value as string}
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
                  <Box sx={{mx: 3}}>
                    <Typography>
                      {galleryProfileData?.galleryBio?.value}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{width: '100%'}}>
          <Typography variant="h5" sx={{textAlign: 'left'}}>
            Contact
            <Divider />
          </Typography>
        </Box>
        <Box sx={profileStyles.profile.galleryContactContainer}>
          <Box>
            <Typography
              variant="h6"
              sx={profileStyles.profile.galleryContactHeadline}>
              Email
              <Divider />
            </Typography>
            <Typography
              sx={{textAlign: 'center', overflow: 'hidden', my: '1vh'}}>
              {galleryProfileData?.primaryContact?.value
                ? galleryProfileData?.primaryContact?.value
                : 'N/A'}
              {galleryProfileData?.primaryContact?.isPrivate && '*'}
            </Typography>
          </Box>
          {galleryProfileData?.galleryPhone?.value && (
            <Box>
              <Typography
                variant="h6"
                sx={profileStyles.profile.galleryContactHeadline}>
                Phone
                <Divider />
              </Typography>
              <Typography sx={{textAlign: 'center', my: '1vh'}}>
                {galleryProfileData?.galleryPhone?.value}
                {galleryProfileData?.galleryPhone?.isPrivate && '*'}
              </Typography>
            </Box>
          )}
          {galleryProfileData?.galleryWebsite?.value && (
            <Box>
              <Typography
                variant="h6"
                sx={profileStyles.profile.galleryContactHeadline}>
                Website
                <Divider />
              </Typography>
              <Typography sx={{textAlign: 'center', my: '1vh'}}>
                {galleryProfileData?.galleryWebsite?.value ? (
                  <a
                    target="_blank"
                    href={galleryProfileData?.galleryWebsite?.value}
                    rel="noreferrer">
                    {galleryProfileData?.galleryWebsite?.value
                      .replace('http://www.', '')
                      .replace('https://www.', '')
                      .replace('/', '')}
                  </a>
                ) : (
                  'N/A'
                )}
                {galleryProfileData?.galleryWebsite?.isPrivate && '*'}
              </Typography>
            </Box>
          )}
          {galleryProfileData?.galleryInstagram?.value && (
            <Box>
              <Typography
                variant="h6"
                sx={profileStyles.profile.galleryContactHeadline}>
                Instagram
                <Divider />
              </Typography>
              <Typography sx={{textAlign: 'center', my: '1vh'}}>
                {galleryProfileData?.galleryInstagram?.value
                  ? galleryProfileData?.galleryInstagram?.value
                  : 'N/A'}
                {galleryProfileData?.galleryInstagram?.isPrivate && '*'}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{width: '100%'}}>
          <Typography variant="h5" sx={{textAlign: 'left'}}>
            Locations
            <Divider />
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '5vh'}}>
          <Box sx={profileStyles.profile.galleryAddressContainer}>
            <GalleryLocationComponent
              galleryLocationData={galleryProfileData?.galleryLocation0}
            />
          </Box>
          <Box sx={profileStyles.profile.galleryAddressContainer}>
            <GalleryLocationComponent
              galleryLocationData={galleryProfileData?.galleryLocation1}
            />
          </Box>
          <Box sx={profileStyles.profile.galleryAddressContainer}>
            <GalleryLocationComponent
              galleryLocationData={galleryProfileData?.galleryLocation2}
            />
          </Box>
          <Box sx={profileStyles.profile.galleryAddressContainer}>
            <GalleryLocationComponent
              galleryLocationData={galleryProfileData?.galleryLocation3}
            />
          </Box>
          <Box sx={profileStyles.profile.galleryAddressContainer}>
            <GalleryLocationComponent
              galleryLocationData={galleryProfileData?.galleryLocation4}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
