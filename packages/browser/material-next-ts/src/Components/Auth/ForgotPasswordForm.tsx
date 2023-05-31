import React from 'react';
import {Box} from '@mui/material';
import {TextField, FormHelperText, Button, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AuthEnum} from './types';
import {GoToSignIn} from '../Navigation/Auth';
import {dartaForgotPassword} from '../../../API/AccountManagement';
import {authStyles} from './styles';

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
    watch,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const handleForgotPassword = async (data: any) => {
    try {
      const {success, errorMessage} = await dartaForgotPassword(data);
      if (!success) {
        setFirebaseError(errorMessage);
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!showSuccess) {
    return (
      <Box sx={authStyles.signInContainer}>
        <Box sx={authStyles.signInFieldContainer}>
          <TextField
            variant="standard"
            error={errors?.email?.message ? true : false}
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
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={authStyles.signInContainer}>
        <Box sx={authStyles.signInFieldContainer}>
          <Typography sx={authStyles.typographyTitle}>
            Check your inbox for a password reset link
          </Typography>
          <GoToSignIn routeType={forgotPasswordType} />
        </Box>
      </Box>
    );
  }
}
