import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, Typography} from '@mui/material';
import {Exhibition} from 'darta/globalTypes';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {PRIMARY_BLUE} from '../../../styles';
import {
  DartaDatePicker,
  DartaImageInput,
  DartaTextInput,
} from '../FormComponents/index';
import {DartaDialogue} from '../Modals/DartaDialogue';
import {createArtworkStyles} from './styles';

const createArtworkSchema = yup
  .object({
    exhibitionTitle: yup.object().shape({
      value: yup.string().required('An exhibition title is required'),
    }),
    exhibitionPrimaryImage: yup.object().shape({
      value: yup.string().required('An exhibition image is required'),
    }),
    pressRelease: yup.object().shape({
      value: yup.string().optional(),
    }),
    startDate: yup.object().shape({
      value: yup.date().required(),
    }),
    endDate: yup.object().shape({
      value: yup.date().required(),
    }),
    exhibitionLocation: yup.object().shape({
      value: yup.string().required(),
    }),
    openingDate: yup.object().shape({
      value: yup.date().optional(),
    }),
  })
  .required();

const toolTips = {
  exhibitionTitle: 'The title of the exhibition. Required.',
  pressRelease:
    'An exhibition description or press release text helps improve user experience. Optional.',
  exhibitionLocation:
    'The location of the exhibition will help guide users to your openings.',
  startDate:
    'Required. The start date of the exhibition. If the exhibition is ongoing, select "Ongoing".',
  endDate:
    'Required. The end date of the exhibition. If the exhibition is ongoing, select "Ongoing".',
  openingDate: 'The date of the opening reception for the exhibition.',
};

export function ExhibitionPressReleaseEdit({
  newExhibition,
  cancelAction,
  saveExhibition,
  handleDelete,
}: {
  newExhibition: Exhibition;
  cancelAction: (arg0: boolean) => void;
  saveExhibition: (arg0: Exhibition) => void;
  handleDelete: (arg0: string) => void;
}) {
  const [editImage, setEditImage] = React.useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...newExhibition,
    },
    resolver: yupResolver(createArtworkSchema),
  });

  const onSubmit = (data: any) => {
    saveExhibition(data);
  };

  const [tempImage, setTempImage] = React.useState<string | null>(
    newExhibition.exhibitionPrimaryImage?.value || null,
  );

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);
    setTempImage(previewURL);
    setValue('exhibitionPrimaryImage.value', previewURL);

    // NEED API CALL TO UPLOAD IMAGE TO DATABASE
    setEditImage(!editImage);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box mb={2} sx={createArtworkStyles.container}>
      <Box sx={createArtworkStyles.backButton}>
        <Button
          variant="outlined"
          sx={{color: PRIMARY_BLUE}}
          onClick={() => cancelAction(false)}
          startIcon={<ArrowBackIcon sx={{color: PRIMARY_BLUE}} />}>
          Cancel
        </Button>
      </Box>
      <Box sx={createArtworkStyles.imageContainer}>
        {!tempImage || editImage ? (
          <Box style={createArtworkStyles.defaultImageEdit}>
            <DartaImageInput
              onDrop={handleDrop}
              instructions="Drag and drop an image of your exhibition here, or click to select an image to upload."
            />
          </Box>
        ) : (
          <img
            src={tempImage as string}
            alt="exhibition"
            style={createArtworkStyles.defaultImage}
          />
        )}
        {errors.exhibitionPrimaryImage && (
          <Typography variant="body2" sx={{color: 'red', alignSelf: 'center'}}>
            {errors.exhibitionPrimaryImage.value?.message}
          </Typography>
        )}

        <Box sx={{width: '10vw', alignSelf: 'center'}}>
          <Button
            sx={{width: '10vw', alignSelf: 'center'}}
            onClick={() => setEditImage(!editImage)}
            variant="contained">
            {editImage ? 'Back' : 'Edit Image'}
          </Button>
        </Box>
      </Box>
      <Box sx={createArtworkStyles.inputTextContainer}>
        <Box
          key="exhibition"
          mt={6}
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Exhibition</Typography>
        </Box>
        <Box key="exhibitionTitle" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="exhibitionTitle"
            data={newExhibition.exhibitionTitle?.value as any}
            register={register}
            control={control}
            errors={errors}
            required={true}
            helperTextString={errors.exhibitionTitle?.value?.message}
            inputAdornmentString="Title"
            toolTips={toolTips}
            multiline={false}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box key="pressRelease" sx={createArtworkStyles.inputTextContainer}>
          <DartaTextInput
            fieldName="pressRelease"
            data={newExhibition.pressRelease?.value}
            register={register}
            errors={errors}
            required={true}
            control={control}
            helperTextString={errors.pressRelease?.value?.message}
            inputAdornmentString="Description"
            toolTips={toolTips}
            multiline={true}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box
          key="dates"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Dates</Typography>
        </Box>
        <Box sx={createArtworkStyles.multiLineContainer}>
          <Box key="price" sx={createArtworkStyles.inputText}>
            <DartaDatePicker
              label="Start Date"
              toolTips={toolTips}
              control={control}
              data={newExhibition.startDate}
              register={register}
              fieldName="startDate"
              allowOngoing={true}
            />
          </Box>
          <Box key="closingDate" sx={createArtworkStyles.inputText}>
            <DartaDatePicker
              label="Closing Date"
              toolTips={toolTips}
              control={control}
              data={newExhibition.endDate}
              register={register}
              fieldName="endDate"
              allowOngoing={true}
            />
          </Box>
          <Box key="openingDate" sx={createArtworkStyles.inputText}>
            <DartaDatePicker
              label="Opening Date"
              toolTips={toolTips}
              control={control}
              data={newExhibition.openingDate}
              register={register}
              fieldName="openingDate"
              allowOngoing={true}
            />
          </Box>
        </Box>
        <Box sx={createArtworkStyles.saveButtonContainer}>
          <Button
            variant="contained"
            data-testid="delete-button"
            color="error"
            onClick={() => {
              handleClickOpen();
            }}>
            Delete
          </Button>
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
      <DartaDialogue
        title={newExhibition.exhibitionTitle.value || '____'}
        id={newExhibition.exhibitionId as string}
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </Box>
  );
}
