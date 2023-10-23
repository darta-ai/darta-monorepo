/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';

import { DartaInputAdornment } from './Components';
import {formStyles} from './styles';

export function DartaDropdown({
  options,
  toolTips,
  fieldName,
  register,
  control,
  helperTextString,
  required,
  inputAdornmentString,
}: {
  options: string[];
  toolTips: {
    [key: string]: string;
  };
  fieldName: string;
  register: any;
  control: any;
  helperTextString: string | undefined;
  required: boolean;
  inputAdornmentString: string;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);

  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box
      sx={formStyles.inputTextContainerTwoColumns}>
      <DartaInputAdornment
        fieldName={fieldName}
        required={required}
        inputAdornmentString={inputAdornmentString}
        toolTips={toolTips}
        testIdValue={testIdValue}
      />
      <Box>
          <Controller
            control={control}
            name={`${fieldName}`}
            key={fieldName}
            {...register(`${fieldName}.${'value'}`)}
            render={({field}) => (
              <Select
                id="dropdown"
                inputvalue={field.value || ''}
                key={field.value}
                sx={{...formStyles.formTextField, fontSize: 'auto',}}
                data-testid={`${testIdValue}-select-field`}
                {...(field as any)}>
                {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      value={option}
                      sx={{width: 'inherit'}}
                      data-testid={`${fieldName}-input-field-option-${index}`}>
                      {option}
                    </MenuItem>
                ))}
              </Select>
            )}
          />
      {helperTextString && (
        <Typography
          data-testid={`${testIdValue}-text-error-field`}
          sx={{color: 'red', textAlign: 'center'}}>
          {helperTextString}
        </Typography>
      )}
      </Box>  
    </Box>
  );
}
