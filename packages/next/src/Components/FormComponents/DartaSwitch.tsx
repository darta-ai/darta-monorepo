/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaSwitch({
  toolTips,
  control,
  data,
  register,
  fieldName,
  inputAdornmentString,
  switchState,
  handleSwitchStateChange,
  trueStatement,
  falseStatement,
}: {
  toolTips: ToolTip | any;
  fieldName: string;
  data: any;
  register: any;
  control: any;
  inputAdornmentString: string;
  switchState: boolean;
  handleSwitchStateChange: (arg0: boolean) => void;
  trueStatement: string;
  falseStatement: string;
}) {
  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box sx={formStyles.underHeadingContainer}>
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
        <InputAdornment
          data-testid={`${testIdValue}-input-adornment-string`}
          sx={{overflowX: 'clip'}}
          position="end">
          {inputAdornmentString}
        </InputAdornment>
      </Box>
      <Box>
        <Controller
          control={control}
          name={fieldName}
          {...register(`${fieldName}.${'isOngoing'}`)}
          render={({field}: {field: any}) => {
            return (
              <FormControlLabel
                labelPlacement="bottom"
                label={
                  <Box sx={formStyles.makePrivateContainer}>
                    <Typography sx={formStyles.rawToolTip}>
                      {switchState ? trueStatement : falseStatement}
                    </Typography>
                  </Box>
                }
                control={
                  <Switch
                    color="secondary"
                    value={data?.isOngoing}
                    id="isPrivate"
                    size="small"
                    onChange={e => field.onChange(e.target.checked)}
                    checked={field.value}
                    onClick={() => {
                      handleSwitchStateChange(!switchState);
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
      </Box>
    </Box>
  );
}
