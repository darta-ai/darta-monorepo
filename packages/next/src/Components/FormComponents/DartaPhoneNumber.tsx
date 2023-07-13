/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';
import {PatternFormat} from 'react-number-format';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {PrivateFields} from '../Profile/types';
import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

function PhoneNumberFormat(props: any) {
  const {onChange, ...other} = props;
  return (
    <PatternFormat
      {...other}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      format="+1 (###) ###-####"
      mask="_"
    />
  );
}

export function DartaPhoneNumber({
  fieldName,
  data,
  register,
  control,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
  toolTips,
  allowPrivate,
  inputAdornmentValue,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  errors: any;
  toolTips: ToolTip | any;
  required: boolean;
  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
  inputAdornmentValue: string | null;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
        <Box>
          {innerWidthRef.current > 780 && (
            <Tooltip
              title={
                <Typography
                  data-testid={`${fieldName}-tooltip-text`}
                  sx={{textAlign: 'center'}}>
                  {toolTips[fieldName]}
                </Typography>
              }
              placement="top">
              <IconButton>
                <HelpOutlineIcon
                  data-testid={`${fieldName}-tooltip-button`}
                  fontSize="medium"
                  sx={formStyles.helpIcon}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box>
          <InputAdornment
            data-testid={`${fieldName}-input-adornment-string`}
            sx={{overflowX: 'clip'}}
            position="end">
            {inputAdornmentString}
            {required && '*'}
          </InputAdornment>
        </Box>
      </Box>
      <Box>
        <Controller
          control={control}
          name={fieldName}
          key={fieldName}
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => (
            <TextField
              {...field}
              id="value"
              variant="standard"
              error={!!errors[fieldName]}
              sx={formStyles.formTextField}
              helperText={
                errors[fieldName]?.value && (
                  <Typography
                    data-testid={`${fieldName}-text-error-field`}
                    sx={{color: 'red'}}>
                    {helperTextString}
                  </Typography>
                )
              }
              fullWidth
              required={required}
              data-testid={`${fieldName}-input-field`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {inputAdornmentValue}
                  </InputAdornment>
                ),
                inputComponent: PhoneNumberFormat,
              }}
            />
          )}
        />
      </Box>
      {allowPrivate && (
        <InputAdornment
          sx={{width: '10vw', alignSelf: 'center'}}
          position="end">
          <Controller
            control={control}
            sx={{alignSelf: 'flex-start'}}
            name={fieldName}
            {...register(`${fieldName}.${'isPrivate'}`)}
            render={({field}: {field: any}) => {
              return (
                <FormControlLabel
                  labelPlacement="bottom"
                  label={
                    innerWidthRef.current > 600 ? (
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography
                          sx={formStyles.toolTip}
                          data-testid={`${fieldName}-privacy-display`}>
                          {isPrivate ? 'Private' : 'Public'}
                          <Tooltip
                            title={
                              <Box>
                                <Typography
                                  sx={{textAlign: 'center', fontSize: 10}}>
                                  {isPrivate
                                    ? 'Private information is only visible to you and is not displayed on the app.'
                                    : 'Public information is available to any user.'}
                                </Typography>
                                <IconButton>
                                  <HelpOutlineIcon
                                    fontSize="small"
                                    sx={formStyles.helpIconTiny}
                                  />
                                </IconButton>
                              </Box>
                            }
                            placement="bottom">
                            <IconButton>
                              <HelpOutlineIcon
                                fontSize="small"
                                sx={formStyles.helpIconTiny}
                              />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          sx={formStyles.toolTip}
                          data-testid={`${fieldName}-privacy-display`}>
                          {isPrivate ? 'Private' : 'Public'}
                        </Typography>
                      </Box>
                    )
                  }
                  control={
                    <Switch
                      color="secondary"
                      value={data?.isPrivate}
                      id="isPrivate"
                      size="small"
                      data-testid={`${fieldName}-privacy-switch`}
                      onChange={e => field.onChange(e.target.checked)}
                      checked={field.value}
                      onClick={() => {
                        setIsPrivate(!isPrivate);
                      }}
                    />
                  }
                  sx={{
                    width: '10vw',
                    color: PRIMARY_DARK_GREY,
                  }}
                />
              );
            }}
          />
        </InputAdornment>
      )}
    </Box>
  );
}
