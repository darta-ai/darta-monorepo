/* eslint-disable react/jsx-props-no-spreading */
import 'firebase/compat/auth';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import Head from 'next/head';
import React from 'react';
import {useForm} from 'react-hook-form';

import {PRIMARY_BLUE} from '../../../styles';
// import {PlacesAutocomplete} from '../../../ThirdPartyAPIs/PlacesAutocomplete';
// import {ImageUploadModal} from '../Modals/UploadImageModal';
import {profileStyles} from './profileStyles';

interface GalleryFields {
  galleryLogo?: string;
  galleryName?: string;
  galleryBio?: string;
  galleryAddress?: string;
  galleryZip?: string;
  primaryContact?: string;
}

const galleryFields: GalleryFields = {
  galleryLogo: '',
  galleryName: 'Hello',
  galleryBio: '',
  galleryAddress: '',
  galleryZip: '',
  primaryContact: '',
};

function GalleryEditField({
  fieldName,
  register,
  errors,
  helperTextString,
  required,
  inputAdornmentString,
  toolTips,
  multiline,
}: {
  fieldName: string;
  register: any;
  errors: any;
  toolTips: any;
  required: boolean;
  multiline: boolean;
  helperTextString: string;
  inputAdornmentString: string;
}) {
  return (
    <>
      <TextField
        {...register(`${fieldName}`, {required: true})}
        variant="standard"
        error={!!errors.galleryLogo}
        sx={profileStyles.formTextField}
        helperText={errors[fieldName] && helperTextString}
        fullWidth
        required={required}
        multiline={multiline}
        rows={multiline ? 2 : 1}
        InputProps={{
          startAdornment: (
            <InputAdornment sx={{width: '12vw'}} position="start">
              {inputAdornmentString}
            </InputAdornment>
          ),
        }}
      />
      <Tooltip title={toolTips[fieldName]} placement="top">
        <HelpOutlineIcon fontSize="small" sx={profileStyles.helpIcon} />
      </Tooltip>
    </>
  );
}

export function EditProfileGallery({
  isEditingProfile,
  setIsEditingProfile,
}: {
  isEditingProfile: boolean;
  setIsEditingProfile: (T: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...galleryFields,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle submission here
  };

  // const toggleEdit = (field: any) => {
  //   setEditing((prev: any) => ({...prev, [field]: !prev[field]}));
  // };

  const toolTips = {
    galleryName:
      'Your gallery name will appear on your openings and artworks that you have uploaded.',
    galleryLogo:
      'Your gallery logo will appear on the splash page for your openings and artworks that you have uploaded.',
    galleryBio: 'A short bio about your gallery',
    galleryAddress: 'Address of your gallery',
    galleryZip: 'Zip code of your gallery',
    primaryContact: 'Primary contact for your gallery',
  };

  return (
    <>
      <Head>
        <title>Gallery | Edit Profile</title>
        <meta name="description" content="Edit your gallery." />
      </Head>
      <Box mb={2} sx={profileStyles.container}>
        <Box sx={profileStyles.inputTextContainer}>
          <Box key="galleryName" sx={profileStyles.inputText}>
            <GalleryEditField
              fieldName="galleryName"
              register={register}
              errors={errors}
              required={true}
              helperTextString="Is required"
              inputAdornmentString="Gallery Name"
              toolTips={toolTips}
              multiline={false}
            />
          </Box>
          <Box key="galleryBio" sx={profileStyles.inputText}>
            <GalleryEditField
              fieldName="galleryBio"
              register={register}
              errors={errors}
              required={false}
              helperTextString="Gallery Bio is required"
              inputAdornmentString="Gallery Bio"
              toolTips={toolTips}
              multiline={true}
            />
          </Box>
          <Box key="galleryBio" sx={profileStyles.inputText}>
            <GalleryEditField
              fieldName="galleryBio"
              register={register}
              errors={errors}
              required={false}
              helperTextString="Gallery Bio is required"
              inputAdornmentString="Gallery Bio"
              toolTips={toolTips}
              multiline={true}
            />
          </Box>
          {/* <PlacesAutocomplete
            inputBoxStyles={profileStyles.inputText}
            inputFormStyles={profileStyles.formTextField}
            adornmentText="Gallery Address"
            placeHolderText="Type your gallery address"
          /> */}
          {/* <TextField
              {...register('galleryBio', {required: true})}
              variant="standard"
              error={!!errors.galleryBio}
              sx={profileStyles.formTextField}
              helperText={errors.galleryBio && `Gallery Name is not required`}
              fullWidth
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Gallery Bio</InputAdornment>
                ),
              }}
            /> */}
        </Box>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)} />
        </Box>
      </Box>
      <Box sx={profileStyles.editButtonProfile}>
        <IconButton
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          sx={profileStyles.editButtonEdit}>
          <SettingsIcon sx={{color: PRIMARY_BLUE}} />
        </IconButton>
      </Box>
    </>
  );
}

// <Box sx={profileStyles.editContainer}>
// <Box mb={2} sx={profileStyles.imageBoxEdit}>
//   <Box sx={{...profileStyles.imageBox, border: '1px solid black'}}>
//     <Typography sx={{color: PRIMARY_DARK_GREY}}>
//       Upload Logo
//     </Typography>
//     <input
//       {...register('galleryLogo', {required: true})}
//       accept="image/*"
//       id="contained-button-file"
//       type="file"
//       style={profileStyles.displayNone}
//     />
//   </Box>
//   <ImageUploadModal
//     actionText="Upload Logo"
//     dialogueTitle="Upload Gallery Logo"
//     dialogueText=""
//   />
//   {errors.galleryLogo && <p>Gallery Logo is required</p>}
// </Box>
//

//   </Box>
// </Box>
// <Button
//   sx={profileStyles.submitForm}
//   type="submit"
//   variant="contained"
//   color="primary">
//   Submit
// </Button>
// </Box>
