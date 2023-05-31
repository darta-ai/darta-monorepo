import React from 'react';
import {Typography, Box} from '@mui/material';
import {DartaBenefits} from './types';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {welcomeStyles} from './styles';

export function SignUpWelcome({benefitsData}: {benefitsData: DartaBenefits}) {
  return (
    <Box sx={welcomeStyles.introContainer}>
      <Box sx={welcomeStyles.textContainer}>
        {benefitsData?.Headline && (
          <Box sx={welcomeStyles.headerContainer}>
            <Typography sx={welcomeStyles.header}>
              {benefitsData.Headline}
            </Typography>
          </Box>
        )}
        {benefitsData?.Field1 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {benefitsData.Field1}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {benefitsData.Field1Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {benefitsData?.Field2 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {benefitsData.Field2}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {benefitsData.Field2Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {benefitsData?.Field3 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {benefitsData.Field3}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {benefitsData.Field3Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {benefitsData?.Field4 && (
          <>
            <Box sx={welcomeStyles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon sx={welcomeStyles.actionArrow} />
              </Box>
              <Box>
                <Typography sx={welcomeStyles.typographyTitle}>
                  {benefitsData.Field4}
                </Typography>
                <Typography sx={welcomeStyles.typography}>
                  {benefitsData.Field4Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
