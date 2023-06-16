import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {Box, Typography} from '@mui/material';
import React from 'react';

import {welcomeStyles} from '../styles';
import {DartaBenefits} from '../types';

export function SignUpWelcome({benefitsData}: {benefitsData: DartaBenefits}) {
  return (
    <Box sx={welcomeStyles.introContainer} data-testid="intro-container">
      <Box sx={welcomeStyles.textContainer} data-testid="text-container">
        {benefitsData?.Headline && (
          <Box
            sx={welcomeStyles.headerContainer}
            data-testid="header-container">
            <Typography sx={welcomeStyles.header} data-testid="header">
              {benefitsData.Headline}
            </Typography>
          </Box>
        )}
        {benefitsData?.Field1 && (
          <Box
            sx={welcomeStyles.displayTextContainer}
            data-testid="checkboxes-1">
            <Box data-testid="icon-box-1" sx={{height: '100%'}}>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-1">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-1">
                {benefitsData.Field1}
              </Typography>
              {/* <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-1">
                {benefitsData.Field1Subset}
              </Typography> */}
            </Box>
          </Box>
        )}

        {benefitsData?.Field2 && (
          <Box
            sx={welcomeStyles.displayTextContainer}
            data-testid="checkboxes-2">
            <Box data-testid="icon-box-2" sx={{height: '100%'}}>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-2">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-2">
                {benefitsData.Field2}
              </Typography>
              {/* <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-2">
                {benefitsData.Field2Subset}
              </Typography> */}
            </Box>
          </Box>
        )}
        {benefitsData?.Field3 && (
          <Box
            sx={welcomeStyles.displayTextContainer}
            data-testid="checkboxes-3">
            <Box data-testid="icon-box-3">
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-3" sx={{height: '100%'}}>
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-3">
                {benefitsData.Field3}
              </Typography>
              {/* <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-3">
                {benefitsData.Field3Subset}
              </Typography> */}
            </Box>
          </Box>
        )}
        {benefitsData?.Field4 && (
          <Box
            sx={welcomeStyles.displayTextContainer}
            data-testid="checkboxes-4">
            <Box data-testid="icon-box-4" sx={{height: '100%'}}>
              <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
            </Box>
            <Box data-testid="text-box-4">
              <Typography
                sx={welcomeStyles.typographyTitle}
                data-testid="typography-title-4">
                {benefitsData.Field4}
              </Typography>
              {/* <Typography
                sx={welcomeStyles.typography}
                data-testid="typography-subset-4">
                {benefitsData.Field4Subset}
              </Typography> */}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
