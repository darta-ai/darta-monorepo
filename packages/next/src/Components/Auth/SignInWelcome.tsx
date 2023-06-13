import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {Box, Typography} from '@mui/material';
import * as React from 'react';

import {welcomeStyles} from './styles';
import {AuthEnum, WelcomeBack} from './types';

export function SignInWelcome({
  welcomeBackData,
  signInType,
}: {
  welcomeBackData: WelcomeBack;
  signInType: AuthEnum;
}) {
  return (
    <Box sx={welcomeStyles.introContainer} data-testid="intro-container">
      <Box sx={welcomeStyles.textContainer} data-testid="text-container">
        {welcomeBackData?.Headline && (
          <Box
            sx={welcomeStyles.headerContainer}
            data-testid="header-container">
            <Typography sx={welcomeStyles.header} data-testid="header">
              {welcomeBackData.Headline}
            </Typography>
          </Box>
        )}
        {welcomeBackData?.Field1 && (
          <Box sx={welcomeStyles.checkBoxes} data-testid="checkboxes-1">
            <Box data-testid="icon-box-1">
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-1">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-1">
                {welcomeBackData.Field1}
              </Typography>
              <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-1">
                {welcomeBackData.Field1Subset}
              </Typography>
            </Box>
          </Box>
        )}

        {welcomeBackData?.Field2 && (
          <Box sx={welcomeStyles.checkBoxes} data-testid="checkboxes-2">
            <Box data-testid="icon-box-2">
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-2">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-2">
                {welcomeBackData.Field2}
              </Typography>
              <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-2">
                {welcomeBackData.Field2Subset}
              </Typography>
            </Box>
          </Box>
        )}
        {welcomeBackData?.Field3 && (
          <Box sx={welcomeStyles.checkBoxes} data-testid="checkboxes-3">
            <Box data-testid="icon-box-3">
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-3">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-3">
                {welcomeBackData.Field3}
              </Typography>
              <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-3">
                {welcomeBackData.Field3Subset}
              </Typography>
            </Box>
          </Box>
        )}
        {welcomeBackData?.Field4 && (
          <Box sx={welcomeStyles.checkBoxes} data-testid="checkboxes-4">
            <Box data-testid="icon-box-4">
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-4">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-4">
                {welcomeBackData.Field4}
              </Typography>
              <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-4">
                {welcomeBackData.Field4Subset}
              </Typography>
            </Box>
          </Box>
        )}
        {welcomeBackData?.Footer && (
          <Box
            sx={welcomeStyles.footerContainer}
            data-testid="footer-container">
            <Typography sx={welcomeStyles.footerText} data-testid="footer-text">
              {welcomeBackData.Footer}{' '}
              <a
                href={`mailto: ${welcomeBackData.HelpEmail}+${signInType}@darta.works`}
                data-testid="help-email-link">
                {welcomeBackData.HelpEmail}
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
