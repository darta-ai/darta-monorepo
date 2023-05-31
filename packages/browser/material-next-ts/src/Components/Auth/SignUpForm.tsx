import React, {useState} from 'react';
import {Box} from '@mui/material';
import {
  FormHelperText,
  Button,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
} from '@mui/material';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AlreadySignedUp} from '../Navigation/Auth';
import {AuthEnum} from './types';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {dartaSignUp} from '../../../API/AccountManagement';
import {useRouter} from 'next/router';
import {authStyles} from './styles';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const websiteRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

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
    website: yup.string().optional().matches(websiteRegExp, {
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
          router.push(`/${signUpType}/Home`);
        } else {
          router.push(`/`);
        }
      } catch (e: any) {
        setFirebaseError('Something went wrong. Please try again.');
      }
    };
    submitMe();
  };

  const [togglePasswordView, setTogglePasswordView] = useState<boolean>(false);
  const [toggleConfirmPasswordView, setToggleConfirmPasswordView] =
    useState<boolean>(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Box sx={authStyles.signInContainer}>
      <Box sx={authStyles.signInFieldContainer}>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">email</InputLabel>
          <Input
            error={errors?.email?.message ? true : false}
            {...register('email')}
            id="email"
            aria-describedby="email"
            color="info"
            required
          />
          <FormHelperText id="phoneHelperText" sx={authStyles.warningText}>
            {errors?.email?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">
            phone number
          </InputLabel>
          <Input
            error={errors?.phoneNumber?.message ? true : false}
            {...register('phoneNumber')}
            id="phoneNumber"
            color="info"
            aria-describedby="phoneNumber"
          />
          <FormHelperText id="phoneHelperText" sx={authStyles.warningText}>
            {errors?.phoneNumber?.message as string}
          </FormHelperText>
        </FormControl>
        {!errors?.password?.message && (
          <FormHelperText id="phoneHelperText" sx={authStyles.formHelperText}>
            For account management purposes.
          </FormHelperText>
        )}
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">
            password
          </InputLabel>
          <Input
            id="outlined-adornment-password"
            type={togglePasswordView ? 'text' : 'password'}
            {...register('password')}
            error={errors?.password?.message ? true : false}
            color="info"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setTogglePasswordView(!togglePasswordView)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {togglePasswordView ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="phoneHelperText" sx={authStyles.warningText}>
            {errors?.email?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-confirm-password">
            confirm password
          </InputLabel>
          <Input
            id="outlined-adornment-confirm-password"
            type={toggleConfirmPasswordView ? 'text' : 'password'}
            error={errors?.password?.message ? true : false}
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
                  edge="end">
                  {togglePasswordView ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="phoneHelperText" sx={authStyles.warningText}>
            {errors?.confirmPassword?.message as string}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">website</InputLabel>
          <Input
            error={errors?.website?.message ? true : false}
            {...register('website')}
            id="website"
            color="info"
            aria-describedby="website"
          />
          <FormHelperText id="phoneHelperText" sx={authStyles.warningText}>
            {errors?.website?.message as string}
          </FormHelperText>
        </FormControl>
        {firebaseError && (
          <FormHelperText id="phoneHelperText" sx={authStyles.warningTextLarge}>
            {firebaseError as string}
          </FormHelperText>
        )}
        <Button
          onClick={handleSubmit(handleSignUp)}
          variant="contained"
          color="primary"
          type="submit"
          sx={{alignSelf: 'center', margin: '2vh'}}>
          Sign Up
        </Button>
        <AlreadySignedUp routeType={signUpType} />
      </Box>
    </Box>
  );
}
