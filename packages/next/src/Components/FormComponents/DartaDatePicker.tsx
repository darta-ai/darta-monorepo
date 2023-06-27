/* eslint-disable import/no-extraneous-dependencies */
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
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import * as React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {DateFields} from '../Profile/types';
import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaDatePicker({
  label,
  toolTips,
  control,
  data,
  register,
  fieldName,
  allowOngoing,
}: {
  label: string;
  toolTips: ToolTip | any;
  fieldName: string;
  data: DateFields;
  allowOngoing: boolean;
  register: any;
  control: any;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  const [isOngoing, setIsOngoing] = React.useState<boolean>(data?.isOngoing!);

  return (
    <>
      <Box sx={formStyles.toolTipContainer}>
        <Box>
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
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label={label} disabled={isOngoing} />
        </LocalizationProvider>
      </Box>
      <InputAdornment sx={{width: '10vw', alignSelf: 'center'}} position="end">
        {allowOngoing && (
          <Controller
            control={control}
            sx={{alignSelf: 'flex-start'}}
            name={fieldName}
            {...register(`${fieldName}.${'isOngoing'}`)}
            render={({field}: {field: any}) => {
              return (
                <FormControlLabel
                  labelPlacement="bottom"
                  label={
                    innerWidthRef.current > 780 ? (
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography sx={formStyles.toolTip}>Ongoing</Typography>
                      </Box>
                    ) : (
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography sx={formStyles.toolTip}>Ongoing</Typography>
                      </Box>
                    )
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
                        setIsOngoing(!isOngoing);
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
        )}
      </InputAdornment>
    </>
  );
}
