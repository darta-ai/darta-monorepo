import React, {useEffect} from 'react';
import {Typography, Box} from '@mui/material';
import {
  PRIMARY_BLUE,
  PRIMARY_DARK_BLUE,
  PRIMARY_DARK_GREY,
  PRIMARY_MILK,
} from '../../styles';
import Image from 'next/image';
import {TextField, FormHelperText, Button} from '@mui/material';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AuthEnum, BenefitsFields} from '../../src/Components/Auth/types';
import {SignUpComponent} from '../../src/Components/Auth/SignUp';
import {getBenefits} from '../../frontendFirebase/firebaseDB';
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
  signInContainer: {
    flex: 3,
    border: '1px solid',
    borderColor: PRIMARY_BLUE,
    height: '100%',
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    '@media (min-width:600px)': {
      borderTopRightRadius: '30px',
      borderBottomRightRadius: '30px',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
  },
  signInFieldContainer: {
    margin: '10px',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: '3vh',
    alignContent: 'center',
    '@media (min-width:600px)': {
      gap: '2vh',
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
    phoneNumber: yup
      .string()
      .matches(phoneRegExp, 'please double check your phone number')
      .optional(),
    password: yup
      .string()
      .min(8, 'password must be at least 8 characters')
      .required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'passwords must match')
      .required('please confirm your password'),
    website: yup.string().url().optional(),
  })
  .required();

GallerySignUp.getInitialProps = async () => {
  const benefitsData = await getBenefits(AuthEnum.galleries);
  return {benefitsData};
};

export default function GallerySignUp({
  benefitsData,
}: {
  benefitsData: BenefitsFields;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const onSubmit = (data: any) => console.log(data);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.introContainer}>
        <Box sx={styles.textContainer}>
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
        </Box>
      </Box>
      <SignUpComponent signUpType={AuthEnum.galleries} />
    </Box>
  );
}
