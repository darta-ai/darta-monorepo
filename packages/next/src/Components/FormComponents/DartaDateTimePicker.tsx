/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Box, IconButton, Tooltip, Typography} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import * as React from 'react';
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
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                {...field}
                data-testid={`${testIdValue}-timePicker`}
                sx={formStyles.datePicker}
                label={label}
                minDateTime={dayjs(minTime) ?? dayjs()}
                views={['year', 'month', 'day', 'hours', 'minutes']}
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

DartaDateTimePicker.defaultProps = {
  canEdit: false,
  minTime: null,
  setHigherLevelState: () => {},
};
