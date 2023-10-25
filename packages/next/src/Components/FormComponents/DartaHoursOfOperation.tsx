/* eslint-disable react/jsx-props-no-spreading */
import {Box, FormHelperText, TextField, Typography} from '@mui/material';
import React from 'react';

import {PrivateFields} from '../Profile/types';
import {DartaInputAdornment, DartaPrivateFieldHelper} from './Components';
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
      <Box sx={formStyles.hoursOfOperationInputContainer}>
        <Typography sx={{textAlign: 'center'}}>{day.slice(0, 3)}</Typography>
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
  const testIdValue = fieldName.replace('.', '-');

  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
        <DartaInputAdornment
          fieldName={fieldName}
          required={required}
          inputAdornmentString={inputAdornmentString}
          toolTips={toolTips}
          testIdValue={testIdValue}
        />
      </Box>
      {allowPrivate && (
        <DartaPrivateFieldHelper
          fieldName={fieldName}
          data={data}
          register={register}
          control={control}
          isPrivate={isPrivate}
          testIdValue={testIdValue}
          setIsPrivate={setIsPrivate}
          switchStringValue="isPrivate"
        />
      )}
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
    </Box>
  );
}
