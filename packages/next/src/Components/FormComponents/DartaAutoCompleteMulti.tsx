/* eslint-disable react/jsx-props-no-spreading */

import {Box, TextField} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';
import {Controller} from 'react-hook-form';

import {PrivateFields} from '../Profile/types';
import {DartaInputAdornment, DartaPrivateFieldHelper} from './Components';
import {formStyles} from './styles';

export const DartaAutoCompleteMulti = React.forwardRef(({
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
  helperTextString,
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
  helperTextString: string | undefined;
  inputOptions: Array<{
    label?: string;
    value?: string;
    category?: string;
  }>;
}, ) => {
  const testIdValue = fieldName.replace('.', '-');

  const style = allowPrivate ? formStyles.inputTextContainer : formStyles.inputTextContainerTwoColumns;
  return (
    <Box sx={{ ...style, maxWidth: '20vw' }}>
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
          isPrivate={false}
          testIdValue={testIdValue}
          setIsPrivate={() => { }}
          switchStringValue="isPrivate"
        />
      )}
      <Box>
        <Controller
          key={fieldName}
          control={control}
          name={fieldName}
          {...register(fieldName)}
          render={({ field }) => (
            <Autocomplete
                multiple
                id="autocompleteMulti"
                value={Array.isArray(field.value) ? field.value : []}
                options={inputOptions}
                freeSolo
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={params => (
                  <Box sx={formStyles.formTextField}>
                    <TextField
                      {...params}
                      key={params.id}
                      label={label}
                      error={!!errors[fieldName]}
                      helperText={errors[fieldName] ? helperTextString : null}
                      variant="outlined"
                      data-testid={`${fieldName}-input-field`}
                    />
                  </Box>
                )}
              />
          )}
        />
      </Box>
    </Box>
    );
  })
