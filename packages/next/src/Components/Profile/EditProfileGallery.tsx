import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {
  BusinessAddressType,
  IGalleryProfileData,
  PrivateFields,
} from '../../../globalTypes';
import {PRIMARY_BLUE} from '../../../styles';
import {googleMapsParser} from '../common/nextFunctions';
import {
  DartaGallerySearch,
  DartaImageInput,
  DartaLocationAndTimes,
  DartaTextInput,
} from '../FormComponents/index';
// import {PlacesAutocomplete} from '../../../ThirdPartyAPIs/PlacesAutocomplete';
// import {ImageUploadModal} from '../Modals/UploadImageModal';
import {profileStyles} from './Components/profileStyles';

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
    galleryLocation0: yup.object().shape({
      locationString: yup.object().shape({
        value: yup.string().required(),
        isPrivate: yup.boolean().optional(),
      }),
    }),
    primaryContact: yup.object().shape({
      value: yup.string().email('A valid email address is required'),
      isPrivate: yup.boolean().optional(),
    }),
    galleryPhoneNumber: yup.object().shape({
      value: yup.string().optional(),
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
  gallerySearch:
    'Search for your gallery to see if it already exists on google maps. We will populate the data from google.',
  galleryPhone:
    'A phone number allows users to reach out directly with questions.',
  galleryWebsite: 'A website allows users to learn more about your gallery.',
  galleryInstagram: 'Your instagram handle will be displayed on your profile.',
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
    setValue,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...galleryProfileData,
    },
    resolver: yupResolver(galleryDataSchema),
  });
  const [placeId, setPlaceId] = React.useState<any>(null);
  const [editImage, setEditImage] = React.useState<boolean>(false);
  const onSubmit = (data: any) => {
    const tempData = _.cloneDeep(data);
    if (
      !tempData.galleryLocation0.locationString.value &&
      tempData?.galleryLocation1?.locationString.value
    ) {
      tempData.galleryLocation0 = data.galleryLocation1;
      tempData.galleryLocation1 = {};
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

  const [autofillDetails, setAutofillDetails] = React.useState<any>();

  React.useEffect(() => {
    if (autofillDetails) {
      const {
        galleryAddress,
        lat,
        lng,
        mapsUrl,
        galleryName,
        galleryWebsite,
        galleryPhone,
        openHours,
      } = googleMapsParser(autofillDetails);
      if (galleryName) {
        setValue('galleryName.value', galleryName);
      }
      if (galleryAddress) {
        setValue('galleryLocation0.locationString.value', galleryAddress);
      }
      if (lat) {
        setValue('galleryLocation0.coordinates.latitude.value', lat);
      }
      if (lng) {
        setValue('galleryLocation0.coordinates.longitude.value', lng);
      }
      if (mapsUrl) {
        setValue('galleryLocation0.coordinates.googleMapsUrl.value', mapsUrl);
      }
      setValue('galleryLocation0.googleMapsPlaceId.value', placeId);
      if (openHours) {
        setValue(
          'galleryLocation0.businessHours.hoursOfOperation',
          openHours as any,
        );
      }
      if (galleryWebsite) {
        setValue('galleryWebsite.value', galleryWebsite);
      }
      if (galleryPhone) {
        setValue('galleryPhone.value', galleryPhone);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autofillDetails]);

  const addLocation = () => {
    if (!galleryProfileData?.galleryLocation1?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation1: {
          locationString: {value: null, isPrivate: false},
        },
      });
    } else if (!galleryProfileData?.galleryLocation2?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation2: {
          locationString: {value: null, isPrivate: false},
        },
      });
    } else if (!galleryProfileData?.galleryLocation3?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation3: {
          locationString: {value: null, isPrivate: false},
        },
      });
    } else if (!galleryProfileData?.galleryLocation4?.locationString?.value) {
      console.log('here');
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation4: {
          locationString: {value: null, isPrivate: false},
        },
      });
    }
  };

  const removeLocation = (locationNumber: BusinessAddressType) => {
    const galleryProfile = _.cloneDeep(galleryProfileData);
    if (galleryProfile[locationNumber]) {
      delete galleryProfile[locationNumber];
    }
    setGalleryProfileData(galleryProfile);
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
              <DartaImageInput
                onDrop={handleDrop}
                instructions="Drag and drop your logo here or click to select a file to upload."
              />
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
          <Box key="gallerySearch" sx={profileStyles.edit.inputText}>
            <DartaGallerySearch
              fieldName="gallerySearch"
              data={galleryProfileData.galleryName as PrivateFields}
              register={register}
              required={true}
              inputAdornmentString="Search by name"
              toolTips={toolTips}
              setAutofillDetails={setAutofillDetails}
              setPlaceId={setPlaceId}
              placeId={placeId}
            />
          </Box>
          <Box key="galleryName" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryName"
              data={
                getValues('galleryName') ||
                (galleryProfileData.galleryName as PrivateFields)
              }
              register={register}
              control={control}
              errors={errors}
              required={true}
              helperTextString={errors.galleryName?.value?.message}
              inputAdornmentString="Name"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={false}
              inputAdornmentValue={null}
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
              inputAdornmentValue={null}
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
              helperTextString={errors.primaryContact?.value?.message}
              inputAdornmentString="Contact"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryPhoneNumber" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryPhone"
              data={galleryProfileData.galleryPhone}
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.galleryPhone?.value?.message}
              inputAdornmentString="Phone Number"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryWebsite" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryWebsite"
              data={
                (getValues('galleryWebsite') as PrivateFields) ||
                galleryProfileData.galleryWebsite
              }
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.galleryPhone?.value?.message}
              inputAdornmentString="Website"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryInstagram" sx={profileStyles.edit.inputText}>
            <DartaTextInput
              fieldName="galleryInstagram"
              data={
                (getValues('galleryInstagram') as PrivateFields) ||
                galleryProfileData.galleryInstagram
              }
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.galleryInstagram?.value?.message}
              inputAdornmentString="Instagram Handle"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
          <Box
            key="gallerySocialMedia"
            sx={{
              ...profileStyles.edit.inputText,
              justifyContent: 'space-around',
            }}>
            <Typography variant="h5">Locations</Typography>
            <Button variant="contained" onClick={() => addLocation()}>
              Add Location
            </Button>
          </Box>
          {galleryProfileData.galleryLocation0 && (
            <DartaLocationAndTimes
              locationNumber="galleryLocation0"
              data={galleryProfileData.galleryLocation0 as any}
              register={register}
              toolTips={toolTips}
              getValues={getValues}
              setValue={setValue}
              removeLocation={removeLocation}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
            />
          )}
          {galleryProfileData.galleryLocation1 && (
            <DartaLocationAndTimes
              locationNumber="galleryLocation1"
              data={galleryProfileData.galleryLocation1 as any}
              register={register}
              toolTips={toolTips}
              getValues={getValues}
              setValue={setValue}
              removeLocation={removeLocation}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
            />
          )}
          {galleryProfileData.galleryLocation2 && (
            <DartaLocationAndTimes
              locationNumber="galleryLocation2"
              data={galleryProfileData.galleryLocation2 as any}
              register={register}
              toolTips={toolTips}
              getValues={getValues}
              removeLocation={removeLocation}
              setValue={setValue}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
            />
          )}
          {galleryProfileData.galleryLocation3 && (
            <DartaLocationAndTimes
              locationNumber="galleryLocation3"
              data={galleryProfileData.galleryLocation3 as any}
              register={register}
              toolTips={toolTips}
              getValues={getValues}
              removeLocation={removeLocation}
              setValue={setValue}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
            />
          )}
          {galleryProfileData.galleryLocation4 && (
            <DartaLocationAndTimes
              locationNumber="galleryLocation3"
              data={galleryProfileData.galleryLocation4 as any}
              register={register}
              toolTips={toolTips}
              getValues={getValues}
              removeLocation={removeLocation}
              setValue={setValue}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
            />
          )}

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
