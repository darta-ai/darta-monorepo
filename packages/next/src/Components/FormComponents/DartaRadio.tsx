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

type currencyConverterType = {
  [key: string]: string;
};

const currencyConverter: currencyConverterType = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function DartaRadioButtonsGroup({
  toolTips,
  fieldName,
  inputAdornmentString,
  options,
  defaultValue,
  control,
  setDisplayCurrency,
}: {
  toolTips: any;
  fieldName: string;
  control: any;
  inputAdornmentString: string;
  defaultValue: string;
  options: string[];
  setDisplayCurrency: any | null;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignContent: 'center',
      }}>
      {inputAdornmentString !== '' && (
        <Box sx={formStyles.toolTipContainer}>
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
          <InputAdornment sx={{overflowX: 'clip'}} position="end">
            {inputAdornmentString}
          </InputAdornment>
        </Box>
      )}
      <Box sx={{...formStyles.formTextField, alignSelf: 'center'}}>
        <Controller
          control={control}
          name={`${fieldName}.${'value'}`}
          render={({field}: {field: any}) => (
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={defaultValue}
              {...field}>
              {options.map(option => {
                return (
                  <FormControlLabel
                    value={option}
                    data-testid={`${fieldName}-input-${option}`}
                    onClick={() => {
                      setDisplayCurrency &&
                        setDisplayCurrency(currencyConverter[option]);
                    }}
                    control={<Radio color="secondary" />}
                    label={option}
                  />
                );
              })}
            </RadioGroup>
          )}
        />
      </Box>
    </Box>
  );
}
