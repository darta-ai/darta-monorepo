import * as Colors from '@darta-styles'
import {
  BusinessAddressType,
  IGalleryProfileData,
  PrivateFields,
} from '@darta-types';
import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, Typography} from '@mui/material';
import _ from 'lodash';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {updateGalleryProfileAPI} from '../../API/galleries/galleryRoutes';
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


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
  galleryInternalEmail:
    'darta will contact you when a user inquires about an artwork. This email will not be displayed publicly.',
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
  const galleryDataSchema = yup
  .object({
    galleryName: yup.object().shape({
      value: yup.string().required('A gallery name is required'),
    }),
    galleryBio: yup.object().shape({
      value: yup
        .string()
        .max(750, `Please limit your bio to 750 characters`)
        .required(
          'Please include a short bio - up to 750 characters - about your gallery.',
        ),
    }),
    galleryLocation0: yup.object().shape({
      locationString: yup.object().shape({
        value: yup.string().optional(),
        isPrivate: yup.boolean().optional(),
      }),
    }),
    galleryInternalEmail: yup.object().shape({
      value: yup.string().email('A valid email address is required').required('A valid email address is required'),
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
  const onSubmit = async (data: any) => {
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

    try {
      const {data} = await updateGalleryProfileAPI(tempData);
      setGalleryProfileData(data);
    } catch (error) {
      // TO-DO: need an error modal
    }
    // setGalleryProfileData(tempData);
    setIsEditingProfile(!isEditingProfile);
  };


  const [tempImage, setTempImage] = React.useState<string | null>(null);

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);

    const reader = new FileReader();

    reader.onload = event => {
      // event.target.result contains the file's data as a base64 encoded string.
      if (event.target?.result) {
        const fileData = event.target.result;
        setValue('galleryLogo.fileData', fileData);
      }
    };

    reader.readAsDataURL(file); // Read the file content as Data URL.

    setTempImage(previewURL);
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
        locality,
        city,
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
      if (city) {
        setValue(`galleryLocation0.city.value`, city);
      }
      if (locality) {
        setValue(`galleryLocation0.locality.value`, locality);
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
  }, [autofillDetails]);

  // eslint-disable-next-line consistent-return
  function addLocation() {
    if (!galleryProfileData?.galleryLocation1?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation1: {
          locationString: {value: null, isPrivate: false},
          locationId: crypto.randomUUID(),
        },
      });
    } if (!galleryProfileData?.galleryLocation2?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation2: {
          locationString: {value: null, isPrivate: false},
          locationId: crypto.randomUUID(),
        },
      });
    } if (!galleryProfileData?.galleryLocation3?.locationString?.value) {
      return setGalleryProfileData({
        ...galleryProfileData,
        galleryLocation3: {
          locationString: {value: null, isPrivate: false},
          locationId: crypto.randomUUID(),
        },
      });
    } if (!galleryProfileData?.galleryLocation4?.locationString?.value) {
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
    <Box my={5} sx={profileStyles.container}>
      <Box sx={createArtworkStyles.backButton}>
        <Button
          variant="outlined"
          data-testid="edit-profile-back-button"
          sx={{color: Colors.PRIMARY_600}}
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          startIcon={<ArrowBackIcon sx={{color: Colors.PRIMARY_600}} />}>
          Cancel
        </Button>
      </Box>
      <Box sx={createArtworkStyles.imageAndKeyInformationContainer}>
        <Box sx={createArtworkStyles.keyInformationContainer}>
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
                    sx={createArtworkStyles.defaultImage}
                  />
                )}
              </Box>
          </Box>
        <Box sx={{alignSelf: 'center'}}>
            <Button
              sx={{width: '30vw', alignSelf: 'center'}}
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
        </Box>
        <Box sx={createArtworkStyles.keyInformationContainer}>
          <Box key="gallerySearch" sx={createArtworkStyles.multiLineContainer}>
            <DartaGallerySearch
                fieldName="gallerySearch"
                data={'' as any}
                register={register}
                required
                inputAdornmentString="Search"
                toolTips={toolTips}
                setAutofillDetails={setAutofillDetails}
                setPlaceId={setPlaceId}
                placeId={placeId}
              />
          </Box>
          <Box key="galleryName" sx={createArtworkStyles.multiLineContainer}>
            <DartaTextInput
                fieldName="galleryName"
                data={
                  getValues('galleryName') ||
                  (galleryProfileData.galleryName as PrivateFields)
                }
                register={register}
                control={control}
                errors={errors}
                required
                helperTextString={errors.galleryName?.value?.message}
                inputAdornmentString="Name"
                toolTips={toolTips}
                allowPrivate={false}
                inputAdornmentValue={null}
              />
          </Box>
          <Box key="galleryInternalEmail" sx={createArtworkStyles.multiLineContainer}>
            <DartaTextInput
                fieldName="galleryInternalEmail"
                data={
                  getValues('galleryInternalEmail') ||
                  (galleryProfileData.galleryInternalEmail as PrivateFields)
                }
                register={register}
                control={control}
                errors={errors}
                required
                helperTextString={errors.galleryInternalEmail?.value?.message}
                inputAdornmentString="Internal Email"
                toolTips={toolTips}
                allowPrivate={false}
                inputAdornmentValue={null}
              />
          </Box>
        </Box>
      </Box>
      <Box sx={createArtworkStyles.imageAndKeyInformationContainer}>
        <Box sx={createArtworkStyles.keyInformationContainer}>
          <Typography variant="h6" sx={{alignSelf: 'center'}}>Contact</Typography>
          <Box key="primaryContact" sx={createArtworkStyles.multiLineContainer}>
            <DartaTextInput
              fieldName="primaryContact"
              data={galleryProfileData.primaryContact}
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.primaryContact?.value?.message}
              inputAdornmentString="External Email"
              toolTips={toolTips}
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryPhone" sx={createArtworkStyles.multiLineContainer} >
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
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryWebsite" sx={createArtworkStyles.multiLineContainer}>
            <DartaTextInput
              fieldName="galleryWebsite"
              data={
                (getValues('galleryWebsite') as PrivateFields) ||
                galleryProfileData.galleryWebsite || "@"
              }
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.galleryWebsite?.value?.message}
              inputAdornmentString="Website"
              toolTips={toolTips}
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="galleryInstagram" sx={createArtworkStyles.multiLineContainer} >
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
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
        </Box>
        <Box sx={createArtworkStyles.keyInformationContainer}>
        <Typography variant="h6" sx={{alignSelf: 'center'}}>Bio</Typography>
        <Box key="galleryBio" sx={createArtworkStyles.multiLineContainer}>
            <DartaTextInput
              fieldName="galleryBio"
              data={galleryProfileData.galleryBio as PrivateFields}
              register={register}
              errors={errors}
              required
              control={control}
              helperTextString={errors.galleryBio?.value?.message}
              inputAdornmentString="Bio"
              toolTips={toolTips}
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{display: "flex", flexDirection: "row", gap: '4vw', alignContent: 'center', justifyContent: "center"}}>
        <Typography variant="h5">Locations</Typography>
          <Button
          sx={{backgroundColor: Colors.PRIMARY_900, color: Colors.PRIMARY_100}}
          data-testid="add-location"
          onClick={() => addLocation()}>
          Add Location
        </Button>
      </Box>
      <Box sx={createArtworkStyles.locationContainer}>
        <Box key="galleryLocation" sx={createArtworkStyles.multiLineContainer}>
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
      </Box>
      <Box sx={createArtworkStyles.locationContainer}>
        {galleryProfileData.galleryLocation1 && (
          <Box key="galleryLocation" sx={{...createArtworkStyles.multiLineContainer, width: '100%'}}>
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
      </Box>
      <Box sx={createArtworkStyles.locationContainer}>
          {galleryProfileData.galleryLocation2 && (
          <Box key="galleryLocation" sx={{...createArtworkStyles.multiLineContainer, width: '100%'}}>
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
      </Box>
      <Box sx={createArtworkStyles.locationContainer}>
          {galleryProfileData.galleryLocation3 && (
          <Box key="galleryLocation" sx={{...createArtworkStyles.multiLineContainer, width: '100%', alignSelf: "center"}}>
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
        </Box>
          {galleryProfileData.galleryLocation4 && (
            <Box sx={createArtworkStyles.locationContainer}>
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
          <Box sx={{...createArtworkStyles.multiLineContainer}}>
            <Button 
              variant="contained"
              type="submit"
              data-testid="save-profile-edit-button"
              sx={{backgroundColor: Colors.PRIMARY_900, color: Colors.PRIMARY_100}}
              onClick={handleSubmit(onSubmit)}>
              Save Gallery
            </Button>
          </Box>
      </Box>
  );
}
