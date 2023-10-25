/* eslint-disable react/jsx-props-no-spreading */
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Box, ListItem, TextField, Typography} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import parse from 'autosuggest-highlight/parse';
import React from 'react';

import {PrivateFields} from '../Profile/types';
import {DartaInputAdornment, DartaPrivateFieldHelper} from './Components';
import {formStyles} from './styles';

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

export function DartaLocationLookup({
  fieldName,
  data,
  register,
  control,
  toolTips,
  allowPrivate,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
  options,
  value,
  setOptions,
  setValue,
  setInputValue,
  setPlaceId,
}: {
  fieldName: string;
  data: PrivateFields | undefined;
  register: any;
  errors: any;
  control: any;
  toolTips: any;
  required: boolean;

  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
  options: readonly PlaceType[];
  value: PlaceType | null | undefined;
  setOptions: (options: readonly PlaceType[]) => void;
  setValue: (value: PlaceType | null) => void;
  setInputValue: (inputValue: string) => void;
  setPlaceId(placeId: string): void;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box sx={formStyles.inputTextContainer}>
      <DartaInputAdornment
        fieldName={fieldName}
        required={required}
        inputAdornmentString={inputAdornmentString}
        toolTips={toolTips}
        testIdValue={testIdValue}
      />
      {allowPrivate && (
        <DartaPrivateFieldHelper
          fieldName={fieldName}
          data={data}
          register={register}
          control={control}
          isPrivate={isPrivate}
          testIdValue={testIdValue}
          setIsPrivate={setIsPrivate}
          switchStringValue="isPrivate"
        />
      )}
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
        data-testid={`${testIdValue}-input-field`}
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
          <Box sx={formStyles.formTextField}>
            <TextField
              {...params}
              {...register(`${fieldName}.value`)}
              variant="standard"
              error={!!errors[fieldName]}
              helperText={errors[fieldName]?.value && helperTextString}
              required={required}
            />
          </Box>
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
    </Box>
  );
}
