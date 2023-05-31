import React from 'react';
import {Typography, Box} from '@mui/material';
import {AuthEnum, WelcomeBack} from './types';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {welcomeStyles} from './styles';

export function SignInWelcome({
  welcomeBackData,
  signInType,
}: {
  welcomeBackData: WelcomeBack;
  signInType: AuthEnum;
}) {
  return (
    <Box sx={welcomeStyles.introContainer}>
      <Box sx={welcomeStyles.textContainer}>
        {welcomeBackData?.Headline && (
          <Box sx={welcomeStyles.headerContainer}>
            <Typography sx={welcomeStyles.header}>
              {welcomeBackData.Headline}
            </Typography>
          </Box>
        )}
        {welcomeBackData?.Field1 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {welcomeBackData.Field1}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {welcomeBackData.Field1Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {welcomeBackData?.Field2 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {welcomeBackData.Field2}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {welcomeBackData.Field2Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {welcomeBackData?.Field3 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {welcomeBackData.Field3}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {welcomeBackData.Field3Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {welcomeBackData?.Field4 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {welcomeBackData.Field4}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {welcomeBackData.Field4Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {welcomeBackData?.Footer && (
          <Box sx={welcomeStyles.footerContainer}>
            <Typography sx={welcomeStyles.footerText}>
              {welcomeBackData.Footer}{' '}
              <a
                href={`mailto: ${welcomeBackData.HelpEmail}+${signInType}@darta.works`}>
                {welcomeBackData.HelpEmail}
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
