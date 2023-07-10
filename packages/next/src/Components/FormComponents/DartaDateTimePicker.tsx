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
  errors,
  helperTextString,
  register,
  canEdit,
  setHigherLevelState,
  minTime,
  value,
}: {
  label: string;
  toolTips: ToolTip | any;
  fieldName: string;
  control: any;
  register: any;
  errors: any;
  helperTextString: string | undefined;
  canEdit?: boolean;
  minTime?: string | any;
  setHigherLevelState?: (arg0: string | null) => void;
  value: string | undefined | null;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  const testIdValue = fieldName.replace('.', '-');
  return (
    <>
      <Box>
        <Box>
          {innerWidthRef.current > 780 && (
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
          )}
        </Box>
      </Box>
      <Box>
        <Controller
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
        {errors[fieldName]?.value && (
          <Typography
            data-testid={`${testIdValue}-text-error-field`}
            sx={{color: 'red'}}>
            {helperTextString}
          </Typography>
        )}
      </Box>
      <InputAdornment sx={{width: '5vw', alignSelf: 'center'}} position="end" />
    </>
  );
}

DartaDateTimePicker.defaultProps = {
  canEdit: false,
  minTime: null,
  setHigherLevelState: () => {},
};
