/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';

import {formStyles} from './styles';

export function DartaDropdown({
  options,
  toolTips,
  fieldName,
  register,
  control,
  helperTextString,
  value,
}: {
  options: string[];
  toolTips: {
    [key: string]: string;
  };
  fieldName: string;
  register: any;
  control: any;
  helperTextString: string | undefined;
  value: string | null | undefined;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);

  console.log({value, fieldName})

  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box
      sx={{
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <Box
        sx={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}>
        <Box>
          <Box>
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
          </Box>
        </Box>
        <Box sx={formStyles.dropDown}>
          <Controller
            control={control}
            name={`${fieldName}`}
            key={fieldName}
            defaultValue={value}
            render={({field}) => (
              <Select
                id="autocomplete"
                inputvalue={field.value}
                key={field.value}
                sx={formStyles.dropDown}
                data-testid={`${testIdValue}-select-field`}
                {...register(`${fieldName}.${'value'}`)}
                {...(field as any)}>
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    value={option}
                    data-testid={`${fieldName}-input-field-option-${index}`}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Box>
      </Box>
      {helperTextString && (
        <Typography
          data-testid={`${testIdValue}-text-error-field`}
          sx={{color: 'red', textAlign: 'center'}}>
          {helperTextString}
        </Typography>
      )}
    </Box>
  );
}
