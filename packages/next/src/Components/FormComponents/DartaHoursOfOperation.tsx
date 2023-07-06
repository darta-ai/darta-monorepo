/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  FormHelperText,
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

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
function InputDayContainer({
  day,
  register,
  dtoName,
  testIdValue,
}: {
  day: string;
  register: any;
  dtoName: string;
  testIdValue: string;
}) {
  return (
    <Box sx={formStyles.formTextField} key={day}>
      <Typography sx={{textAlign: 'center'}}>{day.slice(0, 3)}</Typography>
      <Box sx={formStyles.hoursOfOperationInputContainer}>
        <TextField
          {...register(
            `${dtoName}.businessHours.hoursOfOperation.${day}.open.value`,
          )}
          variant="standard"
          data-testid={`${testIdValue}-${day}-open`}
        />
        <FormHelperText id="component-helper-text">Open</FormHelperText>
        <TextField
          {...register(
            `${dtoName}.businessHours.hoursOfOperation.${day}.close.value`,
          )}
          variant="standard"
          data-testid={`${testIdValue}-${day}-close`}
        />
        <FormHelperText id="component-helper-text">Close</FormHelperText>
      </Box>
    </Box>
  );
}

export function DartaHoursOfOperation({
  fieldName,
  data,
  register,
  control,
  required,
  inputAdornmentString,
  toolTips,
  allowPrivate,
  dtoName,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  required: boolean;
  inputAdornmentString: string;
  toolTips: ToolTip | any;
  allowPrivate: boolean;
  dtoName: string;
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
          {innerWidthRef.current > 780 && (
            <Tooltip
              title={
                <Typography
                  sx={{textAlign: 'center'}}
                  data-testid={`${testIdValue}-tooltip-text`}>
                  {toolTips[fieldName]}
                </Typography>
              }
              placement="top">
              <IconButton data-testid={`${testIdValue}-tooltip-button`}>
                <HelpOutlineIcon fontSize="medium" sx={formStyles.helpIcon} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box>
          <InputAdornment
            sx={{overflowX: 'clip'}}
            position="end"
            data-testid={`${testIdValue}-input-adornment-string`}>
            {inputAdornmentString}
            {required && '*'}
          </InputAdornment>
        </Box>
      </Box>
      <Box sx={formStyles.hoursOfOperationContainer}>
        {days.map(day => (
          <Box key={day}>
            <InputDayContainer
              day={day}
              register={register}
              dtoName={dtoName}
              testIdValue={testIdValue}
            />
          </Box>
        ))}
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
        )}
      </InputAdornment>
    </Box>
  );
}
