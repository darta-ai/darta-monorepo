import * as Colors from '@darta-styles'
import {Artwork} from '@darta-types';
import {yupResolver} from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from '@mui/material';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {category, stylesAndMovements, visualQualities} from '../../../data/autofillValues';
import { mediums } from '../../../data/medium';
import {
  createArtworkDimensionsToolTip,
  createArtworkToolTips,
} from '../../common/ToolTips/toolTips';
import {
  convertCentimetersToInches,
  convertInchesToCentimeters,
} from '../../common/utils/unitConverter';
import { DartaAutoCompleteMulti } from '../FormComponents/DartaAutoCompleteMulti';
import {
  DartaAutoComplete,
  DartaDropdown,
  DartaImageInput,
  DartaRadioButtonsGroup,
  DartaTextInput,
} from '../FormComponents/index';
import {
  ConfirmDeleteExhibitionArtwork,
  CroppingMattersModal,
  DartaDialogue,
} from '../Modals/index';
import {profileStyles} from '../Profile/Components/profileStyles';
import {useAppState} from '../State/AppContext';
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
      value: yup.string().nullable().required('An artwork title is required.'),
    }),
    artistName: yup.object().shape({
      value: yup.string().nullable().required('An artist name is required.'),
    }),
    artworkImage: yup.object().shape({
      value: yup.string().nullable().required('An artwork image is required.'),
    }),
    artworkDescription: yup.object().shape({
      value: yup.string().optional(),
    }),
    artworkPrice: yup.object().shape({
      value: yup.string().optional(),
      isPrivate: yup.boolean().nullable().optional(),
    }),
    artworkCurrency: yup.object().shape({
      value: yup.string().optional(),
    }),
    canInquire: yup.object().shape({
      value: yup
        .string()
        .nullable()
        .required('Do you want users to be able to inquire about the art?'),
    }),
    artworkCreatedYear: yup.object().shape({
      value: yup
        .string()
        .nullable()
        .matches(/^(19[0-9]{2}|[2-9][0-9]{3})$/, 'Must be a valid year.')
        .required('The year or years created is required.')
        .min(4, 'Must be exactly 4 digits.')
        .max(4, 'Must be exactly 4 digits.'),
    }),
    artworkMedium: yup.object().shape({
      value: yup
        .string()
        .nullable()
        .required('The medium of the artwork is required.'),
    }),
    artworkCategory: yup.object().shape({
      value: yup
        .string()
        .nullable()
        .required('The category of the artwork is required.'),
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
        (value: {
          heightIn: {value?: string | null | undefined};
          heightCm: {value?: string | null | undefined};
        }) => !!(value.heightIn.value || value.heightCm.value),
      )
      .test(
        'either-or-width',
        'Artwork width must be a positive number and is required.',
        (value: {
          widthIn: {value?: string | null | undefined};
          widthCm: {value?: string | null | undefined};
        }) => !!(value.widthIn.value || value.widthCm.value),
      ),
  })
  .required();

export function CreateArtwork({
  newArtwork,
  cancelAction,
  handleSave,
  handleDelete,
  saveSpinner,
  deleteSpinner,
  croppingModalOpen,
  setCroppingModalOpen,
  handleRemoveArtworkFromExhibition,
  handleDeleteArtworkFromDarta,
}: {
  newArtwork: Artwork;
  cancelAction: (arg0: boolean) => void;
  handleSave: (savedArtwork: Artwork) => void;
  saveSpinner: boolean;
  deleteSpinner: boolean;
  croppingModalOpen?: boolean;
  handleDelete?: (arg0: string) => void;
  setCroppingModalOpen?: (arg0: boolean) => void;
  handleRemoveArtworkFromExhibition?: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
  handleDeleteArtworkFromDarta?: ({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }) => Promise<boolean>;
}) {
  const {state} = useAppState();

  const [isInchesMeasurement, setIsInchesMeasurement] =
    React.useState<boolean>(false);
  const [tempImage, setTempImage] = React.useState<string | null>(
    newArtwork?.artworkImage?.value || null,
  );

  const currencies = ['USD', 'EUR', 'GBP'];
  const [displayCurrency, setDisplayCurrency] = React.useState<string>('$');
  const handleDisplayCurrency = (arg0: string) => setDisplayCurrency(currencyConverter[arg0]);
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

  const onSubmit = async (data: any) => {
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
    if (data.artworkPrice.value) {
      setValue(
        'artworkPrice.value',
        data.artworkPrice.value.replace(/,/g, '').replace('$', ''),
      );
    }

    if (
      Number(data.artworkDimensions.depthIn.value) &&
      Number(data.artworkDimensions.depthCm.value)
    ) {
      setValue(
        'artworkDimensions.text.value',
        `
        ${data.artworkDimensions.heightIn.value} x
        ${data.artworkDimensions.widthIn.value} x 
        ${data.artworkDimensions.depthIn?.value}in;
        ${data.artworkDimensions.heightCm.value} x
        ${data.artworkDimensions.widthCm.value} x 
        ${data.artworkDimensions.depthCm?.value}cm
         `,
      );
    } else {
      setValue(
        'artworkDimensions.text.value',
        `
        ${data.artworkDimensions.heightIn.value} x
        ${data.artworkDimensions.widthIn.value}in; 
        ${data.artworkDimensions.heightCm.value} x 
        ${data.artworkDimensions.widthCm.value}cm
        `,
      );
    }
    handleSave(data);
  };

  const handleDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const previewURL = URL.createObjectURL(file);
    setTempImage(previewURL);

    const reader = new FileReader();

    reader.onload = event => {
      // event.target.result contains the file's data as a base64 encoded string.
      if (event.target?.result) {
        const fileData = event.target.result;
        setValue('artworkImage.fileData', fileData);
        setValue('artworkImage.fileName', file.name);
      }
    };

    reader.readAsDataURL(file); // Read the file content as Data URL.

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

  const exhibitionId = newArtwork?.exhibitionId;

  const isInExhibitionRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (exhibitionId) {
      const exhibition = state.galleryExhibitions?.[exhibitionId];
      const artworkId = newArtwork?.artworkId;

      if (exhibition?.artworks && artworkId) {
        isInExhibitionRef.current = Boolean(exhibition.artworks[artworkId]);
      }
      if (exhibition?.exhibitionArtist && exhibition.exhibitionArtist.value) {
        setValue('artistName.value', exhibition.exhibitionArtist.value);
      }
    }
  }, []);
  const isInExhibition = isInExhibitionRef.current;

  return (
    <Box mb={2} sx={profileStyles.container}>
      <Box sx={createArtworkStyles.backButton}>
        <Button
          variant="outlined"
          sx={{color: Colors.PRIMARY_600}}
          onClick={() => cancelAction(false)}
          startIcon={<ArrowBackIcon sx={{color: Colors.PRIMARY_600}} />}>
          <Typography sx={{fontWeight: 'bold'}}>Cancel</Typography>
        </Button>
      </Box>
      <Box sx={createArtworkStyles.imageAndKeyInformationContainer}>
        <Box sx={createArtworkStyles.keyInformationContainer}>
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
                <Box sx={createArtworkStyles.defaultImageContainer}>
                  <Box
                    component="img"
                    src={tempImage as string}
                    alt="artwork"
                    style={createArtworkStyles.defaultImage}
                  />
                </Box>
              )}
            {errors.artworkImage && (
              <Typography
                data-testid="artwork-image-error"
                sx={{color: 'red', alignSelf: 'center', textAlign: 'center'}}>
                {errors.artworkImage?.value?.message!}
              </Typography>
            )}
            </Box>
          </Box>
          <Box sx={createArtworkStyles.imageButtonContainer}>
            <Button
              sx={{width: '30vw'}}
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
      <Box sx={createArtworkStyles.keyInformationContainer}>
      <Typography variant="h6" sx={{alignSelf: 'center'}}>Basic Information</Typography>
        <Box key="artworkTitle" sx={createArtworkStyles.multiLineContainer}>
          <DartaTextInput
              fieldName="artworkTitle"
              data={newArtwork?.artworkTitle?.value as any}
              register={register}
              control={control}
              errors={errors}
              required
              helperTextString={errors.artworkTitle?.value?.message}
              inputAdornmentString="Title"
              toolTips={createArtworkToolTips}
              allowPrivate={false}
              rows={2}
              inputAdornmentValue={null}
            />
        </Box>
        <Box key="artistName" sx={createArtworkStyles.multiLineContainer}>
          <DartaTextInput
            fieldName="artistName"
            data={newArtwork?.artistName?.value}
            register={register}
            errors={errors}
            required
            control={control}
            helperTextString={errors.artistName?.value?.message}
            inputAdornmentString="Artist"
            toolTips={createArtworkToolTips}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box>
        <Box key="artworkCreatedYear" sx={createArtworkStyles.multiLineContainer}>
          <DartaTextInput
            fieldName="artworkCreatedYear"
            data={newArtwork?.artworkCreatedYear}
            register={register}
            control={control}
            required
            errors={errors}
            toolTips={createArtworkToolTips}
            allowPrivate={false}
            helperTextString={errors.artworkCreatedYear?.value?.message}
            inputAdornmentString="Year Created"
            inputAdornmentValue={null}
          />
        </Box>


      </Box>
      </Box>
      <Box sx={createArtworkStyles.imageAndKeyInformationContainer}>
      <Box sx={createArtworkStyles.keyInformationContainer}>
        <Typography variant="h6" sx={{alignSelf: 'center'}}>Dimensions</Typography>
        <Box sx={{alignContent: 'center', alignSelf: 'center'}}>
          <FormGroup >
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
        <Box key="artworkDimensionsHeight" sx={createArtworkStyles.multiLineContainer}>
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
            required
            control={control}
            helperTextString={errors.artworkDimensions?.message}
            inputAdornmentString="height"
            toolTips={createArtworkDimensionsToolTip}
            allowPrivate={false}
            inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
          />
        </Box>
      <Box key="artworkDimensionsWidth" sx={createArtworkStyles.multiLineContainer}>
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
              required
              control={control}
              helperTextString={errors.artworkDimensions?.message}
              inputAdornmentString="width"
              toolTips={createArtworkDimensionsToolTip}
              allowPrivate={false}
              inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
            />
        </Box>
        <Box key="artworkDimensionsDepth" sx={createArtworkStyles.multiLineContainer}>
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
              allowPrivate={false}
              inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
            />
        </Box>
        <Box sx={{alignSelf: 'center'}}>
          <Typography
            sx={{color: 'red', textAlign: 'center', mb: 2}}
            data-testid="dimensions-text-error-field">
            {errors?.artworkDimensions?.message}
          </Typography>
        </Box>
      </Box>

        <Box sx={createArtworkStyles.keyInformationContainer}>
        <Typography variant="h6" sx={{alignSelf: 'center'}}>Availability & Pricing</Typography>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <DartaRadioButtonsGroup
              toolTips={createArtworkToolTips}
              fieldName="canInquire"
              inputAdornmentString="Users Can Inquire?"
              control={control}
              required
              helperTextString=""
              errors={errors}
              options={['Yes', 'No']}
              setHigherLevelState={null}
              value={
                getValues('canInquire.value') || newArtwork?.canInquire?.value
              }
            />
          </Box>
          {errors?.canInquire && (
            <Typography
              data-testid="canInquire-text-error-field"
              sx={{
                color: 'red',
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              {errors.canInquire?.value?.message!}
            </Typography>
            )}
          <Box sx={createArtworkStyles.multiLineContainer}>
            <DartaRadioButtonsGroup
              toolTips={createArtworkToolTips}
              fieldName="artworkCurrency"
              inputAdornmentString="Currency"
              control={control}
              required
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
            <Box sx={createArtworkStyles.multiLineContainer}>
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
                allowPrivate
                inputAdornmentValue={displayCurrency as string}
              />
          </Box> 
        </Box>
      </Box>
      <Box sx={createArtworkStyles.imageAndKeyInformationContainer}>
      <Box sx={createArtworkStyles.keyInformationContainer}>
        <Typography variant="h6" sx={{alignSelf: 'center'}}>Information</Typography>
      <Box key="artworkCategory" sx={createArtworkStyles.multiLineContainer}>
          <DartaDropdown
            fieldName="artworkCategory"
            options={category as any}
            register={register}
            helperTextString={errors.artworkCategory?.value?.message}
            control={control}
            required
            toolTips={createArtworkToolTips}
            inputAdornmentString="Category"
          />
        </Box>
        <Box key="medium" sx={createArtworkStyles.multiLineContainer}>
          <DartaAutoComplete
            fieldName="artworkMedium"
            data={newArtwork?.artworkMedium}
            register={register}
            errors={errors}
            helperTextString={errors.artworkMedium?.value?.message}
            control={control}
            required
            toolTips={createArtworkToolTips}
            label="Artwork Medium"
            allowPrivate={false}
            inputAdornmentString="Medium"
            inputOptions={mediums as any}
          />
        </Box>
      </Box>
      <Box sx={createArtworkStyles.keyInformationContainer}>
        <Typography variant="h6" sx={{alignSelf: 'center'}}>Tags</Typography>
        <Box key="tags" sx={createArtworkStyles.multiLineContainer}>
          <DartaAutoCompleteMulti
            fieldName="artworkStyleTags"
            data={newArtwork?.artworkStyleTags}
            register={register}
            errors={errors}
            helperTextString={errors.artworkStyleTags?.message}
            control={control}
            required={false}
            toolTips={createArtworkToolTips}
            label="Artwork Style Tags"
            allowPrivate={false}
            inputAdornmentString="Style/Movement"
            inputOptions={stylesAndMovements as any}
          />
        </Box>
          <Box key="Style" sx={createArtworkStyles.multiLineContainer}>
              <DartaAutoCompleteMulti
                fieldName="artworkVisualTags"
                data={newArtwork?.artworkVisualTags}
                register={register}
                errors={errors}
                helperTextString={errors.artworkVisualTags?.message}
                control={control}
                required={false}
                toolTips={createArtworkToolTips}
                label="Artwork Visual Tags"
                allowPrivate={false}
                inputAdornmentString="Visual"
                inputOptions={visualQualities as any}
              />
            </Box>

        </Box>
      </Box>
        <Box key="Description" sx={createArtworkStyles.multiLineContainer}>
          <DartaTextInput
            fieldName="artworkDescription"
            data={newArtwork?.artworkDescription?.value}
            register={register}
            errors={errors}
            required={false}
            control={control}
            helperTextString={errors.artworkDescription?.value?.message}
            inputAdornmentString="Description"
            toolTips={createArtworkToolTips}
            allowPrivate={false}
            inputAdornmentValue={null}
          />
        </Box> 

      <Box key="saveContainer" sx={createArtworkStyles.inputText} />
        <Box sx={createArtworkStyles.saveButtonContainer}>
          <Button
            variant="contained"
            data-testid="delete-artwork-button"
            disabled={deleteSpinner}
            sx={{
              backgroundColor: Colors.PRIMARY_200, 
              alignSelf: 'center',
              width: '15vw',
              '@media (min-width: 800px)': {
                width: '10vw',
              },
            }}
            onClick={() => {
              handleClickOpen();
            }}>
            {deleteSpinner ? (
              <CircularProgress size={24} />
            ) : (
              <Typography sx={{fontWeight: 'bold'}}>Delete</Typography>
            )}
          </Button>
          <Button
            variant="contained"
            data-testid="save-artwork-button"
            type="submit"
            disabled={saveSpinner}
            sx={{
              alignSelf: 'center',
              backgroundColor: Colors.PRIMARY_900,
              width: '30vw',
              '@media (min-width: 800px)': {
                width: '10vw',
              },
            }}
            onClick={handleSubmit(onSubmit)}>
            {saveSpinner ? (
              <CircularProgress size={24} />
            ) : (
              <Typography sx={{fontWeight: 'bold', color: Colors.PRIMARY_50}}>
                Save
              </Typography>
            )}
          </Button>
        </Box>
      {isInExhibition &&
        newArtwork.artworkId &&
        newArtwork.exhibitionId &&
        handleDeleteArtworkFromDarta &&
        handleRemoveArtworkFromExhibition && (
          <ConfirmDeleteExhibitionArtwork
            artworkId={newArtwork.artworkId}
            open={open}
            handleClose={handleClose}
            exhibitionId={newArtwork.exhibitionId}
            handleDeleteArtworkFromDarta={handleDeleteArtworkFromDarta}
            handleRemoveArtworkFromExhibition={
              handleRemoveArtworkFromExhibition
            }
          />
        )}
      {handleDelete && !isInExhibition && (
        <DartaDialogue
          identifier={newArtwork?.artworkTitle?.value || 'this artwork'}
          deleteType="this artwork"
          id={newArtwork?.artworkId as string}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
    </Box>
  );
}

CreateArtwork.defaultProps = {
  croppingModalOpen: false,
  setCroppingModalOpen: () => {},
  handleDeleteArtworkFromDarta: () => {},
  handleRemoveArtworkFromExhibition: () => {},
  handleDelete: () => {},
};
