/* eslint-disable jsx-a11y/label-has-associated-control */
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  MobileStepper,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import * as XLSX from 'xlsx';

import {Artwork} from '../../../globalTypes';
import {PRIMARY_MILK} from '../../../styles';
import {parseExcelArtworkData} from '../../common/nextFunctions';

const excelPNG = require(`../../../public/static/images/excelExample.png`);
const artLogicPNG = require(`../../../public/static/images/artLogicInstructions.png`);

const tutorialSteps = [
  {
    label:
      'Create an excel with "Artist", "Title", "Year", "Medium", "Dimensions", "Main image URL" as COLUMN HEADERS. "Display price ex tax" is optional.',
    callToActionText: '',
    callToActionLink: '',
    imgPath: excelPNG,
    alt: 'Excel example template.',
  },
  {
    label: `If you are using art logic, you can download a formatted excel from them and upload it here.`,
    callToActionText: 'Click here to view instructions',
    callToActionLink:
      'https://support.artlogic.net/hc/en-gb/articles/360020534099-How-to-export-artwork-details-images-and-image-filenames-to-excel#:~:text=Log%20into%20your%20Artlogic%20database,to%20export%20from%20your%20database.&text=Using%20the%20custom%20export%20tool,associated%20with%20the%20artwork%20records',
    imgPath: artLogicPNG,
    alt: 'Chose the fields you wish to export.',
  },
  // Add more steps as needed
];

const instructionsCarouselStyles = {
  root: {
    flexGrow: 1,
    height: '50vh',
    width: '80vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '@media (min-width: 800px)': {
      width: '50vw',
    },
  },
  header: {
    display: 'flex',
    my: 2,
    alignItems: 'flex-start',
    backgroundColor: PRIMARY_MILK,
  },
  img: {
    overflow: 'hidden',
    display: 'block',
    width: '100%',
    height: '100%',
  },
  typographyMain: {
    fontSize: '1rem',
    '@media (min-width: 800px)': {
      fontSize: '1.2rem',
    },
  },
  callToAction: {
    fontWeight: 'bold',
    fontSize: '1rem',
    '@media (min-width: 800px)': {
      fontSize: '1.2rem',
    },
  },
};

function InstructionsCarousel() {
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <Box sx={instructionsCarouselStyles.root}>
      <Paper square elevation={0.5} sx={instructionsCarouselStyles.header}>
        <Typography sx={instructionsCarouselStyles.callToAction}>
          {tutorialSteps[activeStep].label}
        </Typography>
      </Paper>
      <Image
        style={{...instructionsCarouselStyles.img}}
        src={tutorialSteps[activeStep].imgPath}
        width={200}
        height={300}
        alt={tutorialSteps[activeStep].alt}
      />
      {tutorialSteps[activeStep]?.callToActionText && (
        <Typography sx={instructionsCarouselStyles.callToAction}>
          <a
            target="_blank"
            href={tutorialSteps[activeStep].callToActionLink}
            rel="noreferrer">
            {tutorialSteps[activeStep].callToActionText}
          </a>
        </Typography>
      )}
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            color="secondary"
            variant="contained">
            Next
            <KeyboardArrowRightIcon />
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            color="secondary"
            variant="contained">
            <KeyboardArrowLeftIcon />
            Back
          </Button>
        }
      />
    </Box>
  );
}

const uploadArtworkImages = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 2,
  },
  paper: {
    backgroundColor: PRIMARY_MILK,
    border: '2px solid #000',
    boxShadow: 5,
    padding: 3,
  },
};

interface UploadArtworksXlsModalProps {
  handleBatchUpload: (artworks: {[key: string]: Artwork}) => void;
}

export function UploadArtworksXlsModal({
  handleBatchUpload,
}: UploadArtworksXlsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files![0];
    const reader = new FileReader();
    reader.onload = async evt => {
      /* Parse data */
      const bstr = evt.target!.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr as string, {type: 'binary'});

      /* Get first worksheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* Convert array of arrays */
      const data: any[][] = XLSX.utils.sheet_to_json(ws, {header: 1});

      // First row is headers
      const headers: string[] = data[0];
      const rows: any[] = data.slice(1).map(row => {
        const rowData: any = {};
        row.forEach((cell, i) => {
          rowData[headers[i]] = cell;
        });
        return rowData;
      });
      const results = parseExcelArtworkData(rows);

      if (results) {
        handleBatchUpload(results);
      }

      // Simulate a delay. Replace this with actual logic.
      // eslint-disable-next-line no-promise-executor-return
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLoading(false);
      setSuccess(true);
      handleClose();
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <Button
        className="upload-new-artwork"
        variant="contained"
        color="primary"
        onClick={handleOpen}>
        <Typography sx={{fontWeight: 'bold', fontSize: '0.8rem'}}>
          Upload Artwork From Excel
        </Typography>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        sx={uploadArtworkImages.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition>
        <Fade in={open}>
          <Box sx={uploadArtworkImages.paper}>
            <Typography variant="h4">Instructions</Typography>
            <InstructionsCarousel />
            <Box
              component="span"
              m={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <input
                accept=".xlsx,.xls"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{display: 'none'}}
                id="contained-button-file"
                type="file"
                onChange={handleFileUpload}
              />
              {success ? (
                <Fade in={success}>
                  <Typography variant="h5">Upload Successful!</Typography>
                </Fade>
              ) : (
                <Fade in={!success}>
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      color="secondary"
                      component="span">
                      Click Here To Upload Excel
                    </Button>
                  </label>
                </Fade>
              )}
            </Box>
            {loading && <CircularProgress />}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
