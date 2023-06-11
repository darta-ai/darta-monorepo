/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {PrivateFields} from '../Profile/types';
import {formStyles} from './styles';

export function DartaTextInput({
  fieldName,
  data,
  register,
  control,
  defaultValue,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
  toolTips,
  multiline,
  allowPrivate,
}: {
  fieldName: string;
  data: PrivateFields | undefined;
  register: any;
  errors: any;
  control: any;
  defaultValue: string | undefined;
  toolTips: any;
  required: boolean;
  multiline: boolean;
  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const {innerWidth} = window;
  const innerWidthMultiple = innerWidth > 800 ? 2 : 4;
  const rows = multiline ? innerWidthMultiple : 1;
  return (
    <>
      {innerWidth > 800 && (
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
      <TextField
        id="value"
        variant="standard"
        error={!!errors[fieldName]}
        {...register(`${fieldName}.${'value'}`)}
        sx={formStyles.formTextField}
        helperText={errors[fieldName]?.value && helperTextString}
        fullWidth
        required={required}
        multiline={multiline}
        defaultValue={data?.value!}
        rows={rows}
        InputProps={{
          startAdornment: (
            <InputAdornment
              sx={{width: '12vw', overflowX: 'clip'}}
              position="start">
              {inputAdornmentString}
            </InputAdornment>
          ),
        }}
      />
      {allowPrivate && (
        <Controller
          control={control}
          name={fieldName}
          {...register(`${fieldName}.${'isPrivate'}`)}
          defaultValue={data?.isPrivate}
          render={({field}) => {
            return (
              <FormControlLabel
                labelPlacement="bottom"
                label={
                  innerWidth > 800 ? (
                    <Box sx={formStyles.toolTipContainer}>
                      <Typography sx={formStyles.toolTip}>
                        {isPrivate ? 'Private' : 'Public'}
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{textAlign: 'center', fontSize: 15}}>
                            Private information is only visible to you and your
                            team
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
      )}
    </>
  );
}
