import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import {filterStyles} from './styles';

export function DartaSortDirection({
  toolTips,
  fieldName,
  options,
  defaultValue,
  handleRadioFilter,
}: {
  toolTips: any;
  fieldName: string;
  defaultValue: string;
  options: string[];
  handleRadioFilter: (arg0: string) => void;
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
        flexDirection: 'column',
        alignItems: 'center',
      }}>
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
        <FormLabel>Has Inquiries</FormLabel>
      </Box>
      <Box
        sx={{
          alignSelf: 'center',
        }}>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue={defaultValue}>
          {options.map(option => {
            return (
              <FormControlLabel
                key={option}
                value={option}
                onClick={() => {
                  handleRadioFilter(option);
                }}
                control={<Radio color="secondary" />}
                label={
                  <Typography key={`${option}-label`}>{option}</Typography>
                }
              />
            );
          })}
        </RadioGroup>
      </Box>
    </Box>
  );
}
