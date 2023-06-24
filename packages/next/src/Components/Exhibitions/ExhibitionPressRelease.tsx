import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import {
  DartaAutoComplete,
  DartaImageInput,
  DartaRadioButtonsGroup,
  DartaTextInput,
} from '../FormComponents/index';

const schema = yup.object().shape({
  pressReleaseText: yup.string().required(),
  pressReleaseImage: yup.string().required(),
  artists: yup.array().of(yup.string().required()).required(),
});

function ExhibitionPressRelease() {
  const {handleSubmit, control, register, reset} = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="pressReleaseText"
        control={control}
        defaultValue=""
        render={({field}) => (
          <DartaTextInput {...field} placeholder="Enter press release text" />
        )}
      />
      <Controller
        name="pressReleaseImage"
        control={control}
        defaultValue=""
        render={({field}) => (
          <DartaImageInput
            {...field}
            placeholder="Upload press release image"
          />
        )}
      />
      <Controller
        name="artists"
        control={control}
        defaultValue={['']}
        render={({field}) =>
          field.value.map((artist, index) => (
            <DartaTextInput
              key={index}
              value={artist}
              onChange={e => {
                const artists = [...field.value];
                artists[index] = e.target.value;
                field.onChange(artists);
              }}
              placeholder="Enter artist name"
            />
          ))
        }
      />
      <button
        type="button"
        onClick={() => {
          const {value} = register('artists');
          value.push('');
          register('artists').onChange(value);
        }}>
        Add Artist
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ExhibitionPressRelease;
