import React from 'react';
import {Typography, Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY, PRIMARY_MILK} from '../../../styles';
import {DartaBenefits} from './types';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '180vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:600px)': {
      padding: '10vh',
      flexDirection: 'row',
      height: '130vh',
    },

    boarderRadius: '30px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
    bottomBorder: '1px solid white',
  },
  header: {
    fontFamily: 'EB Garamond',
    alignText: 'center',
    color: PRIMARY_MILK,
    fontSize: '2rem',
    alignSelf: 'center',
    '@media (min-width:600px)': {
      fontSize: '2rem',
    },
  },
  introContainer: {
    flex: 4,
    height: '100%',
    backgroundColor: PRIMARY_BLUE,
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    '@media (min-width:600px)': {
      borderTopLeftRadius: '30px',
      borderBottomLeftRadius: '30px',
      borderTopRightRadius: '0px',
    },
  },
  textContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: '5%',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    alignText: 'center',
    color: PRIMARY_MILK,
    fontSize: '1.5rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:600px)': {
      fontSize: '1.2rem',
    },
  },
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  checkBoxes: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    gap: '2%',
  },
  icon: {
    color: 'blue',
    transition: 'color 3s',
    'icon.white': {
      color: 'white',
    },
  },
};

export function SignUpWelcome({benefitsData}: {benefitsData: DartaBenefits}) {
  return (
    <Box sx={styles.introContainer}>
      <Box sx={styles.textContainer}>
        {benefitsData?.Headline && (
          <Box sx={styles.headerContainer}>
            <Typography sx={styles.header}>{benefitsData.Headline}</Typography>
          </Box>
        )}
        {benefitsData?.Field1 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {benefitsData.Field1}
                </Typography>
                <Typography sx={styles.typography}>
                  {benefitsData.Field1Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {benefitsData?.Field2 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {benefitsData.Field2}
                </Typography>
                <Typography sx={styles.typography}>
                  {benefitsData.Field2Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {benefitsData?.Field3 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {benefitsData.Field3}
                </Typography>
                <Typography sx={styles.typography}>
                  {benefitsData.Field3Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {benefitsData?.Field4 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {benefitsData.Field4}
                </Typography>
                <Typography sx={styles.typography}>
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
