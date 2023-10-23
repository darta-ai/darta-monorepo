/* eslint-disable react/jsx-props-no-spreading */

import {Box, TextField, Typography} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';
import {Controller} from 'react-hook-form';

import {PrivateFields} from '../Profile/types';
import {DartaInputAdornment, DartaPrivateFieldHelper} from './Components';
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
}) {

  // const handleInputChange = (event: any, value: string) => {
  //   event.preventDefault();
  //   setInputValue(value);
  // };

  // const handleAddNewOption = () => {
  //   const newOption = {
  //     label: inputValue.trim(),
  //     value: inputValue.trim(),
  //   };

  //   if (newOption) {
  //     setOptions([...options, newOption]);
  //   }
  // };
  const testIdValue = fieldName.replace('.', '-');
  const style = allowPrivate ? formStyles.inputTextContainer : formStyles.inputTextContainerTwoColumns;

  return (
    <Box
      sx={{...style}}>
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
          setIsPrivate={() => { }}
          testIdValue={testIdValue}
          switchStringValue="isPrivate"
        />
      )}
      <Box>
        <Controller
          key={fieldName}
          control={control}
          name={`${fieldName}.${'value'}`}
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => {
            if (true) {
              return (
                <Autocomplete
                  freeSolo
                  autoSelect
                  id="autocomplete"
                  inputValue={field?.value}
                  options={inputOptions}
                  onInputChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <Box sx={formStyles.formTextField}>
                      <TextField
                        {...(params as any)}
                        key={params?.id}
                        label={label}
                        error={!!errors[fieldName]}
                        variant="outlined"
                        data-testid={`${fieldName}-input-field`}
                      />
                    </Box>
                  )}
                />
                )
            } 
              return (
                <Box/>
              )
            
            
            }}/>
        {errors[fieldName]?.value && (
          <Typography
            data-testid={`${testIdValue}-text-error-field`}
            sx={{color: 'red'}}>
            {helperTextString}
          </Typography>
        )}
      </Box>
    </Box>
  );
}