import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {Box, Typography} from '@mui/material';
import React from 'react';

import {welcomeStyles} from './styles';
import {forgotPasswordText} from './types';

export function ForgotPasswordWelcome() {
  return (
    <Box sx={welcomeStyles.introContainer}>
      <Box sx={welcomeStyles.textContainer}>
        <Box sx={welcomeStyles.headerContainer}>
          <Typography sx={welcomeStyles.header}>
            {forgotPasswordText.Headline}
          </Typography>
        </Box>
        {forgotPasswordText?.Field1 && (
          <Box sx={welcomeStyles.displayTextContainer}>
            <Box sx={{height: '100%'}}>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box>
              <Typography sx={welcomeStyles.typographyTitle}>
                {forgotPasswordText?.Field1}
              </Typography>
              <Typography sx={welcomeStyles.typography}>
                {forgotPasswordText?.Field1Subset}
              </Typography>
            </Box>
          </Box>
        )}

        {forgotPasswordText?.Field2 && (
          <Box sx={welcomeStyles.displayTextContainer}>
            <Box>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box>
              <Typography sx={welcomeStyles.typographyTitle}>
                {forgotPasswordText?.Field2}
              </Typography>
              <Typography sx={welcomeStyles.typography}>
                {forgotPasswordText?.Field2Subset}
              </Typography>
            </Box>
          </Box>
        )}
        {forgotPasswordText?.Field3 && (
          <Box sx={welcomeStyles.displayTextContainer}>
            <Box>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box>
              <Typography sx={welcomeStyles.typographyTitle}>
                {forgotPasswordText?.Field3}
              </Typography>
              <Typography sx={welcomeStyles.typography}>
                {forgotPasswordText?.Field3Subset}
              </Typography>
            </Box>
          </Box>
        )}
        {forgotPasswordText?.Field4 && (
          <Box sx={welcomeStyles.displayTextContainer}>
            <Box>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box>
              <Typography sx={welcomeStyles.typographyTitle}>
                {forgotPasswordText?.Field4}
              </Typography>
              <Typography sx={welcomeStyles.typography}>
                {forgotPasswordText?.Field4Subset}
              </Typography>
            </Box>
          </Box>
        )}
        {forgotPasswordText?.Footer && (
          <Box sx={welcomeStyles.footerContainer}>
            <Typography sx={welcomeStyles.footerText}>
              {forgotPasswordText.Footer}{' '}
              <a href={`mailto: ${forgotPasswordText.HelpEmail}`}>
                {forgotPasswordText.HelpEmail}
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
