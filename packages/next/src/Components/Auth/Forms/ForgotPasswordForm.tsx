/* eslint-disable react/jsx-props-no-spreading */
import {yupResolver} from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {dartaForgotPassword} from '../../../API/FirebaseAccountManagement';
import {GoToSignIn, NeedAnAccount} from '../../Navigation/Auth';
import {authStyles} from '../styles';
import {AuthEnum} from '../types';

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
  })
  .required();

export function ForgotPasswordForm({
  forgotPasswordType,
}: {
  forgotPasswordType: AuthEnum;
}) {
  const [firebaseError, setFirebaseError] = React.useState<string>('');
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const handleForgotPassword = async (data: any) => {
    try {
      const results = await dartaForgotPassword(data);
      if (results) {
        const {success, errorMessage} = results;
        if (!success) {
          setFirebaseError(errorMessage);
        } else {
          setShowSuccess(true);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <Box sx={authStyles.signInContainer}>
      {!showSuccess ? (
        <Box sx={authStyles.signInFieldContainer}>
          <TextField
            variant="standard"
            error={!!errors?.email?.message}
            helperText={errors?.email?.message as string}
            label="email"
            {...register('email')}
            id="email"
            aria-describedby="email"
            required
          />
          {firebaseError && (
            <FormHelperText
              id="phoneHelperText"
              sx={authStyles.warningTextLarge}>
              {firebaseError as string}
            </FormHelperText>
          )}
          <Button
            onClick={handleSubmit(handleForgotPassword)}
            variant="contained"
            color="primary"
            sx={{alignSelf: 'center', margin: '2vh'}}>
            Reset Password
          </Button>
          <NeedAnAccount routeType={forgotPasswordType} />
        </Box>
      ) : (
        <Box sx={authStyles.signInFieldContainer}>
          <Typography sx={authStyles.typographyTitle}>
            Check your inbox for a password reset link
          </Typography>
          <GoToSignIn routeType={forgotPasswordType} />
        </Box>
      )}
    </Box>
  );
}
