import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, Typography} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {Exhibition} from '../../../globalTypes';
import {PRIMARY_BLUE} from '../../../styles';
import {exhibitionPressReleaseToolTip} from '../../common/ToolTips/toolTips';
import {
  DartaDatePicker,
  DartaDateTimePicker,
  DartaDropdown,
  DartaImageInput,
  DartaRadioButtonsGroup,
  DartaSwitch,
  DartaTextInput,
} from '../FormComponents/index';
import {DartaDialogue} from '../Modals/DartaDialogue';
import {createArtworkStyles} from './styles';

const createExhibitionSchema = yup
  .object({
    exhibitionTitle: yup.object().shape({
      value: yup.string().required('An exhibition title is required'),
    }),
    exhibitionPrimaryImage: yup.object().shape({
      value: yup.string().required('An exhibition image is required'),
    }),
    exhibitionPressRelease: yup.object().shape({
      value: yup
        .string()
        .required('A few words on the nature of the exhibition is required.'),
    }),
    exhibitionStartDate: yup.object().shape({
      value: yup.string().optional(),
    }),
    exhibitionEndDate: yup.object().shape({
      value: yup.string().required(),
    }),
    exhibitionLocation: yup.object().shape({
      exhibitionLocationString: yup.object().shape({
        value: yup
          .string()
          .required('Please include the location of the opening.'),
      }),
    }),
  })
  .required();

export function ExhibitionPressReleaseEdit({
  newExhibition,
  cancelAction,
  saveExhibition,
  handleDelete,
  galleryLocations,
}: {
  newExhibition: Exhibition;
  cancelAction: (arg0: boolean) => void;
  saveExhibition: (arg0: Exhibition) => void;
  handleDelete: (arg0: string) => void;
  galleryLocations: string[];
}) {
  const [editPressRelease, setEditPressRelease] = React.useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...newExhibition,
    },
    resolver: yupResolver(createExhibitionSchema),
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
    setEditPressRelease(!editPressRelease);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [keepLocationPrivate, setKeepLocationPrivate] =
    React.useState<boolean>(false);

  const [isOngoingExhibition, setIsOngoingExhibition] =
    React.useState<boolean>(true);
  const durationValues = ['Temporary', 'Ongoing/Indefinite'];

  const handleOngoingDuration = (arg0: string) => {
    switch (arg0) {
      case durationValues[0]:
        setIsOngoingExhibition(true);
        break;
      case durationValues[1]:
        setIsOngoingExhibition(false);
        break;
      default:
        break;
    }
  };

  const [hasReception, setHasReception] = React.useState<boolean>(true);
  const hasReceptionValues = ['Yes', 'No'];

  const handleHasReception = (arg0: string) => {
    switch (arg0) {
      case hasReceptionValues[0]:
        setHasReception(true);
        break;
      case hasReceptionValues[1]:
        setHasReception(false);
        break;
      default:
        break;
    }
  };

  const [minDate, setMinDate] = React.useState<any>(
    newExhibition?.exhibitionStartDate?.value || dayjs(),
  );

  const handleMinDate = (date: any) => {
    setMinDate(date);
  };

  const [minTime, setMinTime] = React.useState<any>(
    newExhibition?.receptionStartTime?.value || dayjs(),
  );

  const handleMinTime = (date: any) => {
    setMinTime(date);
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
        <Box
          sx={{
            alignContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            width: '30vw',
          }}>
          <Box sx={createArtworkStyles.imageContainer}>
            <Box>
              {editPressRelease ? (
                <DartaImageInput
                  onDrop={handleDrop}
                  instructions="Drag and drop the main image of your exhibition here, or click to select an image to upload."
                />
              ) : (
                <img
                  src={tempImage as string}
                  alt="exhibition"
                  style={createArtworkStyles.defaultImage}
                />
              )}
            </Box>
            {errors.exhibitionPrimaryImage && (
              <Typography
                variant="body2"
                sx={{color: 'red', alignSelf: 'center'}}>
                {errors.exhibitionPrimaryImage.value?.message}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{width: '20vw', alignSelf: 'center'}}>
          <Button
            sx={{width: '20vw', alignSelf: 'center'}}
            onClick={() => setEditPressRelease(!editPressRelease)}
            variant="contained">
            {editPressRelease ? 'Back' : 'Edit Image'}
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
            toolTips={exhibitionPressReleaseToolTip}
            multiline={false}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box
          key="exhibitionPressRelease"
          sx={createArtworkStyles.inputTextContainer}>
          <DartaTextInput
            fieldName="exhibitionPressRelease"
            data={newExhibition.exhibitionPressRelease?.value}
            register={register}
            errors={errors}
            required={false}
            control={control}
            helperTextString={errors.exhibitionPressRelease?.value?.message}
            inputAdornmentString="Description"
            toolTips={exhibitionPressReleaseToolTip}
            multiline={12}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box sx={createArtworkStyles.inputTextContainer}>
          <Box
            key="location"
            sx={{
              ...createArtworkStyles.inputText,
              flexDirection: 'column',
              textAlign: 'center',
            }}>
            <Typography variant="h6">Location</Typography>
            <Box>
              <DartaSwitch
                toolTips={exhibitionPressReleaseToolTip}
                control={control}
                register={register}
                fieldName="privateLocation"
                inputAdornmentString="Location Visibility"
                data={newExhibition.exhibitionLocation?.isPrivate}
                switchState={keepLocationPrivate}
                handleSwitchStateChange={setKeepLocationPrivate}
                trueStatement="Private"
                falseStatement="Public"
              />
            </Box>
          </Box>
        </Box>
        <Box
          key="exhibitionLocation"
          sx={createArtworkStyles.inputTextContainer}>
          <DartaDropdown
            fieldName="exhibitionLocation.exhibitionLocationString"
            data={newExhibition.exhibitionLocation?.exhibitionLocationString}
            register={register}
            control={control}
            toolTips={exhibitionPressReleaseToolTip}
            allowPrivate={false}
            options={galleryLocations || ['no location']}
            inputAdornmentString="Location"
            required={true}
            value={
              getValues('exhibitionLocation.exhibitionLocationString.value') ||
              newExhibition?.exhibitionLocation?.exhibitionLocationString?.value
            }
            helperTextString={
              errors.exhibitionLocation?.exhibitionLocationString?.value
                ?.message
            }
          />
        </Box>
        <Box
          key="dates"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Exhibition Dates</Typography>
          <Box>
            <DartaRadioButtonsGroup
              toolTips={exhibitionPressReleaseToolTip}
              fieldName="hasReception"
              inputAdornmentString="Exhibition Duration"
              control={control}
              required={false}
              defaultValue={durationValues[0]}
              options={durationValues}
              setHigherLevelState={handleOngoingDuration}
              helperTextString=""
              errors={errors}
              value={getValues('hasReception') || newExhibition?.hasReception}
            />
          </Box>
        </Box>
        <Box sx={createArtworkStyles.multiLineContainer}>
          <Box key="startDate" sx={createArtworkStyles.inputText}>
            <DartaDatePicker
              label="Start Date"
              toolTips={exhibitionPressReleaseToolTip}
              control={control}
              register={register}
              fieldName="exhibitionStartDate"
              canEdit={!isOngoingExhibition}
              setHigherLevelState={handleMinDate}
              minDate={dayjs()}
              value={
                getValues('exhibitionStartDate.value') ||
                newExhibition?.exhibitionStartDate?.value
              }
            />
          </Box>
          <Box key="closingDate" sx={createArtworkStyles.inputText}>
            <DartaDatePicker
              label="Closing Date"
              toolTips={exhibitionPressReleaseToolTip}
              control={control}
              register={register}
              fieldName="exhibitionEndDate"
              canEdit={!isOngoingExhibition}
              minDate={dayjs(minDate) || dayjs()}
              value={
                getValues('exhibitionEndDate.value') ||
                newExhibition?.exhibitionStartDate?.value
              }
            />
          </Box>
        </Box>
        <Box
          key="reception"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Opening Reception</Typography>
          <Box>
            <DartaRadioButtonsGroup
              toolTips={exhibitionPressReleaseToolTip}
              control={control}
              fieldName="hasReception"
              inputAdornmentString="Has Reception?"
              required={false}
              defaultValue={hasReceptionValues[0]}
              options={hasReceptionValues}
              setHigherLevelState={handleHasReception}
              helperTextString=""
              errors={errors}
              value={getValues('hasReception') || newExhibition?.hasReception}
            />
          </Box>
        </Box>
        <Box sx={createArtworkStyles.multiLineContainer}>
          <Box key="receptionTimeStart" sx={createArtworkStyles.inputText}>
            <DartaDateTimePicker
              label="Reception Start"
              toolTips={exhibitionPressReleaseToolTip}
              errors={errors}
              control={control}
              register={register}
              fieldName="receptionStartTime"
              canEdit={!hasReception}
              helperTextString="heyyy"
              setHigherLevelState={handleMinTime}
              minTime={dayjs(minDate)}
              value={
                getValues('receptionStartTime.value') ||
                newExhibition?.receptionStartTime?.value
              }
            />
          </Box>
          <Box key="receptionTimeEnd" sx={createArtworkStyles.inputText}>
            <DartaDateTimePicker
              label="Reception End"
              toolTips={exhibitionPressReleaseToolTip}
              control={control}
              errors={errors}
              helperTextString="heyyyy"
              register={register}
              fieldName="receptionEndTime"
              canEdit={!hasReception}
              minTime={dayjs(minTime)}
              value={
                getValues('receptionEndTime.value') ||
                newExhibition?.receptionEndTime?.value
              }
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
        identifier={newExhibition?.exhibitionTitle?.value || '____'}
        deleteType="exhibition"
        id={newExhibition.exhibitionId as string}
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </Box>
  );
}
