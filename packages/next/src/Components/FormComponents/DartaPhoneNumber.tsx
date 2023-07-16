/* eslint-disable react/jsx-props-no-spreading */
import {Box, InputAdornment, TextField, Typography} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';
import {PatternFormat} from 'react-number-format';

import {PrivateFields} from '../Profile/types';
import {DartaInputAdornment, DartaPrivateFieldHelper} from './Components';
import {formStyles} from './styles';

type ToolTip = {
  [key: string]: string;
};

export function PhoneNumberFormat(props: any) {
  const {onChange, ...other} = props;
  return (
    <PatternFormat
      {...other}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      format="+1 (###) ###-####"
      mask="_"
    />
  );
}

export function DartaPhoneNumber({
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
}) {
  const [isPrivate, setIsPrivate] = React.useState<boolean>(data?.isPrivate!);
  const innerWidthRef = React.useRef(800);
  React.useEffect(() => {
    innerWidthRef.current = window.innerWidth;
  }, []);
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
          allowPrivate={allowPrivate}
          isPrivate={isPrivate}
          testIdValue={testIdValue}
          setIsPrivate={setIsPrivate}
          switchStringValue="isPrivate"
        />
      )}
      <Box sx={formStyles.formTextField}>
        <Controller
          control={control}
          name={fieldName}
          key={fieldName}
          {...register(`${fieldName}.${'value'}`)}
          render={({field}) => (
            <TextField
              {...field}
              id="value"
              variant="standard"
              error={!!errors[fieldName]}
              helperText={
                errors[fieldName]?.value && (
                  <Typography
                    data-testid={`${fieldName}-text-error-field`}
                    sx={{color: 'red'}}>
                    {helperTextString}
                  </Typography>
                )
              }
              fullWidth
              required={required}
              data-testid={`${fieldName}-input-field`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {inputAdornmentValue}
                  </InputAdornment>
                ),
                inputComponent: PhoneNumberFormat,
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
}
