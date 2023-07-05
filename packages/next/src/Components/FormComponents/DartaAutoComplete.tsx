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
import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {PrivateFields} from '../Profile/types';
import {formStyles} from './styles';

export function DartaAutoComplete({
  fieldName,
  data,
  register,
  control,
  toolTips,
  allowPrivate,
  label,
  inputOptions,
  inputAdornmentString,
  required,
  errors,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  toolTips: any;
  label: string;
  required: boolean;
  inputAdornmentString: string;
  allowPrivate: boolean;
  errors: any;
  inputOptions: Array<{
    label: string;
    value: string;
    category?: string;
  }>;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const [options, setOptions] = React.useState([...inputOptions]);
  const [inputValue, setInputValue] = React.useState(data.value || '');

  const handleInputChange = (event: any, value: string) => {
    event.preventDefault;
    setInputValue(value);
  };

  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);

  const handleAddNewOption = () => {
    const newOption = {
      label: inputValue.trim(),
      value: inputValue.trim(),
    };

    if (newOption) {
      setOptions([...options, newOption]);
    }
  };
  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
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
        <InputAdornment sx={{overflowX: 'clip'}} position="end">
          {inputAdornmentString}
          {required && '*'}
        </InputAdornment>
      </Box>
      <Box>
        <Autocomplete
          freeSolo
          id="autocomplete"
          inputValue={inputValue}
          options={inputOptions}
          sx={{...formStyles.formTextField}}
          onInputChange={handleInputChange}
          renderInput={params => (
            <TextField
              {...(params as any)}
              label={label}
              {...register(`${fieldName}.${'value'}`)}
              error={!!errors[fieldName]}
              variant="outlined"
            />
          )}
          onBlur={handleAddNewOption}
        />
      </Box>
      {allowPrivate && (
        <InputAdornment
          sx={{width: '10vw', alignSelf: 'center'}}
          position="end">
          <Controller
            control={control}
            sx={{alignSelf: 'flex-start'}}
            name={fieldName}
            {...register(`${fieldName}.${'isPrivate'}`)}
            render={({field}: {field: any}) => {
              return (
                <FormControlLabel
                  labelPlacement="bottom"
                  label={
                    innerWidthRef.current > 780 ? (
                      <Box sx={formStyles.makePrivateContainer}>
                        <Typography sx={formStyles.toolTip}>
                          {isPrivate ? 'Private' : 'Public'}
                        </Typography>
                        <Tooltip
                          title={
                            <>
                              <Typography
                                sx={{textAlign: 'center', fontSize: 15}}>
                                {isPrivate
                                  ? 'Private information is only visible to you and is not displayed on the app.'
                                  : 'Public information is available to any user.'}
                              </Typography>
                              <IconButton>
                                <HelpOutlineIcon
                                  fontSize="small"
                                  sx={formStyles.helpIconTiny}
                                />
                              </IconButton>
                            </>
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
                      <Box sx={formStyles.makePrivateContainer}>
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
                      size="small"
                      onChange={e => field.onChange(e.target.checked)}
                      checked={field.value}
                      onClick={() => {
                        setIsPrivate(!isPrivate);
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
        </InputAdornment>
      )}
    </Box>
  );
}
