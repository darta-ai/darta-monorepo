import React from 'react';
import {Box} from '@mui/material';
import {PRIMARY_BLUE} from '../../../styles';
import {TextField, FormHelperText, Button} from '@mui/material';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AuthEnum} from './types';
import {NeedAnAccount, ForgotPassword} from '../Navigation/Auth';

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
    '@media (min-width:800px)': {
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
    '@media (min-width:800px)': {
      gap: '2vh',
    },
  },
};

const schema = yup
  .object({
    email: yup.string().required('please include an email address').email(),
  })
  .required();

export function ForgotPasswordForm() {
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
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          sx={{alignSelf: 'center', margin: '2vh'}}>
          Reset Password
        </Button>
      </Box>
    </Box>
  );
}
