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
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const [options, setOptions] = React.useState([...inputOptions]);
  const [inputValue, setInputValue] = React.useState(data?.value || '');

  const handleInputChange = (event: any, value: string) => {
    event.preventDefault();
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
  const testIdValue = fieldName.replace('.', '-');
  return (
    <Box
      sx={
        allowPrivate
          ? formStyles.inputTextContainer
          : formStyles.inputTextContainerTwoColumns
      }>
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
      <Box>
        <Controller
          key={fieldName}
          control={control}
          name={`${fieldName}.${'value'}`}
          render={({field}) => (
            <Autocomplete
              freeSolo
              id="autocomplete"
              inputValue={field.value}
              options={inputOptions}
              onInputChange={(event, newValue) => {
                field.onChange(newValue);
                handleInputChange(event, newValue);
              }}
              onBlur={handleAddNewOption}
              renderInput={params => (
                <Box sx={formStyles.formTextField}>
                  <TextField
                    {...(params as any)}
                    key={params.id}
                    label={label}
                    {...register(`${fieldName}.${'value'}`)}
                    error={!!errors[fieldName]}
                    variant="outlined"
                    data-testid={`${fieldName}-input-field`}
                  />
                </Box>
              )}
            />
          )}
        />
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
