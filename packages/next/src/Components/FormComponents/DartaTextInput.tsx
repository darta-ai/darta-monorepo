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
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  errors: any;
  toolTips: ToolTip | any;
  required: boolean;
  multiline: boolean;
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
  const innerWidthMultiple = innerWidthRef.current > 800 ? 3 : 4;
  const rows = multiline ? innerWidthMultiple : 1;
  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
        <Box>
          {innerWidthRef.current > 780 && (
            <Tooltip
              title={
                <Typography sx={{textAlign: 'center'}}>
                  {toolTips[fieldName]}
                </Typography>
              }
              placement="top">
              <IconButton>
                <HelpOutlineIcon fontSize="medium" sx={formStyles.helpIcon} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box>
          <InputAdornment sx={{overflowX: 'clip'}} position="end">
            {inputAdornmentString}
            {required && '*'}
          </InputAdornment>
        </Box>
      </Box>
      <Box>
        <TextField
          id="value"
          variant="standard"
          error={!!errors[fieldName]}
          {...register(`${fieldName}.${'value'}`)}
          sx={formStyles.formTextField}
          helperText={errors[fieldName]?.value && helperTextString}
          fullWidth
          required={required}
          multiline={multiline}
          rows={rows}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {inputAdornmentValue}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <InputAdornment sx={{width: '10vw', alignSelf: 'center'}} position="end">
        {allowPrivate && (
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
                    innerWidthRef.current > 780 ? (
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography sx={formStyles.toolTip}>
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
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography sx={formStyles.toolTip}>
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
        )}
      </InputAdornment>
    </Box>
  );
}
