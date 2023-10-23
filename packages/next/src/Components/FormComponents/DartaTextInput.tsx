/* eslint-disable react/jsx-props-no-spreading */
import {Box, InputAdornment, TextField, Typography} from '@mui/material';
import React from 'react';

import {PrivateFields} from '../Profile/types';
import {DartaInputAdornment, DartaPrivateFieldHelper} from './Components';
import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function DartaTextInput({
  fieldName,
  data,
  register,
  control,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
  toolTips,
  allowPrivate,
  inputAdornmentValue,
  rows,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  errors: any;
  toolTips: ToolTip | any;
  required: boolean;
  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
  inputAdornmentValue: string | null;
  rows?: number | null;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const testIdValue = fieldName.replace('.', '-');
  const [lines, numberOfLines] = React.useState<number>(1);
  const [inputValue, setInputValue] = React.useState(data?.value || '');

  const handleInputChange = (event: any, value: string) => {
    event.preventDefault();
    setInputValue(value);
  };

  
  React.useEffect(() => {
    const windowWidth = window.innerWidth;
    const divisor = windowWidth > 1280 ? 80 : 120;
    const newLines = Math.ceil(inputValue.length / divisor);
    numberOfLines(newLines);
  }, [inputValue])

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
        <TextField
          id="value"
          variant="standard"
          error={!!errors[fieldName]}
          {...register(`${fieldName}.${'value'}`)}
          onChange={(event) => handleInputChange(event, event.target.value)}
          helperText={
            errors[fieldName]?.value && (
              <Typography
                data-testid={`${testIdValue}-text-error-field`}
                sx={{color: 'red'}}>
                {helperTextString}
              </Typography>
            )
          }
          fullWidth
          required={required}
          multiline
          data-testid={`${testIdValue}-input-field`}
          rows={rows ?? lines}
          InputProps={{
            startAdornment: (
              <InputAdornment
                data-testid={`${testIdValue}-text-input-adornment`}
                position="start">
                {inputAdornmentValue}
              </InputAdornment>
            ),
          }}
        />
    </Box>
  );
}

DartaTextInput.defaultProps = {
  rows: null,
};

