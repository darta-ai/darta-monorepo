/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Box, IconButton, Tooltip, Typography} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React from 'react';
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
  error,
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
  error: boolean;
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
          key={fieldName}
          name={fieldName}
          control={control}
          data-testid={`${testIdValue}-timePicker`}
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                data-testid={`${testIdValue}-timePicker`}
                sx={formStyles.datePicker}
                label={label}
                minDate={dayjs(minDate) ?? dayjs()}
                views={['year', 'month', 'day']}
                disabled={canEdit}
                value={dayjs(value)}
                slotProps={{
                  textField: {
                    error,
                  },
                }}
                onChange={(newValue: any) => {
                  const date = newValue.toDate();
                  field.onChange(date);
                  if (setHigherLevelState) {
                    setHigherLevelState(newValue);
                  }
                }}
              />
            </LocalizationProvider>
          )}
        />
      </Box>
    </>
  );
}

DartaDatePicker.defaultProps = {
  canEdit: false,
  minDate: '',
  setHigherLevelState: () => {},
};
