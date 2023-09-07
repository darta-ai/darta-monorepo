/* eslint-disable react/jsx-props-no-spreading */
import {yupResolver} from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {dartaSignUp} from '../../../API/FirebaseAccountManagement';
import {PhoneNumberFormat} from '../../FormComponents/DartaPhoneNumber';
import {AlreadySignedUp} from '../../Navigation/Auth';
import {authStyles} from '../styles';
import {AuthEnum} from '../types';
import { createGalleryUser } from 'packages/next/src/API/users/userRoutes';

const websiteRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
    phoneNumber: yup
      .string()
      .min(10, 'please double check your phone number')
      .optional(),
    galleryName: yup
      .string()
      .required(
        'please include a gallery name',
      ),
    password: yup
      .string()
      .min(8, 'password must be at least 8 characters')
      .required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'passwords must match')
      .required('please confirm your password'),
    website: yup.string().required('please include your gallery website').matches(websiteRegExp, {
      message: 'please double check your website url',
      excludeEmptyString: true,
    }),
  })
  .required();

export function SignUpForm({signUpType}: {signUpType: AuthEnum}) {
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const handleSignUp = async (data: any) => {
    const submitMe = async () => {
      try {
        const {error, user, errorMessage} = await dartaSignUp(data, signUpType);
        if (error) {
          setFirebaseError(errorMessage);
        } else if (user?.displayName) {
          await createGalleryUser({
            galleryName: { value: data?.galleryName}, 
            signUpWebsite: data?.website, 
            phoneNumber: data?.phoneNumber, 
            email: data?.email
          })
          router.push(`/${signUpType}/Profile`);
        } else {
          // router.push(`/`);
        }
      } catch (e: any) {
        console.log(e)
        setFirebaseError('Something went wrong. Please try again.');
      }
    };
    submitMe();
  };

  const [togglePasswordView, setTogglePasswordView] = useState<boolean>(false);
  const [toggleConfirmPasswordView, setToggleConfirmPasswordView] =
    useState<boolean>(false);

  const [emailInput, setEmailInput] = useState<string | undefined>('');
  const [emailError, setEmailError] = useState<string | undefined>('');

  React.useEffect(() => {
    const regex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/g;
    if (emailInput?.match(regex)) {
      setEmailError(
        'Using an @gmail account to register will result in a longer to approve. If you have a business email address related to this gallery and your gallery is on the pre-approved list, you will automatically be authorized.',
      );
    } else {
      setEmailError('');
    }
  }, [emailInput]);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const [phoneNumber, setPhoneNumber] = React.useState('');

  const handlePhoneChange = (event: any) => {
    setPhoneNumber(event.target.value);
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
          <InputLabel htmlFor="outlined-adornment-phone">
            phone number
          </InputLabel>
          <Input
            error={!!errors?.phoneNumber?.message}
            {...register('phoneNumber')}
            id="phoneNumber"
            color="info"
            aria-describedby="phoneNumber"
            data-testid="phoneNumberInput"
            value={phoneNumber}
            onChange={handlePhoneChange}
            inputComponent={PhoneNumberFormat}
          />
          <FormHelperText
            id="phoneHelperText"
            data-testid="phoneNumber-helper-text"
            sx={authStyles.warningText}>
            {errors?.phoneNumber?.message as string}
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
        {!errors?.password?.message && (
          <FormHelperText id="phoneHelperText" sx={authStyles.formHelperText}>
            For account management purposes.
          </FormHelperText>
        )}
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
          sx={{alignSelf: 'center', margin: '2vh'}}
          data-testid="signUpButton">
          Sign Up
        </Button>
        <AlreadySignedUp routeType={signUpType} />
      </Box>
    </Box>
  );
}
