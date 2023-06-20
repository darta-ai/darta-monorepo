/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {PrivateFields} from '../Profile/types';
import {formStyles} from './styles';

export function DartaDropdown({
  options,
  toolTips,
  fieldName,
  data,
  inputAdornmentString,
  allowPrivate,
  register,
}: {
  data: PrivateFields | any;
  options: string[];
  toolTips: {
    [key: string]: string;
  };
  fieldName: string;
  register: any;
  allowPrivate: boolean;
  inputAdornmentString: string;
}) {
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);

  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);

  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
        {innerWidthRef.current > 780 && (
          <Tooltip
            sx={formStyles.toolTipContainer}
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
        <InputAdornment sx={{mr: '1vw', overflowX: 'clip'}} position="end">
          {inputAdornmentString}
        </InputAdornment>
      </Box>
      <Box>
        <Controller
          name="dropdownValue"
          render={({field}) => (
            <Select
              sx={{width: '15vw', alignSelf: 'flex-start'}}
              {...(field as any)}>
              {options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>
      <Box>
        {allowPrivate && (
          <InputAdornment sx={{width: '10vw'}} position="end">
            <Controller
              name={fieldName}
              sx={{alignSelf: 'flex-start'}}
              {...register(`${fieldName}.${'isPrivate'}`)}
              defaultValue={data?.isPrivate}
              render={({field}) => {
                return (
                  <FormControlLabel
                    labelPlacement="bottom"
                    label={
                      innerWidthRef.current > 780 ? (
                        <Box sx={formStyles.toolTipContainer}>
                          <Typography sx={formStyles.toolTip}>
                            {isPrivate ? 'Private' : 'Public'}
                          </Typography>
                          <Tooltip
                            title={
                              <Typography
                                sx={{textAlign: 'center', fontSize: 15}}>
                                Private information is only visible to you and
                                your team
                              </Typography>
                            }
                            placement="bottom">
                            <IconButton>
                              <HelpOutlineIcon
                                fontSize="small"
                                sx={formStyles.helpIconTiny}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box sx={formStyles.toolTipContainer}>
                          <Typography sx={formStyles.toolTip}>
                            {isPrivate ? 'Private' : 'Public'}
                          </Typography>
                        </Box>
                      )
                    }
                    control={
                      <Switch
                        color="secondary"
                        value={data?.isPrivate}
                        size="small"
                        id="isPrivate"
                        onChange={e => field.onChange(e.target.checked)}
                        checked={field.value}
                        onClick={() => {
                          setIsPrivate(!isPrivate);
                        }}
                      />
                    }
                    sx={{
                      width: '12vw',
                      color: PRIMARY_DARK_GREY,
                    }}
                  />
                );
              }}
            />
          </InputAdornment>
        )}
      </Box>
    </Box>
  );
}
