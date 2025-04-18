import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  LinearProgress,
  // MobileStepper,
  Modal,
  // Paper,
  Typography,
} from '@mui/material';
// import Image from 'next/image';
import React from 'react';
import * as XLSX from 'xlsx';

import {parseExcelArtworkData} from '../../common/nextFunctions';

// const excelPNG = require(`../../../public/static/images/excelExample.png`);
// const artLogicPNG = require(`../../../public/static/images/artLogicInstructions.png`);

// const tutorialSteps = [
//   {
//     label:
//       'Create an excel with "Artist", "Title", "Year", "Medium", "Dimensions", "Main image URL" as COLUMN HEADERS. "Display price ex tax" is optional.',
//     callToActionText: '',
//     callToActionLink: '',
//     imgPath: excelPNG,
//     alt: 'Excel example template.',
//   },
//   // Add more steps as needed
// ];

// const instructionsCarouselStyles = {
//   root: {
//     flexGrow: 1,
//     height: '50vh',
//     width: '80vw',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-around',
//     '@media (min-width: 800px)': {
//       width: '50vw',
//     },
//   },
//   header: {
//     display: 'flex',
//     my: 2,
//     alignItems: 'flex-start',
//     backgroundColor: Colors.PRIMARY_100,
//   },
//   img: {
//     overflow: 'hidden',
//     display: 'block',
//     width: '100%',
//     height: '100%',
//   },
//   typographyMain: {
//     fontSize: '1rem',
//     '@media (min-width: 800px)': {
//       fontSize: '1.2rem',
//     },
//   },
//   callToAction: {
//     fontWeight: 'bold',
//     fontSize: '1rem',
//     '@media (min-width: 800px)': {
//       fontSize: '1.2rem',
//     },
//   },
//   buttonSize: {
//     fontSize: '1rem',
//     width: '60vw',
//     height: '5vh',
//     '@media (min-width: 800px)': {
//       width: '50vw',
//     },
//   },
// };

// function InstructionsCarousel() {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const maxSteps = tutorialSteps.length;

//   const handleNext = () => {
//     setActiveStep(prevActiveStep => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep(prevActiveStep => prevActiveStep - 1);
//   };

//   return (
//     <Box sx={instructionsCarouselStyles.root}>
//       <Paper square elevation={1} sx={instructionsCarouselStyles.header}>
//         <Typography sx={instructionsCarouselStyles.callToAction}>
//           {tutorialSteps[activeStep].label}
//         </Typography>
//       </Paper>
//       <Image
//         style={{...instructionsCarouselStyles.img}}
//         src={tutorialSteps[activeStep].imgPath}
//         width={300}
//         height={300}
//         alt={tutorialSteps[activeStep].alt}
//       />
//       {tutorialSteps[activeStep]?.callToActionText && (
//         <Typography sx={instructionsCarouselStyles.callToAction}>
//           <a
//             target="_blank"
//             href={tutorialSteps[activeStep].callToActionLink}
//             rel="noreferrer">
//             {tutorialSteps[activeStep].callToActionText}
//           </a>
//         </Typography>
//       )}
//       <MobileStepper
//         steps={maxSteps}
//         position="static"
//         variant="dots"
//         activeStep={activeStep}
//         nextButton={
//           <Button
//             size="small"
//             onClick={handleNext}
//             disabled={activeStep === maxSteps - 1}
//             color="secondary"
//             variant="contained">
//             Next
//             <KeyboardArrowRightIcon />
//           </Button>
//         }
//         backButton={
//           <Button
//             size="small"
//             onClick={handleBack}
//             disabled={activeStep === 0}
//             color="secondary"
//             variant="contained">
//             <KeyboardArrowLeftIcon />
//             Back
//           </Button>
//         }
//       />
//     </Box>
//   );
// }

const uploadArtworkImages = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 2,
  },
  paper: {
    backgroundColor: Colors.PRIMARY_100,
    border: '2px solid #000',
    boxShadow: 5,
    padding: 3,
  },
};

interface UploadArtworksXlsModalProps {
  exhibitionId: string;
  handleBatchUpload: ({artworks, exhibitionId}: {artworks: Artwork[], exhibitionId: string}) => Promise<void>;
}

export function UploadArtworksXlsModal({
  exhibitionId,
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      const results = await parseExcelArtworkData({rows, exhibitionId});

      if (results) {
        await handleBatchUpload({artworks: results, exhibitionId});
      }

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
        onClick={handleOpen}
        sx={{
          color: Colors.PRIMARY_800,
          alignSelf: 'center',
          width: '30vw',
          '@media (min-width: 1080px)': {
            width: '20vw',
          },
        }}
        >
        <Typography sx={{fontWeight: 'bold', fontSize: '0.8rem'}}>
          Upload Artwork From csv File
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
            <Typography variant="h4">Upload Artwork</Typography>
            {/* <InstructionsCarousel /> */}
            <Box
              component="span"
              m={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <Box sx={{width: '100%'}}>
                  <LinearProgress color="secondary" />
                </Box>
              ) : (
                <>
                  <input
                    accept=".xlsx,.xls,.numbers"
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
                          disabled={loading}
                          sx={{
                            alignSelf: 'center',
                            width: '50vw',
                            '@media (min-width: 800px)': {
                              width: '20vw',
                            },
                          }}
                          component="span">
                          {loading ? (
                            <CircularProgress color="secondary" size={20} />
                          ) : (
                            <Typography sx={{fontWeight: 'bold'}}>
                              Upload From .xls File
                            </Typography>
                          )}
                        </Button>
                      </label>
                    </Fade>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
