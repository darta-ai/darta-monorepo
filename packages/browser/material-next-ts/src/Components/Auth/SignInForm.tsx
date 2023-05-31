import React, {useState} from 'react';
import {Box} from '@mui/material';
import {PRIMARY_BLUE} from '../../../styles';
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
import {AuthEnum} from './types';
import {NeedAnAccount, ForgotPassword} from '../Navigation/Auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {dartaSignIn} from '../../../API/AccountManagement';
import {useRouter} from 'next/router';

const signUpStyles = {
  signInContainer: {
    flex: 3,
    border: '1px solid',
    borderColor: PRIMARY_BLUE,
    height: '100%',
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    '@media (min-width: 800px)': {
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
    width: '95%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: '3vh',
    alignContent: 'center',
    '@media (min-width: 800px)': {
      gap: '2vh',
    },
  },
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  warningText: {
    alignSelf: 'left',
    fontSize: 12,
    color: 'red',
  },
  warningTextLarge: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
  },
};

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
  const [firebaseError, setFirebaseError] = useState<string>('');
  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const handleSignIn = async (data: any) => {
    console.log('here');
      try {
        const {error, user, errorMessage} = await dartaSignIn(data, signInType);
        if (error) {
          setFirebaseError(errorMessage);
        } else if (user?.displayName) {
          router.push(`/${user?.displayName}/Home`);
        } else {
          router.push(`/`);
        }
      } catch (error) {
        console.log(error);
      }
  };

  const [togglePasswordView, setTogglePasswordView] = useState<boolean>(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleEnter = async (event: any) => {
    console.log('triggered')
    if (event.key === 'Enter') {
      event.preventDefault();
      const values = getValues();
      handleSubmit(handleSignIn);
      return
    }
  };

  return (
    <Box sx={signUpStyles.signInContainer}>
      <Box sx={signUpStyles.signInFieldContainer}>
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
          <FormHelperText id="phoneHelperText" sx={signUpStyles.warningText}>
            {errors?.email?.message as string}
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
            error={errors?.password?.message ? true : false}
            color="info"
            onKeyPress={handleEnter}
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
        </FormControl>
        {firebaseError && (
          <FormHelperText
            id="phoneHelperText"
            sx={signUpStyles.warningTextLarge}>
            {firebaseError as string}
          </FormHelperText>
        )}
        <Button
          onClick={handleSubmit(handleSignIn)}
          variant="contained"
          color="primary"
          type="submit"
          sx={{alignSelf: 'center', margin: '2vh'}}>
          Sign In
        </Button>
        <Box>
          <ForgotPassword routeType={signInType} />
          <NeedAnAccount routeType={signInType} />
        </Box>
      </Box>
    </Box>
  );
}
