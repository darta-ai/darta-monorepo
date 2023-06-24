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
import Head from 'next/head';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {mediums} from '../../../data/medium';
import {Artwork} from '../../../globalTypes';
import {PRIMARY_BLUE} from '../../../styles';
import {
  DartaAutoComplete,
  DartaImageInput,
  DartaRadioButtonsGroup,
  DartaTextInput,
} from '../FormComponents/index';
import {DartaDialogue} from '../Modals/DartaDialogue';
import {createArtworkStyles} from './styles';

const createArtworkSchema = yup
  .object({
    artworkTitle: yup.object().shape({
      value: yup.string().required('An artwork title is required'),
    }),
    artistName: yup.object().shape({
      value: yup.string().required('An artist name is required'),
    }),
    artworkImage: yup.object().shape({
      value: yup.string().required('An artwork image is required'),
    }),
    artworkDescription: yup.object().shape({
      value: yup.string().optional(),
    }),
    artworkPrice: yup.object().shape({
      value: yup.string().optional(),
      isPrivate: yup.boolean().optional(),
    }),
    canInquire: yup.object().shape({
      value: yup.string().required('An artwork image is required'),
    }),
    artworkCreatedYear: yup.object().shape({
      value: yup
        .string()
        .required('The year or years created is required')
        .min(4, 'Must be exactly 4 digits')
        .max(4, 'Must be exactly 4 digits'),
    }),
    artworkMedium: yup.object().shape({
      value: yup.string().required('The medium of the artwork is required'),
    }),
    artworkDimensionsWidth: yup.object().shape({
      value: yup
        .string()
        .required(
          'An artwork width is required to display the artwork on the mobile app',
        ),
    }),
    artworkDimensionsHeight: yup.object().shape({
      value: yup
        .string()
        .required(
          'An artwork height is required to display the artwork on the mobile app',
        ),
    }),
    artworkDimensions: yup.object().shape({
      height: yup.object().shape({
        value: yup.string().optional(),
      }),
      width: yup.object().shape({
        value: yup.string().optional(),
      }),
      depth: yup.object().shape({
        value: yup.string().optional(),
      }),
    }),
  })
  .required();

const toolTips = {
  artworkTitle: 'The title of the artwork. Required.',
  artistName: 'The name of the artist. Required',
  artworkDescription:
    'An artwork description helps improve user experience. Optional.',
  galleryPrimaryLocation:
    'The location of your gallery will help guide users to your openings.',
  price: 'Optional field. If you do not wish to include a price, leave blank.',
  canInquire:
    'Allow users to inquire about the artwork. If you do not wish to allow users to inquire, select "No".',
  medium: 'The medium of the artwork.',
  artworkCreatedYear: 'The year the artwork was created.',
};

const artworkDimensionsToolTip = {
  artworkDimensionsHeight:
    'Including accurate height is imperative to accurate display of this artwork on the app.',
  artworkDimensionsWidth:
    'Including accurate width is imperative to accurate display of this artwork on the app.',
  'artworkDimensions.depth':
    'Depth of the artwork is generally reserved for sculptures.',
};

export function CreateArtwork({
  newArtwork,
  cancelAction,
  saveArtwork,
  handleDelete,
}: {
  newArtwork: Artwork;
  cancelAction: (arg0: boolean) => void;
  saveArtwork: (arg0: Artwork) => void;
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
      ...newArtwork,
    },
    resolver: yupResolver(createArtworkSchema),
  });

  const onSubmit = (data: any) => {
    console.log('triggered');
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
    setValue(
      'artworkDimensions.height.value',
      data.artworkDimensionsHeight.value.toString(),
    );
    setValue(
      'artworkDimensions.width.value',
      data.artworkDimensionsWidth.value.toString(),
    );
    if (data.artworkDimensions.depth.value) {
      setValue(
        'artworkDimensions.text.value',
        `${data.artworkDimensionsWidth.value}${data.artworkDimensions.unit.value} x 
        ${data.artworkDimensionsHeight.value}${data.artworkDimensions.unit.value} x 
        ${data.artworkDimensions.depth.value}${data.artworkDimensions.unit.value}`,
      );
    } else {
      setValue(
        'artworkDimensions.text.value',
        `${data.artworkDimensionsWidth.value}${data.artworkDimensions.unit.value} x 
        ${data.artworkDimensionsHeight.value}${data.artworkDimensions.unit.value}`,
      );
    }

    saveArtwork(data);
  };

  const [isInchesMeasurement, setIsInchesMeasurement] = React.useState(false);
  const [tempImage, setTempImage] = React.useState<string | null>(
    newArtwork.artworkImage.value || null,
  );
  const [displayCurrency, setDisplayCurrency] = React.useState<string>('$');

  const handleMeasurementChange = (event: any) => {
    setIsInchesMeasurement(event.target.checked);
    setValue(
      'artworkDimensions.unit.value',
      event.target.checked ? 'cm' : 'in',
    );
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

  return (
    <>
      <Head>
        <title>Gallery | Create Artwork</title>
        <meta name="description" content="Edit your gallery." />
      </Head>
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
                instructions="Drag and drop an image of your artwork here, or click to select an image to upload."
              />
            </Box>
          ) : (
            <img
              src={tempImage as string}
              alt="artwork"
              style={createArtworkStyles.defaultImage}
            />
          )}
          {errors.artworkImage && (
            <Typography
              variant="body2"
              sx={{color: 'red', alignSelf: 'center'}}>
              {errors.artworkImage.value?.message}
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
            key="artwork"
            mt={6}
            sx={{
              ...createArtworkStyles.inputText,
              flexDirection: 'column',
              textAlign: 'center',
            }}>
            <Typography variant="h6">Artwork</Typography>
          </Box>
          <Box key="artworkTitle" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName="artworkTitle"
              data={newArtwork.artworkTitle?.value as any}
              register={register}
              control={control}
              errors={errors}
              required={true}
              helperTextString={errors.artworkTitle?.value?.message}
              inputAdornmentString="Title"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="artistName" sx={createArtworkStyles.inputTextContainer}>
            <DartaTextInput
              fieldName="artistName"
              data={newArtwork.artistName?.value}
              register={register}
              errors={errors}
              required={true}
              control={control}
              helperTextString={errors.artistName?.value?.message}
              inputAdornmentString="Artist"
              toolTips={toolTips}
              multiline={false}
              allowPrivate={false}
              inputAdornmentValue={null}
            />
          </Box>
          <Box key="artworkDescription" sx={createArtworkStyles.inputText}>
            <DartaTextInput
              fieldName="artworkDescription"
              data={newArtwork.artworkDescription?.value}
              register={register}
              errors={errors}
              required={false}
              control={control}
              helperTextString={errors.artworkDescription?.value?.message}
              inputAdornmentString="Description"
              toolTips={toolTips}
              multiline={true}
              allowPrivate={false}
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
            <Typography variant="h6">Pricing</Typography>
            <Box>
              <DartaRadioButtonsGroup
                toolTips={toolTips}
                fieldName="artworkCurrency"
                inputAdornmentString=""
                control={control}
                defaultValue="USD"
                options={['USD', 'EUR', 'GBP']}
                setDisplayCurrency={setDisplayCurrency}
              />
            </Box>
          </Box>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box key="price" sx={createArtworkStyles.inputText}>
              <DartaTextInput
                fieldName="artworkPrice"
                data={newArtwork.artworkPrice?.value}
                register={register}
                errors={errors}
                required={false}
                control={control}
                helperTextString={errors.artworkPrice?.value?.message}
                inputAdornmentString="Price"
                toolTips={toolTips}
                multiline={false}
                allowPrivate={true}
                inputAdornmentValue={displayCurrency as string}
              />
            </Box>
            <Box key="canInquire" sx={createArtworkStyles.inputText}>
              <DartaRadioButtonsGroup
                toolTips={toolTips}
                fieldName="canInquire"
                inputAdornmentString="Can Inquire"
                control={control}
                defaultValue="Yes"
                options={['Yes', 'No']}
                setDisplayCurrency={null}
              />
            </Box>
          </Box>
          <Box
            key="production"
            sx={{
              ...createArtworkStyles.inputText,
              flexDirection: 'column',
              textAlign: 'center',
            }}>
            <Typography variant="h6">Production</Typography>
          </Box>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box key="medium" sx={createArtworkStyles.inputText}>
              <DartaAutoComplete
                fieldName="artworkMedium"
                data={newArtwork.artworkMedium}
                register={register}
                errors={errors}
                control={control}
                required={true}
                toolTips={toolTips}
                label="Artwork Medium"
                allowPrivate={false}
                inputAdornmentString="Medium"
                inputOptions={mediums as any}
              />
            </Box>
            <Box key="artworkCreatedYear" sx={createArtworkStyles.inputText}>
              <DartaTextInput
                fieldName="artworkCreatedYear"
                data={newArtwork.artworkCreatedYear}
                register={register}
                control={control}
                required={true}
                errors={errors}
                toolTips={toolTips}
                multiline={false}
                allowPrivate={false}
                helperTextString={errors.artworkCreatedYear?.value?.message}
                inputAdornmentString="Year Created"
                inputAdornmentValue={null}
              />
            </Box>
          </Box>
          <Box
            key="artworkDimensions"
            sx={{
              ...createArtworkStyles.inputText,
              flexDirection: 'column',
              textAlign: 'center',
            }}>
            <Typography variant="h6">{`Artwork Dimensions (${
              isInchesMeasurement ? 'cm' : 'in'
            })`}</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color="secondary"
                    onChange={handleMeasurementChange}
                  />
                }
                label="centimeters"
                labelPlacement="start"
              />
            </FormGroup>
          </Box>
          <Box sx={createArtworkStyles.multiLineContainer}>
            <Box
              key="artworkDimensionsHeight"
              sx={createArtworkStyles.inputText}>
              <DartaTextInput
                fieldName="artworkDimensionsHeight"
                data={newArtwork.artworkDimensions?.height}
                register={register}
                errors={errors}
                required={true}
                control={control}
                helperTextString={
                  errors.artworkDimensions?.height?.value?.message
                }
                inputAdornmentString="Height"
                toolTips={artworkDimensionsToolTip}
                multiline={false}
                allowPrivate={false}
                inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
              />
            </Box>
            <Box
              key="artworkDimensionsWidth"
              sx={createArtworkStyles.inputText}>
              <DartaTextInput
                fieldName="artworkDimensionsWidth"
                data={newArtwork.artworkDimensions?.width}
                register={register}
                errors={errors}
                required={true}
                control={control}
                helperTextString={
                  errors.artworkDimensions?.width?.value?.message
                }
                inputAdornmentString="Width"
                toolTips={artworkDimensionsToolTip}
                multiline={false}
                allowPrivate={false}
                inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
              />
            </Box>
            <Box key="artworkDimensionDepth" sx={createArtworkStyles.inputText}>
              <DartaTextInput
                fieldName="artworkDimensions.depth"
                data={newArtwork.artworkDimensions?.depth}
                register={register}
                errors={errors}
                required={false}
                control={control}
                helperTextString={
                  errors.artworkDimensions?.depth?.value?.message
                }
                inputAdornmentString="Depth"
                toolTips={artworkDimensionsToolTip}
                multiline={false}
                allowPrivate={false}
                inputAdornmentValue={isInchesMeasurement ? 'cm' : 'in'}
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
          artworkTitle={newArtwork.artworkTitle.value || '____'}
          artworkId={newArtwork.artworkId as string}
          artistName={newArtwork.artistName.value || '____'}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      </Box>
    </>
  );
}
