import React, {useState} from 'react';
import {Box} from '@mui/material';
import {PRIMARY_BLUE} from '../../../styles';
import {
  FormHelperText,
  TextField,
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
    width: '95%',
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
  warningText: {
    alignSelf: 'left',
    fontSize: 12,
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
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const onSubmit = (data: any) => console.log(data);

  const [togglePasswordView, setTogglePasswordView] = useState<boolean>(true);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
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
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
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
