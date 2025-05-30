import * as Colors from '@darta-styles'
import {
  BusinessAddressType,
  IBusinessLocationData,
  IGalleryProfileData,
} from '@darta-types';
import {Box, Button, Divider} from '@mui/material';
import {debounce} from '@mui/material/utils';
import React from 'react';

import {googleMapsParser} from '../../common/nextFunctions';
import {DartaHoursOfOperation, DartaLocationLookup} from './index';
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

export function DartaLocationAndTimes({
  locationNumber,
  data,
  register,
  toolTips,
  getValues,
  removeLocation,
  setValue,
  errors,
  control,
  galleryProfileData,
  locationDisplay,
}: {
  locationNumber: BusinessAddressType;
  data: IBusinessLocationData;
  register: any;
  toolTips: any;
  getValues: (arg0: string) => void;
  removeLocation: (locationNumber: BusinessAddressType) => void;
  errors: any;
  control: any;
  galleryProfileData: IGalleryProfileData;
  locationDisplay: string;
  setValue: any;
}) {
  const [value, setLocalValue] = React.useState<PlaceType | null | undefined>(
    (data?.locationString?.value as any) || '',
  );
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const loaded = React.useRef(false);
  const [placeId, setPlaceId] = React.useState<string | null>(null);

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
            'address_components',
            'geometry',
            'name',
            'website',
            'formatted_phone_number',
            'formatted_address',
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
          }
        },
      );
    }
    return () => {
      businessActive.current = false;
    };
  }, [placeId, fetchBusinessDetails]);

  React.useEffect(() => {
    if (placeDetails) {
      const {galleryAddress, lat, lng, mapsUrl, city, locality} =
        googleMapsParser(placeDetails);
      if (galleryAddress) {
        setValue(`${locationNumber}.locationString.value`, galleryAddress);
      }
      if (lat) {
        setValue(`${locationNumber}.coordinates.latitude.value`, lat);
      }
      if (lng) {
        setValue(`${locationNumber}.coordinates.longitude.value`, lng);
      }
      if (mapsUrl) {
        setValue(`${locationNumber}.coordinates.googleMapsUrl.value`, mapsUrl);
      }
      if (city) {
        setValue(`${locationNumber}.city.value`, city);
      }
      if (locality) {
        setValue(`${locationNumber}.locality.value`, locality);
      }
      setValue(`${locationNumber}.googleMapsPlaceId.value`, placeId);
    }
  }, [placeDetails]);

  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
  const hoursOfOperation =
    galleryProfileData &&
    galleryProfileData[locationNumber] &&
    galleryProfileData[locationNumber]?.businessHours
      ? galleryProfileData[locationNumber]?.businessHours?.hoursOfOperation
      : undefined;

  return (
    <Box sx={formStyles.dartaLocationContainer}>
      <Divider>{locationDisplay}</Divider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          m: 2,
        }}>
        {locationNumber !== 'galleryLocation0' && (
          <Button
            variant="contained"
            sx={{backgroundColor: Colors.PRIMARY_100, color: Colors.PRIMARY_900}}
            data-testid={`${locationNumber}-remove-location-button`}
            onClick={() => removeLocation(locationNumber)}>
            Remove Location
          </Button>
        )}
      </Box>
      <Box key={`${locationNumber}.locationString"`}>
        <DartaLocationLookup
          fieldName={`${locationNumber}.locationString`}
          data={
            (getValues(`${locationNumber}.locationString`) as any) ??
            data?.locationString
          }
          register={register}
          control={control}
          toolTips={toolTips}
          allowPrivate
          errors={errors}
          helperTextString={
            errors.galleryLocation0?.locationString?.value?.message as string
          }
          required={false}
          inputAdornmentString="Location"
          options={options}
          value={value}
          setOptions={setOptions}
          setValue={setLocalValue}
          setInputValue={setInputValue}
          setPlaceId={setPlaceId}
        />
      </Box>
      <Box key={`${locationNumber}.businessHours"`}>
        <DartaHoursOfOperation
          fieldName={`${locationNumber}.businessHours`}
          dtoName={`${locationNumber}`}
          data={
            (getValues(
              `${locationNumber}.businessHours.hoursOfOperation`,
            ) as any) || hoursOfOperation
          }
          register={register}
          required={false}
          inputAdornmentString="Hours"
          toolTips={toolTips}
          allowPrivate
          control={control}
        />
      </Box>
    </Box>
  );
}
