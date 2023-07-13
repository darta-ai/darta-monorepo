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

import {PRIMARY_DARK_GREY} from '../../../styles';
import {PrivateFields} from '../Profile/types';
import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaTextInput({
  fieldName,
  data,
  register,
  control,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
  toolTips,
  multiline,
  allowPrivate,
  inputAdornmentValue,
  switchStringValue,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  errors: any;
  toolTips: ToolTip | any;
  required: boolean;
  multiline: number;
  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
  inputAdornmentValue: string | null;
  switchStringValue?: string;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);

  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
        <Box>
          <Tooltip
            title={
              <Typography
                data-testid={`${testIdValue}-tooltip-text`}
                sx={{textAlign: 'center'}}>
                {toolTips[fieldName]}
              </Typography>
            }
            placement="top">
            <IconButton>
              <HelpOutlineIcon
                data-testid={`${testIdValue}-tooltip-button`}
                fontSize="medium"
                sx={formStyles.helpIcon}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <InputAdornment
            data-testid={`${testIdValue}-input-adornment-string`}
            sx={{overflowX: 'clip'}}
            position="end">
            {inputAdornmentString}
            {required && '*'}
          </InputAdornment>
        </Box>
      </Box>
      <Box sx={formStyles.formTextField}>
        <TextField
          id="value"
          variant="standard"
          error={!!errors[fieldName]}
          {...register(`${fieldName}.${'value'}`)}
          helperText={
            errors[fieldName]?.value && (
              <Typography
                data-testid={`${testIdValue}-text-error-field`}
                sx={{color: 'red'}}>
                {helperTextString}
              </Typography>
            )
          }
          fullWidth
          required={required}
          multiline={true}
          data-testid={`${testIdValue}-input-field`}
          rows={multiline}
          InputProps={{
            startAdornment: (
              <InputAdornment
                data-testid={`${testIdValue}-text-input-adornment`}
                position="start">
                {inputAdornmentValue}
              </InputAdornment>
            ),
          }}
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
            {...register(`${testIdValue}.${switchStringValue}`)}
            render={({field}: {field: any}) => {
              return (
                <FormControlLabel
                  labelPlacement="bottom"
                  label={
                    innerWidthRef.current > 600 ? (
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography
                          sx={formStyles.toolTip}
                          data-testid={`${testIdValue}-privacy-display`}>
                          {isPrivate ? 'Private' : 'Public'}
                          <Tooltip
                            title={
                              <Box>
                                <Typography
                                  sx={{textAlign: 'center', fontSize: 15}}>
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
                          data-testid={`${testIdValue}-privacy-display`}>
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
                      data-testid={`${testIdValue}-privacy-switch`}
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

DartaTextInput.defaultProps = {
  switchStringValue: 'isPrivate',
};
