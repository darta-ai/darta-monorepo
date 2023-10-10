import {PRIMARY_200,PRIMARY_600} from '@darta-styles'
import {Exhibition} from '@darta-types';
import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {PRIMARY_MILK} from '../../../styles';
import {exhibitionPressReleaseToolTip} from '../../common/ToolTips/toolTips';
import {createArtworkStyles} from '../Artwork/styles';
import {
  DartaDatePicker,
  DartaDateTimePicker,
  DartaDropdown,
  DartaImageInput,
  DartaRadioButtonsGroup,
  // DartaSwitch,
  DartaTextInput,
} from '../FormComponents/index';
import {DartaConfirmExhibitionDelete} from '../Modals/DartaConfirmExhibitionDelete';
import {profileStyles} from '../Profile/Components/profileStyles';

export const createExhibitionErrors = {
  exhibitionTitle: 'An exhibition title is required.',
  exhibitionPrimaryImage: 'An exhibition image is required.',
  exhibitionPressRelease:
    'A few words on the nature of the exhibition is required.',
  exhibitionLocationString: 'Please include the location of the opening.',
  exhibitionStartDate: 'Start date is required.',
  exhibitionEndDate: 'End date is required.',
  exhibitionEndTimeMismatch:
    'Opening end date must be after opening start date.',
  hasReception: 'Reception status is required.',
  receptionStartTime: 'Reception start time is required.',
  receptionEndTime: 'Reception end time is required.',
  receptionEndTimeMismatch:
    'Reception end time must be after reception start time.',
};

const createExhibitionSchema = yup
  .object({
    exhibitionTitle: yup.object().shape({
      value: yup.string().required(createExhibitionErrors.exhibitionTitle),
    }),
    exhibitionType: yup
      .object()
      .shape({value: yup.string().required('Show type is required.')}),
    exhibitionPrimaryImage: yup.object().shape({
      value: yup
        .string()
        .required(createExhibitionErrors.exhibitionPrimaryImage),
    }),
    exhibitionPressRelease: yup.object().shape({
      value: yup
        .string()
        .required(createExhibitionErrors.exhibitionPressRelease),
    }),
    exhibitionLocation: yup.object().shape({
      locationString: yup.object().shape({
        value: yup
          .string()
          .required(createExhibitionErrors.exhibitionPrimaryImage),
      }),
    }),
    exhibitionDates: yup
      .object()
      .shape({
        exhibitionDuration: yup.object().shape({
          value: yup
            .string()
            .oneOf(['Temporary', 'Ongoing/Indefinite'], 'Invalid duration')
            .required('Duration is required'),
        }),
        exhibitionStartDate: yup.object().shape({
          value: yup.string().nullable(),
        }),
        exhibitionEndDate: yup.object().shape({
          value: yup.string().nullable(),
        }),
      })
      .test(
        'exhibition-start-date-test',
        createExhibitionErrors.exhibitionStartDate,
        value => {
          if (
            value?.exhibitionDuration?.value === 'Temporary' &&
            !value?.exhibitionStartDate?.value
          ) {
            return false; // validation fails
          }
          return true; // validation passes
        },
      )
      .test(
        'exhibition-end-date-test',
        createExhibitionErrors.exhibitionEndDate,
        value => {
          if (
            value?.exhibitionDuration?.value === 'Temporary' &&
            !value?.exhibitionEndDate?.value
          ) {
            return false; // validation fails
          }
          return true; // validation passes
        },
      )
      .test(
        'exhibition-end-date-test',
        createExhibitionErrors.exhibitionEndTimeMismatch,
        value => {
          if (
            value?.exhibitionEndDate?.value &&
            value?.exhibitionStartDate?.value &&
            new Date(value?.exhibitionEndDate?.value) <
              new Date(value?.exhibitionStartDate?.value)
          ) {
            return false; // validation fails
          }
          return true; // validation passes
        },
      ),
    receptionDates: yup
      .object()
      .shape({
        hasReception: yup.object().shape({
          value: yup
            .string()
            .oneOf(['Yes', 'No'], 'Invalid duration')
            .required(createExhibitionErrors.hasReception),
        }),
        receptionStartTime: yup.object().shape({
          value: yup.string().nullable(),
        }),
        receptionEndTime: yup.object().shape({
          value: yup.string().nullable(),
        }),
      })
      .test(
        'reception-start-date-test',
        createExhibitionErrors.receptionStartTime,
        value => {
          if (
            value?.hasReception?.value === 'Yes' &&
            !value?.receptionStartTime?.value
          ) {
            return false; // validation fails
          }
          return true; // validation passes
        },
      )
      .test(
        'reception-end-date-test',
        createExhibitionErrors.receptionEndTime,
        value => {
          if (
            value?.hasReception?.value === 'Yes' &&
            !value?.receptionEndTime?.value
          ) {
            return false; // validation fails
          }
          return true; // validation passes
        },
      )
      .test(
        'reception-end-time-test',
        createExhibitionErrors.receptionEndTimeMismatch,
        value => {
          if (
            value?.receptionEndTime?.value &&
            value?.receptionStartTime?.value &&
            value?.receptionEndTime?.value < value?.receptionStartTime?.value
          ) {
            return false; // validation fails
          }
          return true; // validation passes
        },
      ),
  })
  .required();

export function CreateExhibition({
  newExhibition,
  cancelAction,
  saveExhibition,
  handleDelete,
  galleryLocations,
  galleryName,
  isEditingExhibition,
}: {
  newExhibition: Exhibition;
  cancelAction: (arg0: boolean) => void;
  saveExhibition: (arg0: Exhibition) => void;
  handleDelete: ({
    exhibitionId,
    deleteArtworks,
  }: {
    exhibitionId: string;
    deleteArtworks?: boolean | undefined;
  }) => Promise<boolean>;
  galleryLocations: string[];
  galleryName: string;
  isEditingExhibition: boolean;
}) {
  const [editPressRelease, setEditPressRelease] = React.useState<boolean>(
    !newExhibition?.exhibitionPrimaryImage?.value,
  );

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

  const onSubmit = async (data: any) => {
    const galleryNameHashified = galleryName.replaceAll(' ', '-');
    const exhibitionNameHashified = data.exhibitionTitle.value.replaceAll(
      ' ',
      '-',
    );
    const slug = `${galleryNameHashified}-${exhibitionNameHashified}`;
    setValue('slug.value', slug);
    setValue(
      'exhibitionArtist.value',
      data?.exhibitionArtist?.value.toUpperCase(),
    );
    try {
      saveExhibition(data);
    } catch (error) {
      // TO-DO: error handling?
    }
  };

  const [tempImage, setTempImage] = React.useState<string | null>(
    newExhibition.exhibitionPrimaryImage?.value || null,
  );

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);
    setTempImage(previewURL);

    const reader = new FileReader();

    reader.onload = event => {
      // event.target.result contains the file's data as a base64 encoded string.
      if (event.target?.result) {
        const fileData = event.target.result;
        setValue('exhibitionPrimaryImage.fileData', fileData);
        setValue('exhibitionPrimaryImage.fileName', file.name);
      }
    };

    reader.readAsDataURL(file); // Read the file content as Data URL.
    setValue('exhibitionPrimaryImage.value', previewURL);
    setEditPressRelease(!editPressRelease);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const [keepLocationPrivate, setKeepLocationPrivate] = React.useState<boolean>(
  //   !newExhibition?.exhibitionLocation?.isPrivate,
  // );

  const [isOngoingExhibition, setIsOngoingExhibition] = React.useState<boolean>(
    newExhibition?.exhibitionDates?.exhibitionDuration?.value === 'Temporary',
  );
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

  const [showArtistField, setShowArtist] = React.useState<boolean>(true);

  const handleExhibitionArtist = (arg0: string) => {
    switch (arg0) {
      case 'Solo Show':
        setShowArtist(true);
        break;
      default:
        setShowArtist(false);
        break;
    }
  };

  const [hasReception, setHasReception] = React.useState<boolean>(
    newExhibition?.receptionDates?.hasReception?.value === 'Yes',
  );
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
    newExhibition?.exhibitionDates?.exhibitionStartDate?.value || dayjs(),
  );

  const [maxDate, setMaxDate] = React.useState<any>(
    newExhibition?.exhibitionDates?.exhibitionEndDate?.value || dayjs(),
  );

  const handleMinDate = (date: any) => {
    setMinDate(date);
  };

  const handleMaxDate = (date: any) => {
    setMaxDate(date);
  };

  const [minTime, setMinTime] = React.useState<any>(
    newExhibition?.receptionDates?.receptionStartTime?.value || dayjs(),
  );

  const handleMinTime = (date: any) => {
    setMinTime(date);
  };

  return (
    <Box mb={2} sx={profileStyles.container}>
      <Box sx={createArtworkStyles.backButton}>
        <Button
          variant="outlined"
          sx={{color: PRIMARY_600}}
          data-testid="create-exhibition-cancel-button"
          onClick={() => cancelAction(false)}
          startIcon={<ArrowBackIcon sx={{color: PRIMARY_600}} />}>
          <Typography sx={{fontWeight: 'bold'}}>Cancel</Typography>
        </Button>
      </Box>
      <Box sx={createArtworkStyles.imageContainer}>
        <Box style={createArtworkStyles.defaultImageEdit}>
            {editPressRelease ? (
              <DartaImageInput
                onDrop={handleDrop}
                instructions="Drag and drop the main image of your exhibition or click to select an image to upload."
              />
            ) : (
              <Box>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img
                  src={
                    tempImage ??
                    (newExhibition?.exhibitionPrimaryImage?.value as string) ??
                    ''
                  }
                  alt="exhibition main image"
                  style={createArtworkStyles.defaultImage}
                />
              </Box>
            )}
            {errors.exhibitionPrimaryImage && (
              <Typography
                data-testid="exhibition-image-error"
                variant="body2"
                sx={{color: 'red', alignSelf: 'center', textAlign: 'center'}}>
                {errors.exhibitionPrimaryImage.value?.message}
              </Typography>
            )}
        </Box>
      </Box>
      <Box sx={{alignSelf: 'center'}}>
        <Button
          sx={{width: '30vw'}}
          data-testid="create-exhibition-image-back-button"
          onClick={() => setEditPressRelease(!editPressRelease)}
          variant="contained">
          <Typography
            sx={{fontSize: '0.8rem'}}
            data-testid="create-exhibition-image-back-button-test">
            {editPressRelease ? 'Back' : 'Edit Image'}
          </Typography>
        </Button>
      </Box>
      <Box sx={createArtworkStyles.inputTextContainer}>
        <Box
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            justifyContent: 'space-around',
            textAlign: 'center',
          }}
          key="exhibition-data">
          <Typography variant="h6" data-testid="exhibition-page-title">
            Exhibition
          </Typography>
        </Box>
        <Box key="exhibitionTitle" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="exhibitionTitle"
            data={newExhibition.exhibitionTitle?.value as any}
            register={register}
            control={control}
            errors={errors}
            required
            helperTextString={errors.exhibitionTitle?.value?.message}
            inputAdornmentString="Title"
            toolTips={exhibitionPressReleaseToolTip}
            multiline={1}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box sx={createArtworkStyles.multiLineContainer}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <DartaRadioButtonsGroup
              toolTips={exhibitionPressReleaseToolTip}
              fieldName="exhibitionType"
              inputAdornmentString="Show Type"
              control={control}
              required
              options={['Solo Show', 'Group Show']}
              setHigherLevelState={handleExhibitionArtist}
              helperTextString=""
              errors={errors}
              value={
                getValues('exhibitionType.value') ||
                newExhibition?.exhibitionType?.value
              }
            />
          </Box>
        </Box>
        {errors.exhibitionType?.value && (
          <Typography
            data-testid="artwork-image-error"
            sx={{color: 'red', alignSelf: 'center', textAlign: 'center'}}>
            {errors.exhibitionType?.value.message!}
          </Typography>
        )}
        {showArtistField && (
          <Box key="exhibitionArtist" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName="exhibitionArtist"
              data={newExhibition.exhibitionArtist?.value as any}
              register={register}
              control={control}
              errors={errors}
              required
              helperTextString={errors.exhibitionArtist?.value?.message}
              inputAdornmentString="Artist"
              toolTips={exhibitionPressReleaseToolTip}
              multiline={1}
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
        )}
        <Box key="exhibitionPressRelease" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="exhibitionPressRelease"
            data={newExhibition.exhibitionPressRelease?.value}
            register={register}
            errors={errors}
            required
            control={control}
            helperTextString={errors.exhibitionPressRelease?.value?.message}
            inputAdornmentString="Press Release"
            toolTips={exhibitionPressReleaseToolTip}
            multiline={12}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box
          key="location"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Location</Typography>
          <Box sx={createArtworkStyles.multiLineContainer}>
            {/* REMOVING PRIVATE LOCATION TOGGLE FOR NOW */}
          </Box>
          <Box key="price" sx={createArtworkStyles.inputText}>
            <DartaDropdown
              fieldName="exhibitionLocation.locationString"
              register={register}
              control={control}
              toolTips={exhibitionPressReleaseToolTip}
              options={galleryLocations ?? ['edit profile to add locations']}
              helperTextString={
                errors.exhibitionLocation?.exhibitionLocationString?.value
                  ?.message
              }
            />
          </Box>
        </Box>
        <Box
          key="exhibitionDates"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Exhibition Dates</Typography>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <DartaRadioButtonsGroup
                toolTips={exhibitionPressReleaseToolTip}
                fieldName="exhibitionDates.exhibitionDuration"
                inputAdornmentString="Duration"
                control={control}
                required={false}
                options={durationValues}
                setHigherLevelState={handleOngoingDuration}
                helperTextString=""
                errors={errors}
                value={
                  getValues('exhibitionDates.exhibitionDuration.value') ||
                  newExhibition?.exhibitionDates?.exhibitionDuration
                }
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{...createArtworkStyles.inputText}}>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box key="exhibitionStartDate" sx={createArtworkStyles.inputText}>
              <DartaDatePicker
                label="Start Date"
                toolTips={exhibitionPressReleaseToolTip}
                control={control}
                register={register}
                fieldName="exhibitionDates.exhibitionStartDate"
                canEdit={!isOngoingExhibition}
                setHigherLevelState={handleMinDate}
                minDate={null}
                value={
                  getValues('exhibitionDates.exhibitionStartDate.value') ||
                  newExhibition?.exhibitionDates?.exhibitionStartDate?.value
                }
                error={!!errors?.exhibitionDates?.message}
              />
            </Box>
            <Box key="exhibitionEndDate" sx={createArtworkStyles.inputText}>
              <DartaDatePicker
                label="Closing Date"
                toolTips={exhibitionPressReleaseToolTip}
                control={control}
                register={register}
                fieldName="exhibitionDates.exhibitionEndDate"
                canEdit={!isOngoingExhibition}
                minDate={dayjs(minDate) || dayjs()}
                setHigherLevelState={handleMaxDate}
                value={
                  getValues('exhibitionDates.exhibitionEndDate.value') ||
                  newExhibition?.exhibitionDates?.exhibitionStartDate?.value
                }
                error={!!errors?.exhibitionDates?.message}
              />
            </Box>
          </Box>
        </Box>
        {errors?.exhibitionDates?.message && (
          <Typography
            data-testid="exhibitionDates-text-error-field"
            sx={{color: 'red', textAlign: 'center'}}>
            {errors?.exhibitionDates?.message}
          </Typography>
        )}
        <Box
          key="openingReception"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Opening Reception</Typography>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <DartaRadioButtonsGroup
                toolTips={exhibitionPressReleaseToolTip}
                control={control}
                fieldName="receptionDates.hasReception"
                inputAdornmentString="Has Reception?"
                required={false}
                options={hasReceptionValues}
                setHigherLevelState={handleHasReception}
                helperTextString=""
                errors={errors}
                value={
                  getValues('receptionDates.hasReception.value') ||
                  newExhibition?.receptionDates?.hasReception?.value
                }
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{...createArtworkStyles.inputText}}>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box key="receptionTimeStart" sx={createArtworkStyles.inputText}>
              <DartaDateTimePicker
                label="Reception Start"
                toolTips={exhibitionPressReleaseToolTip}
                control={control}
                register={register}
                fieldName="receptionDates.receptionStartTime"
                canEdit={!hasReception}
                setHigherLevelState={handleMinTime}
                minTime={null}
                maxTime={dayjs(maxDate)}
                error={!!errors?.receptionDates?.message}
                value={
                  getValues('receptionDates.receptionStartTime.value') ||
                  newExhibition?.receptionDates?.receptionStartTime?.value
                }
              />
            </Box>
            <Box key="receptionTimeEnd" sx={createArtworkStyles.inputText}>
              <DartaDateTimePicker
                label="Reception End"
                toolTips={exhibitionPressReleaseToolTip}
                control={control}
                register={register}
                fieldName="receptionDates.receptionEndTime"
                canEdit={!hasReception}
                minTime={dayjs(minTime)}
                maxTime={dayjs(maxDate)}
                error={!!errors?.receptionDates?.message}
                value={
                  getValues('receptionDates.receptionEndTime.value') ||
                  newExhibition?.receptionDates?.receptionEndTime?.value
                }
              />
            </Box>
          </Box>
        </Box>
        {errors?.receptionDates?.message && (
          <Typography
            data-testid="receptionDates-text-error-field"
            sx={{color: 'red', textAlign: 'center', mb: 3}}>
            {errors?.receptionDates?.message}
          </Typography>
        )}
        <Box sx={createArtworkStyles.inputTextContainer}>
          <Box sx={createArtworkStyles.saveButtonContainer}>
            <Button
              variant="contained"
              data-testid="delete-exhibition-button"
              sx={{
                backgroundColor: PRIMARY_200, 
                alignSelf: 'center',
                width: '15vw',
                '@media (min-width: 800px)': {
                  width: '10vw',
                },
              }}
              onClick={() => {
                handleClickOpen();
              }}>
              <Typography sx={{fontWeight: 'bold'}}>Delete</Typography>
            </Button>
            <Button
              variant="contained"
              data-testid="save-exhibition-button"
              type="submit"
              disabled={isEditingExhibition}
              sx={{
                backgroundColor: PRIMARY_600,
                color: PRIMARY_MILK,
                alignSelf: 'center',
                width: '35vw',
                '@media (min-width: 800px)': {
                  width: '10vw',
                },
              }}
              onClick={handleSubmit(onSubmit)}>
              {isEditingExhibition ? (
                <CircularProgress size={24} />
              ) : (
                <Typography sx={{fontWeight: 'bold', color: PRIMARY_MILK}}>
                  Save
                </Typography>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
      <DartaConfirmExhibitionDelete
        id={newExhibition.exhibitionId as string}
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </Box>
  );
}
