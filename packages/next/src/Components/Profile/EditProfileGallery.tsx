import 'firebase/compat/auth';

import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button} from '@mui/material';
import Head from 'next/head';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {PRIMARY_BLUE} from '../../../styles';
import {DartaTextInput} from '../Forms/DartaTextInput';
// import {PlacesAutocomplete} from '../../../ThirdPartyAPIs/PlacesAutocomplete';
// import {ImageUploadModal} from '../Modals/UploadImageModal';
import {profileStyles} from './profileStyles';
import {IGalleryProfileData, PrivateFields} from './types';

const galleryDataSchema = yup
  .object({
    galleryName: yup.object().shape({
      value: yup.string().required('A gallery name is required'),
    }),
    galleryBio: yup.object().shape({
      value: yup
        .string()
        .max(500, 'Please limit your bio to 500 characters')
        .required(
          'Please include a short bio - up to 500 characters - about your gallery.',
        ),
    }),
    galleryLocation: yup.object().shape({
      value: yup.string().optional(),
      isPrivate: yup.boolean().optional(),
    }),
    primaryContact: yup.object().shape({
      value: yup.string().email('A valid email address is required'),
      isPrivate: yup.boolean().optional(),
    }),
  })
  .required();

const toolTips = {
  galleryName: 'Your gallery name will appear on your openings and artwork.',
  galleryLogo:
    'Your gallery logo will appear on the splash page for your openings and artworks that you have uploaded.',
  galleryBio:
    'A short bio about your gallery will be associated with your openings and artworks.',
  galleryLocation:
    'The location of your gallery will help guide users to your openings.',
  primaryContact:
    'A primary email address allows users to reach out directly with questions. Typically, info@email.',
};

export function EditProfileGallery({
  isEditingProfile,
  setIsEditingProfile,
  setGalleryProfileData,
  galleryProfileData,
}: {
  isEditingProfile: boolean;
  setIsEditingProfile: (T: boolean) => void;
  setGalleryProfileData: (T: IGalleryProfileData) => void;
  galleryProfileData: IGalleryProfileData;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...galleryProfileData,
    },
    resolver: yupResolver(galleryDataSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setGalleryProfileData(data);
    setIsEditingProfile(!isEditingProfile);
  };

  return (
    <>
      <Head>
        <title>Gallery | Edit Profile</title>
        <meta name="description" content="Edit your gallery." />
      </Head>
      <Box mb={2} sx={profileStyles.container}>
        <Box sx={profileStyles.edit.backButton}>
          <Button
            variant="outlined"
            sx={{color: PRIMARY_BLUE}}
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            startIcon={<ArrowBackIcon sx={{color: PRIMARY_BLUE}} />}>
            Back
          </Button>
        </Box>
        <Box sx={profileStyles.edit.inputTextContainer}>
          <Box key="galleryName" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryName"
              data={galleryProfileData.galleryName as PrivateFields}
              defaultValue={galleryProfileData?.galleryName?.value}
              register={register}
              control={control}
              errors={errors}
              required={true}
              helperTextString={errors.galleryName?.value?.message}
              inputAdornmentString="Name"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={false}
            />
          </Box>
          <Box key="galleryBio" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryBio"
              data={galleryProfileData.galleryBio as PrivateFields}
              register={register}
              errors={errors}
              required={false}
              control={control}
              defaultValue={galleryProfileData.galleryBio?.value}
              helperTextString={errors.galleryBio?.value?.message}
              inputAdornmentString="Bio"
              toolTips={toolTips}
              multiline={true}
              allowPrivate={false}
            />
          </Box>
          <Box key="galleryPrimaryLocation" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryPrimaryLocation"
              data={galleryProfileData.galleryPrimaryLocation}
              register={register}
              errors={errors}
              required={false}
              control={control}
              defaultValue={galleryProfileData.galleryPrimaryLocation?.value}
              helperTextString={errors.galleryAddress?.value?.message}
              inputAdornmentString="Location"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={true}
            />
          </Box>
          <Box key="primaryContact" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="primaryContact"
              data={galleryProfileData.primaryContact}
              register={register}
              errors={errors}
              required={false}
              control={control}
              defaultValue={galleryProfileData.primaryContact?.value}
              helperTextString={errors.primaryContact?.value?.message}
              inputAdornmentString="Contact"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={true}
            />
          </Box>
          <Box sx={profileStyles.edit.saveButton}>
            <Button
              variant="contained"
              data-testid="save-button"
              type="submit"
              sx={{backgroundColor: PRIMARY_BLUE}}
              onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
