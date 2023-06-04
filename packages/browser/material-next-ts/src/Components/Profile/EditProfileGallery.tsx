import React from 'react';
import Head from 'next/head';
import 'firebase/compat/auth';
import {IconButton, Typography, Box, TextField, Button} from '@mui/material';
import {PRIMARY_DARK_GREY, PRIMARY_BLUE} from '../../../styles';
import {useForm} from 'react-hook-form';
import {ImageUploadModal} from '../Modals/UploadImageModal';
import Image from 'next/image';
import SettingsIcon from '@mui/icons-material/Settings';

const editProfileStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5%',
    width: '80vw',
    minHeight: '100vh',
    mb: 5,
    alignSelf: 'center',
    '@media (minWidth: 800px)': {
      paddingTop: '7vh',
    },
  },
  uploadImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '5%',
    alignItems: 'center',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width:800px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (minWidth: 800px)': {
      fontSize: '1.3rem',
    },
    cursor: 'default',
  },
  button: {
    color: PRIMARY_BLUE,
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTextField: {
    width: '100%',
  },
};

type AboutData = {
  HeadTitle: string;
  DartaCoreValue: string;
  Headline: string;
  WhoWeAre: string;
  DartaBelief1?: string;
  DartaBelief2?: string;
  DartaBelief3?: string;
  DartaBelief4?: string;
};

const galleryFields = {
  galleryLogo: '',
  galleryName: 'Hello',
  galleryBio: '',
  galleryAddress: '',
  galleryZip: '',
  primaryContact: '',
};

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
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...galleryFields,
    },
  });
  const galleryFieldKeys = Object.keys(galleryFields);
  const [editing, setEditing] = React.useState({
    ...galleryFieldKeys.reduce(
      (acc: any, curr: any) => ({...acc, [curr]: false}),
      {},
    ),
  });

  console.log({editing});
  const onSubmit = (data: any) => {
    console.log(data);
    // Handle submission here
  };

  const toggleEdit = (field: any) => {
    setEditing((prev: any) => ({...prev, [field]: !prev[field]}));
  };

  const backupImage = require(`../../../public/static/images/UploadImage.png`);

  const fields = ['Name', 'Bio', 'Gallery Zip', 'Primary Contact Email'];
  return (
    <>
      <Head>
        <title>Gallery | Edit Profile</title>
        <meta name="description" content="Edit your gallery." />
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2} sx={editProfileStyles.uploadImageContainer}>
          <Box>
          <Box >
            <IconButton onClick={() => setIsEditingProfile(!isEditingProfile)}>
              <SettingsIcon sx={{color: PRIMARY_BLUE}} />
            </IconButton>
          </Box>
            <Image
              src={backupImage}
              alt="upload image"
              style={{marginTop: '1em', maxWidth: '100%', borderWidth: 30}}
              height={400}
              width={400}
            />
            <input
              {...register('galleryLogo', {required: true})}
              accept="image/*"
              id="contained-button-file"
              type="file"
              style={{display: 'none'}}
            />
          </Box>
          <ImageUploadModal
            actionText="Upload Logo"
            dialogueTitle="Upload Gallery Logo"
            dialogueText=""
          />
          {errors.galleryLogo && <p>Gallery Logo is required</p>}
        </Box>
        <Box
          key={'galleryName'}
          m={2}
          sx={editProfileStyles.inputTextContainer}>
          {editing.galleryName ? (
            <TextField
              {...register('galleryName', {required: true})}
              label={'Gallery Name'}
              error={errors['galleryLogo'] ? true : false}
              sx={editProfileStyles.formTextField}
              helperText={errors.galleryName && `Gallery Name is required`}
              fullWidth
            />
          ) : (
            <Box>
              <label>{'Gallery Name'}</label>
              <Typography>{getValues('galleryName')}</Typography>
            </Box>
          )}
          <Box>
            <Button
              variant="outlined"
              sx={editProfileStyles.button}
              onClick={() => toggleEdit('galleryName')}>
              {editing['galleryName'] ? `Save` : `Edit`}{' '}
            </Button>
          </Box>
        </Box>

        <Box sx={{flexDirection: 'column', alignItems: 'right'}}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
}
