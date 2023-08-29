import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {
  BusinessAddressType,
  PrivateFields,
} from '../../../globalTypes';
import {IGalleryProfileData} from '@darta/types'
import {PRIMARY_BLUE} from '../../../styles';
import {googleMapsParser} from '../../common/nextFunctions';
import {createArtworkStyles} from '../Artwork/styles';
import {
  DartaGallerySearch,
  DartaImageInput,
  DartaLocationAndTimes,
  DartaPhoneNumber,
  DartaTextInput,
} from '../FormComponents/index';
import {profileStyles} from './Components/profileStyles';

const instagramREGEX =
  /(?:^|[^\w])(?:@)([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/;

const phoneRegExp = /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/;

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
        value: yup.string().optional(),
        isPrivate: yup.boolean().optional(),
      }),
    }),
    primaryContact: yup.object().shape({
      value: yup.string().email('A valid email address is required'),
      isPrivate: yup.boolean().optional(),
    }),
    galleryPhone: yup.object().shape({
      value: yup.string().matches(phoneRegExp, {
        message: 'A valid phone number is required (e.g., +1 (216) 633-7221)',
        excludeEmptyString: true,
      }),
      isPrivate: yup.boolean().optional(),
    }),
    galleryWebsite: yup.object().shape({
      value: yup
        .string()
        .url(
          'Invalid URL. Please enter a valid URL (i.e., begins with http://www).',
        )
        .nullable()
        .notRequired(),
      isPrivate: yup.boolean().optional(),
    }),
    galleryInstagram: yup.object().shape({
      value: yup
        .string()
        .matches(instagramREGEX, {
          message: 'Please include a valid Instagram handle, such as @darta',
          excludeEmptyString: true,
        })
        .optional(),
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
    'A primary email address lets users reach out directly with questions. Typically, info@email.',
  gallerySearch:
    'Search for your gallery to see if it already exists on google maps. We populate the data from google.',
  galleryPhone:
    'A phone number allows users to reach out directly with questions.',
  galleryWebsite: 'A website allows users to learn more about your gallery.',
  galleryInstagram: 'Your instagram handle will be displayed on your profile.',
};

const toolTipsLocations = {
  'galleryLocation0.locationString': 'The primary location of your gallery.',
  'galleryLocation0.businessHours':
    'The hours of operation for your primary gallery location.',
  'galleryLocation1.locationString': 'The secondary location of your gallery.',
  'galleryLocation1.businessHours':
    'The hours of operation for your secondary gallery location.',
  'galleryLocation2.locationString': 'The third location of your gallery.',
  'galleryLocation2.businessHours':
    'The hours of operation for your third location.',
  'galleryLocation3.locationString': 'The fourth location of your gallery.',
  'galleryLocation3.businessHours':
    'The hours of operation for your fourth location.',
  'galleryLocation4.locationString':
    'The fifth location of your gallery. Congrats.',
  'galleryLocation4.businessHours':
    'The hours of operation for your fifth location.',
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
  const [editImage, setEditImage] = React.useState<boolean>(
    !galleryProfileData?.galleryLogo?.value,
  );
  const onSubmit = (data: any) => {
    const tempData = _.cloneDeep(data);
    if (
      !tempData.galleryLocation0.locationString.value &&
      tempData?.galleryLocation1?.locationString.value
    ) {
      tempData.galleryLocation0 = data.galleryLocation1;
      tempData.galleryLocation1 = {};
    }
    if (tempData.galleryLocation0 && !tempData?.galleryLocation0?.locationId)
      tempData.galleryLocation0.locationId = crypto.randomUUID();

    setGalleryProfileData(data);
    setIsEditingProfile(!isEditingProfile);
  };

  const [tempImage, setTempImage] = React.useState<string | null>(null);

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);

    setValue('galleryLogo', {value: previewURL});
    setTempImage(previewURL);
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
        setValue(
          'galleryLocation0.coordinates.googleMapsPlaceId.value',
          mapsUrl,
        );
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
          locationId: crypto.randomUUID(),
        },
      });
    } else if (!galleryProfileData?.galleryLocation2?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation2: {
          locationString: {value: null, isPrivate: false},
          locationId: crypto.randomUUID(),
        },
      });
    } else if (!galleryProfileData?.galleryLocation3?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation3: {
          locationString: {value: null, isPrivate: false},
          locationId: crypto.randomUUID(),
        },
      });
    } else if (!galleryProfileData?.galleryLocation4?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation4: {
          locationString: {value: null, isPrivate: false},
          locationId: crypto.randomUUID(),
        },
      });
    }
  };

  const removeLocation = (locationNumber: BusinessAddressType) => {
    const galleryProfile = _.cloneDeep(galleryProfileData);
    if (galleryProfile[locationNumber]) {
      delete galleryProfile[locationNumber];
    }
    setValue(`${locationNumber}`, undefined);
    setGalleryProfileData({...galleryProfile});
  };

  return (
    <Box mb={2} sx={profileStyles.container}>
      <Box sx={createArtworkStyles.backButton}>
        <Button
          variant="outlined"
          data-testid="edit-profile-back-button"
          sx={{color: PRIMARY_BLUE}}
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          startIcon={<ArrowBackIcon sx={{color: PRIMARY_BLUE}} />}>
          Cancel
        </Button>
      </Box>
      <Box sx={createArtworkStyles.imageContainer}>
        <Box sx={createArtworkStyles.defaultImageEdit}>
          {editImage ? (
            <DartaImageInput
              onDrop={handleDrop}
              instructions="Drag and drop your logo here or click to select a file to upload."
            />
          ) : (
            <Box
              component="img"
              src={
                tempImage ??
                (galleryProfileData?.galleryLogo?.value as string) ??
                ''
              }
              alt="gallery logo"
              sx={createArtworkStyles.defaultImageEdit}
            />
          )}
        </Box>
      </Box>
      <Box sx={{alignSelf: 'center'}}>
        <Button
          sx={{width: '40vw', alignSelf: 'center'}}
          onClick={() => setEditImage(!editImage)}
          data-testid="edit-image-button"
          variant="contained">
          <Typography
            sx={{fontSize: '0.8rem'}}
            data-testid="create-gallery-image-back-button-test">
            {editImage ? 'Back' : 'Edit Image'}
          </Typography>
        </Button>
      </Box>
      <Box sx={createArtworkStyles.inputTextContainer}>
        <Box
          key="gallerySearch"
          sx={{...createArtworkStyles.inputText, mt: 10}}>
          <DartaGallerySearch
            fieldName="gallerySearch"
            data={"" as any}
            register={register}
            required={true}
            inputAdornmentString="Search"
            toolTips={toolTips}
            setAutofillDetails={setAutofillDetails}
            setPlaceId={setPlaceId}
            placeId={placeId}
          />
        </Box>
        <Box key="galleryName" sx={createArtworkStyles.inputText}>
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
            multiline={1}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box key="galleryBio" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="galleryBio"
            data={galleryProfileData.galleryBio as PrivateFields}
            register={register}
            errors={errors}
            required={true}
            control={control}
            helperTextString={errors.galleryBio?.value?.message}
            inputAdornmentString="Bio"
            toolTips={toolTips}
            multiline={4}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box
          key="gallerySocialMedia"
          sx={{
            ...createArtworkStyles.inputText,
            justifyContent: 'space-around',
          }}>
          <Typography variant="h5">Contact</Typography>
        </Box>
        <Box key="primaryContact" sx={createArtworkStyles.multiLineContainer}>
          <Box key="inputText" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName="primaryContact"
              data={galleryProfileData.primaryContact}
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.primaryContact?.value?.message}
              inputAdornmentString="Email"
              toolTips={toolTips}
              multiline={1}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryPhone" sx={createArtworkStyles.inputText}>
            <DartaPhoneNumber
              fieldName="galleryPhone"
              data={galleryProfileData.galleryPhone}
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.galleryPhone?.value?.message}
              inputAdornmentString="Phone"
              toolTips={toolTips}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
        </Box>
        <Box key="primaryContact" sx={createArtworkStyles.multiLineContainer}>
          <Box key="galleryWebsite" sx={createArtworkStyles.inputText}>
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
              helperTextString={errors.galleryWebsite?.value?.message}
              inputAdornmentString="Website"
              toolTips={toolTips}
              multiline={1}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryInstagram" sx={createArtworkStyles.inputText}>
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
              inputAdornmentString="Instagram"
              toolTips={toolTips}
              multiline={1}
              allowPrivate={true}
              inputAdornmentValue={null}
            />
          </Box>
        </Box>
        <Box
          key="galleryLocations"
          sx={{
            ...createArtworkStyles.inputText,
            justifyContent: 'space-around',
            flexDirection: 'column',
            gap: '2vh',
          }}>
          <Typography variant="h5">Locations</Typography>
          <Button
            variant="contained"
            data-testid="add-location"
            onClick={() => addLocation()}>
            Add Location
          </Button>
        </Box>
        <Box key="galleryLocation" sx={createArtworkStyles.inputText}>
          <DartaLocationAndTimes
            locationNumber="galleryLocation0"
            data={galleryProfileData.galleryLocation0 as any}
            register={register}
            toolTips={toolTipsLocations}
            getValues={getValues}
            setValue={setValue}
            removeLocation={removeLocation}
            errors={errors}
            control={control}
            galleryProfileData={galleryProfileData}
            locationDisplay="Location 1"
          />
        </Box>
        {galleryProfileData.galleryLocation1 && (
          <Box key="galleryLocation" sx={createArtworkStyles.inputText}>
            <DartaLocationAndTimes
              locationNumber="galleryLocation1"
              data={galleryProfileData.galleryLocation1 as any}
              register={register}
              toolTips={toolTipsLocations}
              getValues={getValues}
              setValue={setValue}
              removeLocation={removeLocation}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
              locationDisplay="Location 2"
            />
          </Box>
        )}
        {galleryProfileData.galleryLocation2 && (
          <Box key="galleryLocation" sx={createArtworkStyles.inputText}>
            <DartaLocationAndTimes
              locationNumber="galleryLocation2"
              data={galleryProfileData.galleryLocation2 as any}
              register={register}
              toolTips={toolTipsLocations}
              getValues={getValues}
              removeLocation={removeLocation}
              setValue={setValue}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
              locationDisplay="Location 3"
            />
          </Box>
        )}
        {galleryProfileData.galleryLocation3 && (
          <Box key="galleryLocation" sx={createArtworkStyles.inputText}>
            <DartaLocationAndTimes
              locationNumber="galleryLocation3"
              data={galleryProfileData.galleryLocation3 as any}
              register={register}
              toolTips={toolTipsLocations}
              getValues={getValues}
              removeLocation={removeLocation}
              setValue={setValue}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
              locationDisplay="Location 4"
            />
          </Box>
        )}
        {galleryProfileData.galleryLocation4 && (
          <Box key="galleryLocation" sx={createArtworkStyles.inputText}>
            <DartaLocationAndTimes
              locationNumber="galleryLocation4"
              data={galleryProfileData.galleryLocation4 as any}
              register={register}
              toolTips={toolTipsLocations}
              getValues={getValues}
              removeLocation={removeLocation}
              setValue={setValue}
              errors={errors}
              control={control}
              galleryProfileData={galleryProfileData}
              locationDisplay="Location 5"
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            mt: 10,
          }}>
          <Button
            variant="contained"
            type="submit"
            data-testid="save-profile-edit-button"
            sx={{backgroundColor: PRIMARY_BLUE}}
            onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
