import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormLabel,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import {filterStyles} from './styles';

export function DartaTextFilter({
  toolTips,
  fieldName,
  value,
  handleInputChange,
}: {
  toolTips: any;
  fieldName: string;
  value: string | undefined;
  handleInputChange: (arg0: string) => void;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  return (
    <Box sx={filterStyles.inputTextContainer}>
      <Box sx={{alignSelf: 'center'}}>
        {innerWidthRef.current > 780 && (
          <Tooltip
            title={
              <Typography sx={{textAlign: 'center'}}>
                {toolTips[fieldName]}
              </Typography>
            }
            placement="top">
            <IconButton>
              <HelpOutlineIcon fontSize="medium" sx={filterStyles.helpIcon} />
            </IconButton>
          </Tooltip>
        )}
        <FormLabel>Search</FormLabel>
      </Box>
      <Box>
        <TextField
          id="value"
          variant="standard"
          data-testid={`${fieldName}-text-input`}
          sx={filterStyles.formTextField}
          fullWidth
          value={value}
          onChange={e => handleInputChange(e.target.value)}
        />
      </Box>
    </Box>
  );
}
