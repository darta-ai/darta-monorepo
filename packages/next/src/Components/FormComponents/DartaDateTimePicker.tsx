/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Box, IconButton, Tooltip, Typography} from '@mui/material';
import {LocalizationProvider, MobileDateTimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React from 'react';
import {Controller} from 'react-hook-form';

import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaDateTimePicker({
  label,
  toolTips,
  fieldName,
  control,
  register,
  canEdit,
  setHigherLevelState,
  minTime,
  maxTime,
  value,
  error,
}: {
  label: string;
  toolTips: ToolTip | any;
  fieldName: string;
  control: any;
  register: any;
  canEdit?: boolean;
  minTime?: string | any;
  maxTime?: string | any;
  setHigherLevelState?: (arg0: string | null) => void;
  value: string | undefined | null;
  error: boolean;
}) {
  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box sx={formStyles.datePickerContainer}>
      <Tooltip
            title={
              <Typography
                data-testid={`${testIdValue}-tooltip-text`}
                sx={{textAlign: 'center'}}>
                {toolTips[fieldName]}
              </Typography>
            }
            placement="left-start">
            <IconButton>
              <HelpOutlineIcon
                data-testid={`${testIdValue}-tooltip-button`}
                fontSize="medium"
                sx={formStyles.helpIcon}
              />
            </IconButton>
          </Tooltip>
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDateTimePicker
                {...field}
                data-testid={`${testIdValue}-timePicker`}
                sx={formStyles.datePicker}
                label={label}
                minDateTime={dayjs(minTime) ?? dayjs()}
                maxDateTime={dayjs(maxTime) ?? dayjs()}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                disabled={canEdit}
                defaultValue={minTime}
                value={dayjs(value)}
                slotProps={{
                  textField: {
                    error,
                  },
                }}
                onChange={(newValue: any) => {
                  const date = newValue?.toDate().toISOString();
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
  );
}

DartaDateTimePicker.defaultProps = {
  canEdit: false,
  minTime: null,
  maxTime: null,
  setHigherLevelState: () => {},
};
