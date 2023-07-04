import SettingsIcon from '@mui/icons-material/Settings';
import {Box, Button, Divider, Typography} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

import {IGalleryProfileData} from '../../../globalTypes';
import {PRIMARY_BLUE} from '../../../styles';
import {GalleryLocationComponent} from './Components/GalleryLocationText';
import {profileStyles} from './Components/profileStyles';

function GalleryStatus({
  galleryProfileData,
}: {
  galleryProfileData: IGalleryProfileData;
}) {
  if (!galleryProfileData?.isValidated) {
    return (
      <Box data-testid="gallery-under-review">
        <Typography variant="h4" sx={{color: 'red', textAlign: 'center'}}>
          Gallery Under Review
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{mx: 3}}>
            <Typography>
              We do basic quality assurance of all galleries on the platform to
              ensure the end user gets the best possible experience. We will
              reach out to you via the email you have provided when it is
              approved or denied.
            </Typography>
          </Box>
          <Box sx={{mx: 3, my: 3}}>
            <Typography>
              If you have any questions or concerns, please reach out to us at{' '}
              <a href="mailto:info@darta.works">info@darta.works</a>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  } else if (galleryProfileData?.galleryName?.value) {
    return (
      <Box data-testid="gallery-name-display">
        <Typography
          variant="h4"
          sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
          {galleryProfileData?.galleryName?.value}
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{mx: 3}}>
            <Typography data-testid="gallery-profile-name-data">
              {galleryProfileData?.galleryBio?.value}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box data-testid="gallery-start-editing">
        <Typography
          variant="h4"
          sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
          Click EDIT to get started.
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{mx: 3}}>
            <Typography>
              This will be your gallery bio. Click EDIT (upper right hand
              corner) to get started.
            </Typography>
          </Box>
          <Box sx={{mx: 3, my: 3}}>
            <Typography>
              If you believe this is an error, please refresh the page.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
}

function GalleryEditButton({
  galleryProfileData,
  setIsEditingProfile,
  isEditingProfile,
}: {
  isEditingProfile: boolean;
  galleryProfileData: IGalleryProfileData;
  setIsEditingProfile: (T: boolean) => void;
}) {
  if (!galleryProfileData?.isValidated) {
    return <Box sx={profileStyles.profile.editButtonProfile} />;
  } else if (galleryProfileData?.galleryName?.value) {
    return (
      <Box sx={profileStyles.profile.editButtonProfile}>
        <Button
          variant="outlined"
          sx={{color: PRIMARY_BLUE}}
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          startIcon={<SettingsIcon sx={{color: PRIMARY_BLUE}} />}>
          Edit
        </Button>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          ...profileStyles.profile.editButtonProfile,
          border: '1px solid black',
        }}>
        <Button
          variant="outlined"
          sx={{color: PRIMARY_BLUE}}
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          startIcon={<SettingsIcon sx={{color: PRIMARY_BLUE}} />}>
          Edit
        </Button>
      </Box>
    );
  }
}

export function ProfileGallery({
  isEditingProfile,
  setIsEditingProfile,
  galleryProfileData,
}: {
  isEditingProfile: boolean;
  galleryProfileData: IGalleryProfileData;
  setIsEditingProfile: (T: boolean) => void;
}) {
  let png;
  try {
    // eslint-disable-next-line global-require
    png = require(`../../../public/static/images/dartahouse.png`);
  } catch (e) {
    png = null;
  }
  return (
    <>
      <Head>
        <title>Gallery | Profile</title>
        <meta name="description" content="Your darta profile." />
      </Head>
      <Box
        mb={2}
        sx={profileStyles.container}
        data-testid="profile-gallery-container">
        <Box sx={profileStyles.profile.editButtonProfile}>
          <GalleryEditButton
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            galleryProfileData={galleryProfileData}
          />
        </Box>
        <Box sx={profileStyles.profile.galleryInfoContainer}>
          <Box sx={profileStyles.profile.galleryHeaderContainer}>
            <Box
              sx={profileStyles.profile.imageBox}
              data-testid="profile-gallery-image-box">
              {galleryProfileData?.galleryLogo ? (
                <Box>
                  <img
                    src={galleryProfileData?.galleryLogo?.value as string}
                    alt="gallery logo"
                    style={profileStyles.profile.defaultImage}
                    data-testid="profile-gallery-logo"
                  />
                </Box>
              ) : (
                <Box>
                  <div style={profileStyles.profile.imageSize}>
                    <Image
                      src={png}
                      alt="info"
                      style={profileStyles.profile.image}
                      data-testid="profile-image-display"
                    />
                  </div>
                </Box>
              )}
            </Box>
            <Box sx={profileStyles.profile.galleryDetails}>
              <GalleryStatus
                galleryProfileData={galleryProfileData as IGalleryProfileData}
              />
            </Box>
          </Box>
        </Box>
        {(galleryProfileData?.primaryContact?.value ||
          galleryProfileData?.galleryWebsite?.value ||
          galleryProfileData?.galleryInstagram?.value) && (
          <>
            <Box
              sx={{width: '100%', mt: 5}}
              data-testid="profile-contact-section">
              <Typography variant="h5" sx={{textAlign: 'left'}}>
                Contact
                <Divider />
              </Typography>
            </Box>
            <Box sx={profileStyles.profile.galleryContactContainer}>
              <Box>
                <Typography
                  variant="h6"
                  data-testid="profile-contact-email"
                  sx={profileStyles.profile.galleryContactHeadline}>
                  Email
                  <Divider />
                </Typography>
                <Typography
                  data-testid="profile-contact-email-data"
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
                    data-testid="profile-contact-phone"
                    sx={profileStyles.profile.galleryContactHeadline}>
                    Phone
                    <Divider />
                  </Typography>
                  <Typography
                    data-testid="profile-contact-phone-data"
                    sx={{textAlign: 'center', my: '1vh'}}>
                    {galleryProfileData?.galleryPhone?.value}
                    {galleryProfileData?.galleryPhone?.isPrivate && '*'}
                  </Typography>
                </Box>
              )}
              {galleryProfileData?.galleryWebsite?.value && (
                <Box>
                  <Typography
                    variant="h6"
                    data-testid="profile-contact-website"
                    sx={profileStyles.profile.galleryContactHeadline}>
                    Website
                    <Divider />
                  </Typography>
                  <Typography
                    sx={{textAlign: 'center', my: '1vh'}}
                    data-testid="profile-contact-website-data">
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
                    data-testid="profile-contact-instagram"
                    sx={profileStyles.profile.galleryContactHeadline}>
                    Instagram
                    <Divider />
                  </Typography>
                  <Typography
                    sx={{textAlign: 'center', my: '1vh'}}
                    data-testid="profile-contact-instagram-data">
                    {galleryProfileData?.galleryInstagram?.value
                      ? galleryProfileData?.galleryInstagram?.value
                      : 'N/A'}
                    {galleryProfileData?.galleryInstagram?.isPrivate && '*'}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
        {galleryProfileData?.galleryLocation0?.locationString?.value && (
          <>
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
                  testIdData="galleryLocation0"
                />
              </Box>
              <Box sx={profileStyles.profile.galleryAddressContainer}>
                <GalleryLocationComponent
                  galleryLocationData={galleryProfileData?.galleryLocation1}
                  testIdData="galleryLocation1"
                />
              </Box>
              <Box sx={profileStyles.profile.galleryAddressContainer}>
                <GalleryLocationComponent
                  galleryLocationData={galleryProfileData?.galleryLocation2}
                  testIdData="galleryLocation2"
                />
              </Box>
              <Box sx={profileStyles.profile.galleryAddressContainer}>
                <GalleryLocationComponent
                  galleryLocationData={galleryProfileData?.galleryLocation3}
                  testIdData="galleryLocation3"
                />
              </Box>
              <Box sx={profileStyles.profile.galleryAddressContainer}>
                <GalleryLocationComponent
                  galleryLocationData={galleryProfileData?.galleryLocation4}
                  testIdData="galleryLocation4"
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
