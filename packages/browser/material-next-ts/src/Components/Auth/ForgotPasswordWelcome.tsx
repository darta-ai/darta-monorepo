import React from 'react';
import {Typography, Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY, PRIMARY_MILK} from '../../../styles';
import {forgotPasswordText} from './types';
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
      height: '100vh',
    },

    boarderRadius: '30px',
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
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
    bottomBorder: '1px solid white',
  },
  textContainer: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: '5%',
  },
  welcomeBackContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
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
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '10%',
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
  footerText: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_MILK,
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

export function ForgotPasswordWelcome() {
  return (
    <Box sx={styles.introContainer}>
      <Box sx={styles.textContainer}>
        <Box sx={styles.headerContainer}>
          <Typography sx={styles.header}>
            {forgotPasswordText.Headline}
          </Typography>
        </Box>
        {forgotPasswordText?.Field1 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {forgotPasswordText?.Field1}
                </Typography>
                <Typography sx={styles.typography}>
                  {forgotPasswordText?.Field1Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {forgotPasswordText?.Field2 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {forgotPasswordText?.Field2}
                </Typography>
                <Typography sx={styles.typography}>
                  {forgotPasswordText?.Field2Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {forgotPasswordText?.Field3 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {forgotPasswordText?.Field3}
                </Typography>
                <Typography sx={styles.typography}>
                  {forgotPasswordText?.Field3Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {forgotPasswordText?.Field4 && (
          <>
            <Box sx={styles.checkBoxes}>
              <Box>
                <KeyboardDoubleArrowRightIcon
                  sx={{transform: 'scale(1.5)', color: PRIMARY_MILK}}
                />
              </Box>
              <Box>
                <Typography sx={styles.typographyTitle}>
                  {forgotPasswordText?.Field4}
                </Typography>
                <Typography sx={styles.typography}>
                  {forgotPasswordText?.Field4Subset}
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {forgotPasswordText?.Footer && (
          <Box sx={styles.footerContainer}>
            <Typography sx={styles.footerText}>
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
