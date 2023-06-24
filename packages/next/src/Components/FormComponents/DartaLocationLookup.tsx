/* eslint-disable react/jsx-props-no-spreading */

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  ListItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import {debounce} from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import * as React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../styles';
import {PrivateFields} from '../Profile/types';
import {formStyles} from './styles';

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = {current: null};

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

export function DartaLocationLookup({
  fieldName,
  data,
  register,
  control,
  toolTips,
  allowPrivate,
  multiline,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
}: {
  fieldName: string;
  data: PrivateFields | undefined;
  register: any;
  errors: any;
  control: any;
  toolTips: any;
  required: boolean;
  multiline: boolean;
  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);

  const [value, setValue] = React.useState<PlaceType | null | undefined>(
    data?.value as any,
  );
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: {input: string},
          callback: (results?: readonly PlaceType[]) => void,
        ) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback,
          );
        },
        400,
      ),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({input: inputValue}, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
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
        <InputAdornment sx={{overflowX: 'clip'}} position="end">
          {inputAdornmentString}
        </InputAdornment>
      </Box>
      <Autocomplete
        id="value"
        sx={formStyles.formTextField}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.description
        }
        filterOptions={x => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No locations"
        onChange={(event: any, newValue: PlaceType | null) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            {...register(`${fieldName}.${'value'}`)}
            variant="standard"
            error={!!errors[fieldName]}
            helperText={errors[fieldName]?.value && helperTextString}
            required={required}
            defaultValue={data?.value!}
            multiline={multiline}
          />
        )}
        renderOption={(props, option) => {
          const matches =
            option.structured_formatting?.main_text_matched_substrings || [];

          const parts = parse(
            option?.structured_formatting?.main_text,
            matches.map((match: any) => [
              match?.offset,
              Number(match?.offset) + Number(match?.length),
            ]),
          );

          return (
            <ListItem {...(props as any)}>
              <Grid container alignItems="center">
                <Grid item sx={{display: 'flex', width: 44}}>
                  <LocationOnIcon sx={{color: 'text.secondary'}} />
                </Grid>
                <Grid
                  item
                  sx={{width: 'calc(100% - 44px)', wordWrap: 'break-word'}}>
                  {parts.map((part: any) => (
                    <Box
                      key={part.text}
                      component="span"
                      sx={{fontWeight: part?.highlight ? 'bold' : 'regular'}}>
                      {part.text}
                    </Box>
                  ))}
                  <Typography variant="body2" color="text.secondary">
                    {option?.structured_formatting?.secondary_text && (
                      <span
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: option?.structured_formatting
                            ?.secondary_text as string,
                        }}
                      />
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          );
        }}
      />
      <InputAdornment sx={{width: '10vw', alignSelf: 'center'}} position="end">
        {allowPrivate && (
          <Controller
            control={control}
            sx={{alignSelf: 'flex-start'}}
            name={fieldName}
            {...register(`${fieldName}.${'isPrivate'}`)}
            defaultValue={data?.isPrivate}
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
                                  ? 'Private information is only visible to you and your team.'
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
        )}
      </InputAdornment>
    </Box>
  );
}
