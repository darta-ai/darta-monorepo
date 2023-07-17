import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from '@mui/material';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {mediums} from '../../../data/medium';
import {Artwork} from '../../../globalTypes';
import {PRIMARY_BLUE} from '../../../styles';
import {
  createArtworkDimensionsToolTip,
  createArtworkToolTips,
} from '../../common/ToolTips/toolTips';
import {
  convertCentimetersToInches,
  convertInchesToCentimeters,
} from '../../common/utils/unitConverter';
import {
  DartaAutoComplete,
  DartaImageInput,
  DartaRadioButtonsGroup,
  DartaTextInput,
} from '../FormComponents/index';
import {CroppingMattersModal, DartaDialogue} from '../Modals/index';
import {profileStyles} from '../Profile/Components/profileStyles';
import {createArtworkStyles} from './styles';

type currencyConverterType = {
  [key: string]: string;
};

const currencyConverter: currencyConverterType = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const createArtworkSchema = yup
  .object({
    artworkTitle: yup.object().shape({
      value: yup.string().required('An artwork title is required.'),
    }),
    artistName: yup.object().shape({
      value: yup.string().required('An artist name is required.'),
    }),
    artworkImage: yup.object().shape({
      value: yup.string().required('An artwork image is required.'),
    }),
    artworkDescription: yup.object().shape({
      value: yup.string().optional(),
    }),
    artworkPrice: yup.object().shape({
      value: yup.string().optional(),
      isPrivate: yup.boolean().optional(),
    }),
    artworkCurrency: yup.object().shape({
      value: yup.string().optional(),
    }),
    canInquire: yup.object().shape({
      value: yup
        .string()
        .required('Do you want users to be able to inquire about the art?'),
    }),
    artworkCreatedYear: yup.object().shape({
      value: yup
        .string()
        .matches(/^(19[0-9]{2}|[2-9][0-9]{3})$/, 'Must be a valid year.')
        .required('The year or years created is required.')
        .min(4, 'Must be exactly 4 digits.')
        .max(4, 'Must be exactly 4 digits.'),
    }),
    artworkMedium: yup.object().shape({
      value: yup.string().required('The medium of the artwork is required.'),
    }),
    artworkDimensions: yup
      .object()
      .shape({
        heightIn: yup.object().shape({
          value: yup.string().nullable(),
        }),
        widthIn: yup.object().shape({
          value: yup.string().nullable(),
        }),
        depthIn: yup.object().shape({
          value: yup.string().optional(),
        }),
        heightCm: yup.object().shape({
          value: yup.string().nullable(),
        }),
        widthCm: yup.object().shape({
          value: yup.string().nullable(),
        }),
        depthCm: yup.object().shape({
          value: yup.string().optional(),
        }),
        displayUnit: yup.object().shape({
          value: yup.string().optional(),
        }),
      })
      .test(
        'either-or-height',
        'Artwork height must be a positive number and is required.',
        value => !!(value?.heightIn?.value || value?.heightCm?.value),
      )
      .test(
        'either-or-width',
        'Artwork width must be a positive number and is required.',
        value => !!(value?.widthIn?.value || value?.widthCm?.value),
      ),
  })
  .required();

export function CreateArtwork({
  newArtwork,
  cancelAction,
  saveArtwork,
  handleDelete,
  croppingModalOpen,
  setCroppingModalOpen,
}: {
  newArtwork: Artwork;
  cancelAction: (arg0: boolean) => void;
  saveArtwork: (arg0: Artwork) => void;
  handleDelete: (arg0: string) => void;
  croppingModalOpen?: boolean;
  setCroppingModalOpen?: (arg0: boolean) => void;
}) {
  const [isInchesMeasurement, setIsInchesMeasurement] =
    React.useState<boolean>(false);
  const [tempImage, setTempImage] = React.useState<string | null>(
    newArtwork?.artworkImage?.value || null,
  );

  const currencies = ['USD', 'EUR', 'GBP'];
  const [displayCurrency, setDisplayCurrency] = React.useState<string>('$');
  const handleDisplayCurrency = (arg0: string) => {
    return setDisplayCurrency(currencyConverter[arg0]);
  };
  const [editImage, setEditImage] = React.useState<boolean>(
    !tempImage && !newArtwork?.artworkImage?.value,
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
      ...newArtwork,
    },
    resolver: yupResolver(createArtworkSchema),
  });

  const handleMeasurementChange = (event?: any) => {
    if (isInchesMeasurement) {
      setValue(
        'artworkDimensions.heightIn.value',
        convertCentimetersToInches(
          getValues('artworkDimensions.heightCm.value'),
        ).toString(),
      );
      setValue(
        'artworkDimensions.widthIn.value',
        convertCentimetersToInches(
          getValues('artworkDimensions.widthCm.value'),
        ).toString(),
      );
      setValue(
        'artworkDimensions.depthIn.value',
        convertCentimetersToInches(
          getValues('artworkDimensions.depthCm.value'),
        ).toString(),
      );
    } else {
      setValue(
        'artworkDimensions.heightCm.value',
        convertInchesToCentimeters(
          getValues('artworkDimensions.heightIn.value'),
        ).toString(),
      );
      setValue(
        'artworkDimensions.widthCm.value',
        convertInchesToCentimeters(
          getValues('artworkDimensions.widthIn.value'),
        ).toString(),
      );
      setValue(
        'artworkDimensions.depthCm.value',
        convertInchesToCentimeters(
          getValues('artworkDimensions.depthIn.value'),
        ).toString(),
      );
    }

    setIsInchesMeasurement(!!event?.target?.checked);
    setValue(
      'artworkDimensions.displayUnit.value',
      event?.target?.checked ? 'cm' : 'in',
    );
  };

  const onSubmit = (data: any) => {
    handleMeasurementChange();
    const artist_name = data.artistName.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replaceAll('.', '');
    const artwork_title = data.artworkTitle.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replaceAll('.', '');
    const slug = `${artist_name}-${artwork_title}`;
    setValue('slug.value', slug);
    if (
      Number(data.artworkDimensions.depthIn.value) &&
      Number(data.artworkDimensions.depthCm.value)
    ) {
      setValue(
        'artworkDimensions.text.value',
        `${data.artworkDimensions.widthIn.value} x 
        ${data.artworkDimensions.heightIn.value} x
        ${data.artworkDimensions.depthIn?.value}in;
        ${data.artworkDimensions.widthCm.value} x 
        ${data.artworkDimensions.heightCm.value} x
         ${data.artworkDimensions.depthCm?.value}cm`,
      );
    } else {
      setValue(
        'artworkDimensions.text.value',
        `${data.artworkDimensions.widthIn.value} x 
        ${data.artworkDimensions.heightIn.value}in;
        ${data.artworkDimensions.widthCm.value} x 
        ${data.artworkDimensions.heightCm.value}cm 
        `,
      );
    }

    saveArtwork(data);
  };

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);
    setTempImage(previewURL);
    setValue('artworkImage.value', previewURL);

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

  const handleCloseModal = () => {
    if (setCroppingModalOpen) {
      setCroppingModalOpen(false);
    }
  };

  return (
    <Box mb={2} sx={profileStyles.container}>
      <Box sx={createArtworkStyles.backButton}>
        <Button
          variant="outlined"
          sx={{color: PRIMARY_BLUE}}
          onClick={() => cancelAction(false)}
          startIcon={<ArrowBackIcon sx={{color: PRIMARY_BLUE}} />}>
          <Typography sx={{fontWeight: 'bold'}}>Cancel</Typography>
        </Button>
      </Box>
      <Box sx={createArtworkStyles.imageContainer}>
        <Box style={createArtworkStyles.defaultImageEdit}>
          {editImage ? (
            <>
              <DartaImageInput
                onDrop={handleDrop}
                instructions="Drag and drop an image of your artwork here, or click to select an image to upload."
              />
              <CroppingMattersModal
                open={croppingModalOpen || false}
                onClose={handleCloseModal}
              />
            </>
          ) : (
            <img
              src={tempImage as string}
              alt="artwork"
              style={createArtworkStyles.defaultImage}
            />
          )}
        </Box>
        {errors.artworkImage && (
          <Typography
            data-testid="artwork-image-error"
            sx={{color: 'red', alignSelf: 'center', textAlign: 'center'}}>
            {errors.artworkImage?.value?.message!}
          </Typography>
        )}
        <Box sx={{alignSelf: 'center'}}>
          <Button
            sx={{width: '40vw', alignSelf: 'center'}}
            onClick={() => setEditImage(!editImage)}
            variant="contained">
            <Typography
              sx={{fontSize: '0.8rem'}}
              data-testid="create-artwork-image-back-button-test">
              {editImage ? 'Back' : 'Edit Image'}
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box sx={createArtworkStyles.inputTextContainer}>
        <Box
          key="artwork"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            justifyContent: 'space-around',
            textAlign: 'center',
          }}>
          <Typography variant="h6" data-testid="artwork-page-title">
            Artwork
          </Typography>
        </Box>
        <Box key="artworkTitle" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="artworkTitle"
            data={newArtwork?.artworkTitle?.value as any}
            register={register}
            control={control}
            errors={errors}
            required={true}
            helperTextString={errors.artworkTitle?.value?.message}
            inputAdornmentString="Title"
            toolTips={createArtworkToolTips}
            multiline={1}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box key="artistName" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="artistName"
            data={newArtwork?.artistName?.value}
            register={register}
            errors={errors}
            required={true}
            control={control}
            helperTextString={errors.artistName?.value?.message}
            inputAdornmentString="Artist"
            toolTips={createArtworkToolTips}
            multiline={1}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box key="artworkDescription" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="artworkDescription"
            data={newArtwork?.artworkDescription?.value}
            register={register}
            errors={errors}
            required={false}
            control={control}
            helperTextString={errors.artworkDescription?.value?.message}
            inputAdornmentString="Info"
            toolTips={createArtworkToolTips}
            multiline={5}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box key="medium" sx={createArtworkStyles.inputText}>
          <DartaAutoComplete
            fieldName="artworkMedium"
            data={newArtwork?.artworkMedium}
            register={register}
            errors={errors}
            helperTextString={errors.artworkMedium?.value?.message}
            control={control}
            required={true}
            toolTips={createArtworkToolTips}
            label="Artwork Medium"
            allowPrivate={false}
            inputAdornmentString="Medium"
            inputOptions={mediums as any}
          />
        </Box>
        <Box key="artworkCreatedYear" sx={createArtworkStyles.inputText}>
          <DartaTextInput
            fieldName="artworkCreatedYear"
            data={newArtwork?.artworkCreatedYear}
            register={register}
            control={control}
            required={true}
            errors={errors}
            toolTips={createArtworkToolTips}
            multiline={1}
            allowPrivate={false}
            helperTextString={errors.artworkCreatedYear?.value?.message}
            inputAdornmentString="Year Created"
            inputAdornmentValue={null}
          />
        </Box>
        <Box
          key="pricing"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography variant="h6">Pricing & Inquires</Typography>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box sx={{my: 2}}>
              <DartaRadioButtonsGroup
                toolTips={createArtworkToolTips}
                fieldName="artworkCurrency"
                inputAdornmentString="Currency"
                control={control}
                required={true}
                options={currencies}
                setHigherLevelState={handleDisplayCurrency}
                helperTextString={errors.artworkCurrency?.value?.message}
                errors={errors}
                value={
                  getValues('artworkCurrency.value') ||
                  newArtwork?.artworkCurrency?.value
                }
              />
            </Box>
          </Box>
        </Box>
        <Box key="price" sx={createArtworkStyles.multiLineContainer}>
          <Box>
            <DartaTextInput
              fieldName="artworkPrice"
              data={newArtwork?.artworkPrice?.value}
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.artworkPrice?.value?.message}
              inputAdornmentString="Price"
              toolTips={createArtworkToolTips}
              multiline={1}
              allowPrivate={true}
              inputAdornmentValue={displayCurrency as string}
            />
          </Box>
          <Box key="canInquire">
            <DartaRadioButtonsGroup
              toolTips={createArtworkToolTips}
              fieldName="canInquire"
              inputAdornmentString="Users Can Inquire?"
              control={control}
              required={true}
              helperTextString=""
              errors={errors}
              options={['Yes', 'No']}
              setHigherLevelState={null}
              value={
                getValues('canInquire.value') || newArtwork?.canInquire?.value
              }
            />
          </Box>
        </Box>
        {errors?.canInquire && (
          <Typography
            data-testid="artwork-image-error"
            sx={{
              color: 'red',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {errors.canInquire?.value?.message!}
          </Typography>
        )}
        <Box
          key="artworkDimensions"
          sx={{
            ...createArtworkStyles.inputText,
            flexDirection: 'column',
            textAlign: 'center',
          }}>
          <Typography
            data-testid="artwork-dimensions-heading"
            variant="h6">{`Artwork Dimensions (${
            isInchesMeasurement ? 'cm' : 'in'
          })`}</Typography>
          <FormGroup>
            <FormControlLabel
              data-testid="measurement-change"
              control={
                <Switch color="secondary" onChange={handleMeasurementChange} />
              }
              label="centimeters"
              labelPlacement="start"
            />
          </FormGroup>
        </Box>
        <Box sx={createArtworkStyles.multiLineContainer}>
          <Box key="artworkDimensionsHeight" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? 'artworkDimensions.heightCm'
                  : 'artworkDimensions.heightIn'
              }
              data={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? newArtwork?.artworkDimensions?.heightCm
                  : newArtwork?.artworkDimensions?.heightIn
              }
              register={register}
              errors={errors}
              required={true}
              control={control}
              helperTextString={errors.artworkDimensions?.message}
              inputAdornmentString="height"
              toolTips={createArtworkDimensionsToolTip}
              multiline={1}
              allowPrivate={false}
              inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
            />
          </Box>
          <Box key="artworkDimensionsWidth" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? 'artworkDimensions.widthCm'
                  : 'artworkDimensions.widthIn'
              }
              data={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? newArtwork?.artworkDimensions?.widthCm
                  : newArtwork?.artworkDimensions?.widthIn
              }
              register={register}
              errors={errors}
              required={true}
              control={control}
              helperTextString={errors.artworkDimensions?.message}
              inputAdornmentString="width"
              toolTips={createArtworkDimensionsToolTip}
              multiline={1}
              allowPrivate={false}
              inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
            />
          </Box>
          <Box key="artworkDimensionDepth" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? 'artworkDimensions.depthCm'
                  : 'artworkDimensions.depthIn'
              }
              data={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? newArtwork?.artworkDimensions?.depthCm
                  : newArtwork?.artworkDimensions?.depthIn
              }
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={
                getValues('artworkDimensions.displayUnit.value') === 'cm'
                  ? errors.artworkDimensions?.depthCm?.value?.message
                  : errors.artworkDimensions?.depthIn?.value?.message
              }
              inputAdornmentString="depth"
              toolTips={createArtworkDimensionsToolTip}
              multiline={1}
              allowPrivate={false}
              inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
            />
          </Box>
        </Box>
        <Typography
          sx={{color: 'red', textAlign: 'center', mb: 2}}
          data-testid="dimensions-text-error-field">
          {errors?.artworkDimensions?.message}
        </Typography>
        <Box sx={createArtworkStyles.saveButtonContainer}>
          <Button
            variant="contained"
            data-testid="delete-artwork-button"
            color="error"
            onClick={() => {
              handleClickOpen();
            }}>
            <Typography sx={{fontWeight: 'bold'}}>Delete</Typography>
          </Button>
          <Button
            variant="contained"
            data-testid="save-artwork-button"
            type="submit"
            sx={{backgroundColor: PRIMARY_BLUE}}
            onClick={handleSubmit(onSubmit)}>
            <Typography sx={{fontWeight: 'bold'}}>Save</Typography>
          </Button>
        </Box>
      </Box>

      <DartaDialogue
        identifier={newArtwork?.artworkTitle?.value || '____'}
        deleteType="artwork"
        id={newArtwork?.artworkId as string}
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </Box>
  );
}

CreateArtwork.defaultProps = {
  croppingModalOpen: false,
  setCroppingModalOpen: () => {},
};
