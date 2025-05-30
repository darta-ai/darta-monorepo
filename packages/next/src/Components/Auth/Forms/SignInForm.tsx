/* eslint-disable react/jsx-props-no-spreading */
import {yupResolver} from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {dartaSignIn} from '../../../API/FirebaseAccountManagement';
import {DartaErrorAlert} from '../../Modals';
import {ForgotPassword, NeedAnAccount} from '../../Navigation/Auth';
import {authStyles} from '../styles';
import {AuthEnum} from '../types';

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
    password: yup
      .string()
      .min(8, 'password must be at least 8 characters')
      .required(),
  })
  .required();

export function SignInForm({signInType}: {signInType: AuthEnum}) {
  const router = useRouter();
  const [errorAlertOpen, setErrorAlertOpen] = React.useState<boolean>(false);
  const [firebaseError, setFirebaseError] = useState<string>('');
  const [isSigningIn, setIsSingingIn] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const handleSignIn = async (data: any) => {
    setIsSingingIn(true);
    try {
      const {
        error,
        user,
        errorMessage,
      }: {error: any; user: any; errorMessage: string} = await dartaSignIn(
        data,
        signInType,
      );
      if (error) {
        setFirebaseError(errorMessage);
      } else if (user?.displayName) {
        router.push(`/${user?.displayName}/Profile`);
      } else {
        router.push(`/`);
      }
    } catch (error) {
      setErrorAlertOpen(true);
    }
    setIsSingingIn(false);
  };

  const [togglePasswordView, setTogglePasswordView] = useState<boolean>(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  // TODO: this is dead
  const handleEnter = async (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(handleSignIn);
    }
  };

  return (
    <Box sx={authStyles.signInContainer} data-testid="signin-container">
      <Box
        sx={authStyles.signInFieldContainer}
        data-testid="signin-field-container">
        <FormControl
          variant="outlined"
          required
          data-testid="signin-email-formcontrol">
          <InputLabel
            htmlFor="outlined-adornment-password"
            data-testid="signin-email-inputlabel">
            email
          </InputLabel>
          <Input
            error={!!errors?.email?.message}
            {...register('email')}
            id="email"
            aria-describedby="email"
            color="info"
            required
            data-testid="signin-email-input"
          />
          <FormHelperText
            id="phoneHelperText"
            sx={authStyles.warningText}
            data-testid="signin-email-formhelpertext">
            {errors?.email?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl
          variant="outlined"
          required
          data-testid="signin-password-formcontrol">
          <InputLabel
            htmlFor="outlined-adornment-password"
            data-testid="signin-password-inputlabel">
            password
          </InputLabel>
          <Input
            id="outlined-adornment-password"
            type={togglePasswordView ? 'text' : 'password'}
            {...register('password')}
            error={!!errors?.password?.message}
            color="info"
            onKeyPress={handleEnter}
            data-testid="signin-password-input"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setTogglePasswordView(!togglePasswordView)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  data-testid="signin-password-iconbutton">
                  {togglePasswordView ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        {firebaseError && (
          <FormHelperText
            id="phoneHelperText"
            sx={authStyles.warningTextLarge}
            data-testid="signin-firebaseerror-formhelpertext">
            {firebaseError as string}
          </FormHelperText>
        )}
        <Button
          onClick={handleSubmit(handleSignIn)}
          variant="contained"
          color="primary"
          type="submit"
          sx={{alignSelf: 'center', margin: '2vh', width: '20vw'}}
          data-testid="signUpButton">
          {isSigningIn ? (
            <CircularProgress size={24} color="secondary" />
          ) : (
            <Typography sx={{fontWeight: 'bold'}}>Sign In</Typography>
          )}
        </Button>
        <Box data-testid="signin-links-box">
          <ForgotPassword
            routeType={signInType}
            data-testid="signin-forgotpassword-link"
          />
          <NeedAnAccount
            routeType={signInType}
            data-testid="signin-needanaccount-link"
          />
        </Box>
      </Box>
      <DartaErrorAlert
        errorAlertOpen={errorAlertOpen}
        setErrorAlertOpen={setErrorAlertOpen}
      />
    </Box>
  );
}
