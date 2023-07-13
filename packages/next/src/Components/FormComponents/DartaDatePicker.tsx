/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import * as React from 'react';
import {Controller} from 'react-hook-form';

import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaDatePicker({
  label,
  toolTips,
  control,
  fieldName,
  canEdit,
  register,
  setHigherLevelState,
  minDate,
  value,
}: {
  label: string;
  toolTips: ToolTip | any;
  fieldName: string;
  register: any;
  control: any;
  canEdit?: boolean;
  minDate?: string | any;
  setHigherLevelState?: (arg0: string | null) => void;
  value: string | undefined | null;
}) {
  const testIdValue = fieldName.replace('.', '-');
  return (
    <>
      <Box>
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
      </Box>
      <Box>
        <Controller
          name={`${fieldName}.${'value'}`}
          control={control}
          defaultValue={minDate}
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                minDate={minDate}
                views={['year', 'month', 'day']}
                sx={formStyles.datePicker}
                label={label}
                value={dayjs(value)}
                disabled={canEdit}
                data-testid={`${testIdValue}-datePicker`}
                onChange={(newValue: any) => {
                  field.onChange(newValue.toDate());
                  if (setHigherLevelState) {
                    setHigherLevelState(newValue);
                  }
                }}
              />
            </LocalizationProvider>
          )}
        />
      </Box>
      <InputAdornment sx={{width: '5vw', alignSelf: 'center'}} position="end" />
    </>
  );
}

DartaDatePicker.defaultProps = {
  canEdit: false,
  minDate: '',
  setHigherLevelState: () => {},
};
