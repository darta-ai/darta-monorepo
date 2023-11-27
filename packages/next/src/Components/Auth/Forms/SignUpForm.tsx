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
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {dartaSignUp} from '../../../API/FirebaseAccountManagement';
import {createGalleryUser} from '../../../API/users/userRoutes';
import {DartaErrorAlert} from '../../Modals';
import {AlreadySignedUp} from '../../Navigation/Auth';
import {authStyles} from '../styles';
import {AuthEnum} from '../types';

const websiteRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
    galleryName: yup.string().required('please include a gallery name'),
    password: yup
      .string()
      .min(8, 'password must be at least 8 characters')
      .required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'passwords must match')
      .required('please confirm your password'),
    website: yup
      .string()
      .required('please include your gallery website')
      .matches(websiteRegExp, {
        message: 'please double check your website url',
        excludeEmptyString: true,
      }),
  })
  .required();

export function SignUpForm({signUpType}: {signUpType: AuthEnum}) {
  const router = useRouter();
  const [errorAlertOpen, setErrorAlertOpen] = React.useState<boolean>(false);
  const [firebaseError, setFirebaseError] = React.useState<string>('');
  const [executeSignUp, setExecuteSignUp] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const handleSignUp = async (data: any) => {
    setExecuteSignUp(true);
    const submitMe = async () => {
      try {
        const {error, user, errorMessage} = await dartaSignUp(data);
        if (error) {
          setFirebaseError(errorMessage);
        } else if (user?.displayName) {
          try {
            await createGalleryUser({
              galleryName: {value: data?.galleryName},
              signUpWebsite: data?.website,
              phoneNumber: data?.phoneNumber,
              email: data?.email,
            });
            router.push(`/${signUpType}/Profile`);
          } catch (err: any) {
            setErrorAlertOpen(true);
          }
        } else {
          setErrorAlertOpen(true);
          router.push(`/`);
        }
      } catch (e: any) {
        setErrorAlertOpen(true);
        setFirebaseError('Something went wrong. Please try again.');
      }
    };
    submitMe();
    setExecuteSignUp(false);
  };

  const [togglePasswordView, setTogglePasswordView] =
    React.useState<boolean>(false);
  const [toggleConfirmPasswordView, setToggleConfirmPasswordView] =
    React.useState<boolean>(false);

  const [emailInput, setEmailInput] = React.useState<string | undefined>('');
  const [emailError, setEmailError] = React.useState<string | undefined>('');
  const [isGmail, setIsGmail] = React.useState<boolean>(false);

  React.useEffect(() => {
    const regex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/g;
    if (emailInput?.match(regex)) {
      setEmailError(
        'darta is not supporting @gmail email addresses at this time. Please use the domain of your gallery.',
      );
      setIsGmail(true);
    } else {
      setEmailError('');
      setIsGmail(false);
    }
  }, [emailInput]);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Box sx={authStyles.signInContainer} data-testid="signInContainer">
      <Box
        sx={authStyles.signInFieldContainer}
        data-testid="signInFieldContainer">
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">
            gallery name
          </InputLabel>
          <Input
            error={!!errors?.phoneNumber?.message}
            {...register('galleryName')}
            id="galleryName"
            color="info"
            aria-describedby="galleryName"
            data-testid="galleryNameInput"
          />
          <FormHelperText
            id="galleryNameHelperText"
            data-testid="galleryName-helper-text"
            sx={authStyles.warningText}>
            {errors?.galleryName?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-website">website</InputLabel>
          <Input
            error={!!errors?.website?.message}
            {...register('website')}
            id="website"
            color="info"
            aria-describedby="website"
            data-testid="websiteInput"
            required
          />
          <FormHelperText id="phoneHelperText" sx={authStyles.warningText}>
            {errors?.website?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-email">email</InputLabel>
          <Input
            error={!!errors?.email?.message}
            {...register('email')}
            id="email"
            aria-describedby="email"
            color="info"
            data-testid="emailInput"
            onChange={event => {
              setEmailInput(event.target.value);
            }}
          />
          <FormHelperText
            id="emailHelperText"
            data-testid="emailInput-helper-text"
            sx={authStyles.warningText}>
            {(errors?.email?.message as string) || emailError}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">
            password
          </InputLabel>
          <Input
            id="outlined-adornment-password"
            type={togglePasswordView ? 'text' : 'password'}
            {...register('password')}
            error={!!errors?.password?.message}
            color="info"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setTogglePasswordView(!togglePasswordView)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  data-testid="passwordToggleButton">
                  {togglePasswordView ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            data-testid="passwordInput"
          />
          <FormHelperText
            data-testid="password-helper-text"
            id="phoneHelperText"
            sx={authStyles.warningText}>
            {errors?.password?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-confirm-password">
            confirm password
          </InputLabel>
          <Input
            id="outlined-adornment-confirm-password"
            type={toggleConfirmPasswordView ? 'text' : 'password'}
            error={!!errors?.password?.message}
            {...register('confirmPassword')}
            aria-describedby="confirmPassword"
            color="info"
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setToggleConfirmPasswordView(!toggleConfirmPasswordView)
                  }
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  data-testid="confirmPasswordToggleButton">
                  {toggleConfirmPasswordView ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            }
            data-testid="confirmPasswordInput"
          />
          <FormHelperText
            id="confirmPasswordHelperText"
            data-testid="password-confirm-helper-text"
            sx={authStyles.warningText}>
            {errors?.confirmPassword?.message as string}
          </FormHelperText>
        </FormControl>
        {firebaseError && (
          <FormHelperText
            id="websiteHelperText"
            data-testid="website-helper-text"
            sx={authStyles.warningTextLarge}>
            {firebaseError as string}
          </FormHelperText>
        )}
        <Button
          onClick={handleSubmit(handleSignUp)}
          variant="contained"
          color="primary"
          type="submit"
          disabled={isGmail}
          sx={{alignSelf: 'center', margin: '2vh', width: '20vw'}}
          data-testid="signUpButton">
          {executeSignUp ? (
            <CircularProgress size={24} color="secondary" />
          ) : (
            <Typography sx={{fontWeight: 'bold'}}>Sign Up</Typography>
          )}
        </Button>
        <AlreadySignedUp routeType={signUpType} />
      </Box>
      <DartaErrorAlert
        errorAlertOpen={errorAlertOpen}
        setErrorAlertOpen={setErrorAlertOpen}
      />
    </Box>
  );
}
