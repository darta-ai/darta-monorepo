/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';

import {DartaInputAdornment} from './Components';
import {formStyles} from './styles';

export function DartaRadioButtonsGroup({
  toolTips,
  fieldName,
  inputAdornmentString,
  options,
  control,
  setHigherLevelState,
  errors,
  helperTextString,
  required,
  value,
}: {
  toolTips: any;
  fieldName: string;
  control: any;
  inputAdornmentString: string;
  options: string[];
  helperTextString: string | undefined;
  errors: any;
  setHigherLevelState: any | null;
  required: boolean;
  value: string | undefined | null;
}) {
  const testIdValue = fieldName.replace('.', '-');

  return (
    <Box sx={formStyles.underHeadingContainer}>
      <DartaInputAdornment
        fieldName={fieldName}
        required={required}
        inputAdornmentString={inputAdornmentString}
        toolTips={toolTips}
        testIdValue={testIdValue}
      />
      <Box sx={{ml: 3}}>
        <Controller
          control={control}
          name={`${fieldName}.${'value'}`}
          key={fieldName}
          render={({field}: {field: any}) => (
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={value}
              sx={{alignSelf: 'center'}}
              {...field}>
              {options.map(option => {
                return (
                  <FormControlLabel
                    value={option}
                    key={option}
                    sx={formStyles.dartaRadioText}
                    data-testid={`${fieldName}-input-${option}`}
                    onClick={() => {
                      setHigherLevelState && setHigherLevelState(option);
                    }}
                    control={<Radio color="secondary" />}
                    label={option}
                  />
                );
              })}
            </RadioGroup>
          )}
        />
        {errors[fieldName]?.value && (
          <Typography
            data-testid={`${testIdValue}-text-error-field`}
            sx={{color: 'red'}}>
            {helperTextString}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
