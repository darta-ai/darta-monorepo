import 'firebase/compat/auth';

import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button} from '@mui/material';
import Head from 'next/head';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {PRIMARY_BLUE} from '../../../styles';
import {
  DartaImageInput,
  DartaLocationLookup,
  DartaTextInput,
} from '../FormComponents/index';
// import {PlacesAutocomplete} from '../../../ThirdPartyAPIs/PlacesAutocomplete';
// import {ImageUploadModal} from '../Modals/UploadImageModal';
import {profileStyles} from './Components/profileStyles';
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
    galleryPrimaryLocation: yup.object().shape({
      value: yup.string().optional(),
      isPrivate: yup.boolean().optional(),
    }),
    gallerySecondaryLocation: yup.object().shape({
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
  galleryPrimaryLocation:
    'The location of your gallery will help guide users to your openings.',
  gallerySecondaryLocation:
    'If you have a second address, please include it here. We only support two locations at this time.',
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

  const [editImage, setEditImage] = React.useState<boolean>(false);

  const onSubmit = (data: any) => {
    const tempData = data;
    if (
      !tempData.galleryPrimaryLocation.value &&
      tempData.gallerySecondaryLocation.value
    ) {
      tempData.galleryPrimaryLocation = data.gallerySecondaryLocation;
      tempData.gallerySecondaryLocation = {};
    }
    setGalleryProfileData(tempData);
    setIsEditingProfile(!isEditingProfile);
  };

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);

    setGalleryProfileData({
      ...galleryProfileData,
      galleryLogo: {value: previewURL},
    });
    // NEED API CALL TO UPLOAD IMAGE TO DATABASE
    setEditImage(!editImage);
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
        <Box sx={profileStyles.edit.imageContainer}>
          <Box style={profileStyles.edit.defaultImageEdit}>
            {editImage ? (
              <DartaImageInput onDrop={handleDrop} />
            ) : (
              <img
                src={galleryProfileData?.galleryLogo?.value as string}
                alt="gallery logo"
                style={profileStyles.edit.defaultImageEdit}
              />
            )}
          </Box>
          <Box sx={{width: '10vw', alignSelf: 'center'}}>
            <Button
              sx={{width: '10vw', alignSelf: 'center'}}
              onClick={() => setEditImage(!editImage)}
              variant="contained">
              {editImage ? 'Back' : 'Edit Image'}
            </Button>
          </Box>
        </Box>
        <Box sx={profileStyles.edit.inputTextContainer}>
          <Box key="galleryName" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryName"
              data={galleryProfileData.galleryName as PrivateFields}
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
              helperTextString={errors.galleryBio?.value?.message}
              inputAdornmentString="Bio"
              toolTips={toolTips}
              multiline={true}
              allowPrivate={false}
            />
          </Box>
          {galleryProfileData.galleryPrimaryLocation && (
            <Box key="galleryPrimaryLocation" sx={profileStyles.edit.inputText}>
              <DartaLocationLookup
                toolTips={toolTips}
                fieldName="galleryPrimaryLocation"
                data={galleryProfileData.galleryPrimaryLocation}
                register={register}
                errors={errors}
                required={false}
                control={control}
                helperTextString={errors.galleryPrimaryLocation?.value?.message}
                inputAdornmentString="Location"
                multiline={false}
                allowPrivate={true}
              />
            </Box>
          )}
          {galleryProfileData.gallerySecondaryLocation && (
            <Box
              key="gallerySecondaryLocation"
              sx={profileStyles.edit.inputText}>
              <DartaLocationLookup
                toolTips={toolTips}
                fieldName="gallerySecondaryLocation"
                data={galleryProfileData.gallerySecondaryLocation}
                register={register}
                errors={errors}
                required={false}
                control={control}
                helperTextString={
                  errors.gallerySecondaryLocation?.value?.message
                }
                inputAdornmentString="Alt Location"
                multiline={false}
                allowPrivate={true}
              />
            </Box>
          )}
          <Box key="primaryContact" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="primaryContact"
              data={galleryProfileData.primaryContact}
              register={register}
              errors={errors}
              required={false}
              control={control}
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
