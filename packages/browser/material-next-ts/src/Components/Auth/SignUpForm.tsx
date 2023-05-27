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
import {AlreadySignedUp} from '../Navigation/Auth';
import {AuthEnum} from './types';
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
    website: yup
      .string()
      .matches(websiteRegExp, 'please double check your website url')
      .optional(),
  })
  .required();

export function SignUpForm({signUpType}: {signUpType: AuthEnum}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const onSubmit = (data: any) => console.log(data);

  const [togglePasswordView, setTogglePasswordView] = useState<boolean>(true);
  const [toggleConfirmPasswordView, setToggleConfirmPasswordView] =
    useState<boolean>(true);

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
            phone number
          </InputLabel>
          <Input
            error={errors?.phoneNumber?.message ? true : false}
            {...register('phoneNumber')}
            id="phoneNumber"
            color="info"
            aria-describedby="phoneNumber"
          />
          <FormHelperText id="phoneHelperText" sx={signUpStyles.warningText}>
            {errors?.phoneNumber?.message as string}
          </FormHelperText>
        </FormControl>
        {!errors?.password?.message && (
          <FormHelperText id="phoneHelperText" sx={signUpStyles.formHelperText}>
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
          <FormHelperText id="phoneHelperText" sx={signUpStyles.warningText}>
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
          <FormHelperText id="phoneHelperText" sx={signUpStyles.warningText}>
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
          <FormHelperText id="phoneHelperText" sx={signUpStyles.warningText}>
            {errors?.website?.message as string}
          </FormHelperText>
        </FormControl>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          sx={{alignSelf: 'center', margin: '2vh'}}>
          Sign Up
        </Button>
        <AlreadySignedUp routeType={signUpType} />
      </Box>
    </Box>
  );
}
