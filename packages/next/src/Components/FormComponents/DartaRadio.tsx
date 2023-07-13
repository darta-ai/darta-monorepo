/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import {Controller} from 'react-hook-form';

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
      <Box sx={formStyles.toolTipContainer}>
        <Tooltip
          title={
            <Typography
              sx={{textAlign: 'center'}}
              data-testid={`${testIdValue}-tooltip-text`}>
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

        <InputAdornment
          data-testid={`${testIdValue}-input-adornment-string`}
          sx={{overflowX: 'clip'}}
          position="end">
          {inputAdornmentString}
          {required && '*'}
        </InputAdornment>
      </Box>
      <Box>
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
