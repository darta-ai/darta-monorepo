import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import {formStyles} from '../styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaInputAdornment({
  fieldName,
  required,
  inputAdornmentString,
  toolTips,
  testIdValue,
}: {
  fieldName: string;
  toolTips: ToolTip | any;
  required: boolean;
  inputAdornmentString: string;
  testIdValue: string;
}) {
  return (
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
          sx={formStyles.inputAdornmentStyle}
          position="end">
          {inputAdornmentString}
          {required && '*'}
        </InputAdornment>
      </Box>
    </Box>
  );
}
