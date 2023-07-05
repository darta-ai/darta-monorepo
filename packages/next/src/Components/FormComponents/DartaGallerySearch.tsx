/* eslint-disable react/jsx-props-no-spreading */

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Box,
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import {debounce} from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import * as React from 'react';

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
const businessDetailService = {current: null};

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
  place_id: string;
}

export function DartaGallerySearch({
  fieldName,
  data,
  register,
  toolTips,
  required,
  inputAdornmentString,
  setAutofillDetails,
  placeId,
  setPlaceId,
}: {
  fieldName: string;
  data: PrivateFields | undefined;
  register: any;
  toolTips: any;
  required: boolean;
  inputAdornmentString: string;
  placeId: string | null;
  setAutofillDetails: (details: any) => void;
  setPlaceId: (placeId: string) => void;
}) {
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

  const [placeDetails, setPlaceDetails] = React.useState<any>(null);

  const fetchBusinessDetails = React.useMemo(
    () =>
      debounce(
        (
          request: {
            placeId: string;
            fields: string[];
          },
          callback: (results?: readonly PlaceType[]) => void,
        ) => {
          (businessDetailService.current as any).getDetails(request, callback);
        },
        400,
      ),
    [],
  );

  React.useEffect(() => {
    const businessActive = {current: true};

    if (!businessDetailService.current && (window as any).google) {
      businessDetailService.current = new (
        window as any
      ).google.maps.places.PlacesService(document.createElement('div'));
    }
    if (!businessDetailService.current) {
      return undefined;
    }

    if (placeId && businessActive.current) {
      fetchBusinessDetails(
        {
          placeId,
          fields: [
            'opening_hours',
            'geometry',
            'name',
            'website',
            'formatted_phone_number',
            'formatted_address',
            'photos',
            'url',
          ],
        },
        (results?: readonly PlaceType[]) => {
          if (businessActive.current) {
            let newDetails: readonly PlaceType[] = [];

            if (placeDetails) {
              newDetails = placeDetails;
            }

            if (results) {
              newDetails = results;
            }
            setPlaceDetails(newDetails);
            setAutofillDetails(newDetails);
          }
        },
      );
    }
    return () => {
      businessActive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, fetchBusinessDetails]);

  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  return (
    <Box sx={formStyles.inputTextContainer}>
      <Box sx={formStyles.toolTipContainer}>
        {innerWidthRef.current > 780 && (
          <Tooltip
            title={
              <Typography
                data-testid={`${fieldName}-tooltip-text`}
                sx={{textAlign: 'center'}}>
                {toolTips[fieldName]}
              </Typography>
            }
            placement="top">
            <IconButton data-testid={`${fieldName}-tooltip-button`}>
              <HelpOutlineIcon fontSize="medium" sx={formStyles.helpIcon} />
            </IconButton>
          </Tooltip>
        )}
        <InputAdornment
          data-testid={`${fieldName}-input-adornment-string`}
          sx={{overflowX: 'clip'}}
          position="end">
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
          setPlaceId(newValue?.place_id!);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            {...register(`${fieldName}.${'value'}`)}
            data-testid={`${fieldName}-input-field`}
            variant="standard"
            required={required}
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
                      data-testid={`${part.text}-option`}
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
    </Box>
  );
}
