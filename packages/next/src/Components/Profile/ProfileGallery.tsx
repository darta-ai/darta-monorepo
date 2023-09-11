import {Box, Divider, Typography, Button} from '@mui/material';
import Image from 'next/image';
import React from 'react';

import {IGalleryProfileData} from "@darta/types"
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../styles';
import {phoneNumberConverter} from '../../common/utils/phoneNumberConverter';
import {GalleryLocationComponent} from './Components/GalleryLocationText';
import {profileStyles} from './Components/profileStyles';
import { AuthContext } from 'packages/next/pages/_app';
import { resendEmailVerification } from '../../ThirdPartyAPIs/firebaseApp';

function GalleryStatus({
  galleryProfileData,
}: {
  galleryProfileData: IGalleryProfileData;
}) {
  const {user} = React.useContext(AuthContext);
  const [isResent, setIsResent] = React.useState(false)
  const resendEmail = async () => {
    console.log({user})
    try{
      await resendEmailVerification()
      setIsResent(true)
    } catch (error){
      // TO-DO: error handling
    }
  }
  if (!user.emailVerified){
    return (
      <Box data-testid="gallery-under-review">
        <Typography variant="h3" sx={{color: 'red', textAlign: 'center'}}>
          Please verify your email
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{mx: 3}}>
            <Typography>
              Please check your inbox for an email confirmation. 
            </Typography>
          </Box>
          <Box sx={{mx: 3, my: 3}}>
              <Button
              variant="contained"
              disabled={isResent}
              sx={{
                backgroundColor: PRIMARY_BLUE,
                color: PRIMARY_MILK,
                alignSelf: 'center',
              }}
              onClick={() => {
                resendEmail()
              }}
              >
                {isResent ?
                (<Typography sx={{fontWeight: 'bold'}}>Email Sent!</Typography>)  
                :
                (<Typography sx={{fontWeight: 'bold'}}>Re-send email confirmation</Typography>)
              }
                
              </Button>
          </Box>
          <Box sx={{mx: 3, my: 3}}>
          <Typography>          
              After you have confirmed your email, please refresh this page. 
            </Typography>
            </Box>
            <Box sx={{mx: 3, my: 3}}>
            <Typography>
              With questions, please reach out to us at{' '}
              <a href="mailto:info@darta.works">info@darta.works</a>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  else if (!galleryProfileData?.isValidated) {
    return (
      <Box data-testid="gallery-under-review">
        <Typography variant="h4" sx={{color: 'red', textAlign: 'center'}}>
          Gallery Under Review
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{m: 3}}>
            <Typography>
              We do basic quality assurance of all galleries on the platform to
              ensure the end user gets the best possible experience.
            </Typography>
          </Box>
          <Box sx={{m: 3}}>
            <Typography>
              We will reach out to you via the email you have provided when it is
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
  } else if (galleryProfileData?.galleryBio?.value) {
    return (
      <Box>
        <Typography
          variant="h4"
          data-testid="gallery-name-display"
          sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
          {galleryProfileData?.galleryName?.value}
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{m: 2}}>
            <Typography data-testid="gallery-bio-display">
              {galleryProfileData?.galleryBio?.value}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  } else if (galleryProfileData?.galleryName?.value) {
    return (
      <Box data-testid="gallery-start-editing">
        <Typography
          variant="h4"
          sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
          {galleryProfileData?.galleryName?.value}
        </Typography>
        <Typography
          variant="h6"
          sx={{color: PRIMARY_BLUE, textAlign: 'center'}}>
          Click EDIT to get started.
        </Typography>
        <Box sx={profileStyles.profile.galleryBioStyles}>
          <Box sx={{mx: 3}}>
            <Typography>
              This will be your gallery bio. Click EDIT to get started.
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
  } else if (galleryProfileData?.galleryName?.value) {
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
              This will be your gallery bio. Click EDIT to get started.
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

export function ProfileGallery({
  galleryProfileData,
}: {
  galleryProfileData: IGalleryProfileData;
}) {
  let png;
  try {
    // eslint-disable-next-line global-require
    png = require(`../../../public/static/images/dartahouse.png`);
  } catch (e) {
    png = null;
  }
  return (
    <Box
      my={5}
      sx={profileStyles.container}
      data-testid="profile-gallery-container">
      <Box sx={profileStyles.profile.galleryInfoContainer}>
        <Box sx={profileStyles.profile.galleryHeaderContainer}>
          <Box
            sx={profileStyles.profile.imageBox}
            data-testid="profile-gallery-image-box">
            {galleryProfileData?.galleryLogo?.value ? (
              <Box>
                <img
                  src={galleryProfileData?.galleryLogo?.value}
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
            <Typography
              variant="h5"
              sx={{textAlign: 'left'}}
              data-testid="profile-contact-display">
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
                data-testid="profile-contact-email"
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
                <Typography
                  data-testid="profile-contact-phone"
                  sx={{textAlign: 'center', my: '1vh'}}>
                  {phoneNumberConverter(
                    galleryProfileData?.galleryPhone?.value,
                  )}
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
                <Typography
                  sx={{textAlign: 'center', my: '1vh'}}
                  data-testid="profile-contact-website">
                  {galleryProfileData?.galleryWebsite?.value ? (
                    <a
                      target="_blank"
                      href={galleryProfileData?.galleryWebsite?.value}
                      rel="noreferrer">
                      {galleryProfileData?.galleryWebsite?.value
                        .replace('http://www.', '')
                        .replace('http:/www.', '')
                        .replace('https:/', '')
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
                <Typography
                  sx={{textAlign: 'center', my: '1vh'}}
                  data-testid="profile-contact-instagram">
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
          <Box sx={{display: 'flex', width: '100%', flexDirection: 'column', gap: '1vh'}}>
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
  );
}
