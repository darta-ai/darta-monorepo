import React from 'react';
import {Box} from '@mui/material';
import {PRIMARY_BLUE} from '../../../styles';
import {TextField, FormHelperText, Button} from '@mui/material';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AuthEnum} from './types';
import {NeedAnAccount} from '../Navigation/Auth/NeedAnAccount';

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
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
    password: yup
      .string()
      .min(8, 'password must be at least 8 characters')
      .required(),
  })
  .required();

export function SignInForm({signUpType}: {signUpType: AuthEnum}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const onSubmit = (data: any) => console.log(data);

  return (
    <Box sx={signUpStyles.signInContainer}>
      <Box sx={signUpStyles.signInFieldContainer}>
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
        <TextField
          variant="standard"
          error={errors?.password?.message ? true : false}
          helperText={errors?.password?.message as string}
          label="password"
          {...register('password')}
          id="password"
          aria-describedby="password"
          required
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          sx={{alignSelf: 'center', margin: '2vh'}}>
          Sign In
        </Button>
        <NeedAnAccount routeType={signUpType} />
      </Box>
    </Box>
  );
}
