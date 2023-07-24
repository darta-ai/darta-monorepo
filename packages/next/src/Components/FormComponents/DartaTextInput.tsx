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
  multiline,
  allowPrivate,
  inputAdornmentValue,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  errors: any;
  toolTips: ToolTip | any;
  required: boolean;
  multiline: number;
  helperTextString: string | undefined;
  inputAdornmentString: string;
  allowPrivate: boolean;
  inputAdornmentValue: string | null;
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
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
          allowPrivate={allowPrivate}
          isPrivate={isPrivate}
          testIdValue={testIdValue}
          setIsPrivate={setIsPrivate}
          switchStringValue="isPrivate"
        />
      )}
      <Box sx={formStyles.formTextField}>
        <TextField
          id="value"
          variant="standard"
          error={!!errors[fieldName]}
          {...register(`${fieldName}.${'value'}`)}
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
          rows={multiline}
          InputProps={{
            style: {display: 'inline'},
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
    </Box>
  );
}
