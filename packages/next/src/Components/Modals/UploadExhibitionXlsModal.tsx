

import * as Colors from '@darta-styles';
import {Exhibition} from '@darta-types';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  LinearProgress,
  Modal,
  Typography,
} from '@mui/material';
import React from 'react';
import * as XLSX from 'xlsx';

import { createExhibitionAPI, editExhibitionAPI } from '../../API/exhibitions/exhibitionRotes';
import {handleBatchArtworkUpload, parseExcelArtworkData,parseExcelExhibitionData} from '../../common/nextFunctions';

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
  galleryId: string;
  updateExhibitions: (exhibition: Exhibition) => void;
}

export function UploadExhibitionXlsModal({
  updateExhibitions,
  galleryId,
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
    try {
      setLoading(true);
      const file = event.target.files![0];
      const reader = new FileReader();
      reader.onload = async evt => {
        /* Parse data */
        const bstr = evt.target!.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr as string, {type: 'binary'});
  
        /* Get first worksheet */
        const exhibitionWsName: string = wb.SheetNames[0];
        const exhibitionWorksheet: XLSX.WorkSheet = wb.Sheets[exhibitionWsName];
  
        /* get second worksheet */
        const artworksWsName: string = wb.SheetNames[1];
        const artworksWorksheet: XLSX.WorkSheet = wb.Sheets[artworksWsName];
  
        /* Convert array of arrays */
        const exhibitionData: any[][] = XLSX.utils.sheet_to_json(exhibitionWorksheet, {header: 1});
        const artworksData: any[][] = XLSX.utils.sheet_to_json(artworksWorksheet, {header: 1});
  
        // First row is headers
        const exhibitionHeaders: string[] = exhibitionData[0];
        const exhibitionRows: any[] = exhibitionData.slice(1).map(row => {
          const rowData: any = {};
          row.forEach((cell, i) => {
            rowData[exhibitionHeaders[i]] = cell;
          });
          return rowData;
        });
  
        const cleanedRows = exhibitionRows.filter((el) => el?.exhibitionArtist)
  
        const parsedExhibition = await parseExcelExhibitionData(cleanedRows);
  
        if (!parsedExhibition) {
          setLoading(false);
          setSuccess(false);
          handleClose();
          return;
        }
  
        const rawExhibition = await createExhibitionAPI();
  
        if (!rawExhibition || !rawExhibition.exhibitionId) {
          setLoading(false);
          setSuccess(false);
          handleClose();
          return;
        }
  
        const exhibitionResults = await editExhibitionAPI({exhibition: {...rawExhibition, ...parsedExhibition}})
  
        // First row is headers
        const artworksHeaders: string[] = artworksData[0];
        const artworksRows: any[] = artworksData.slice(1).map(row => {
          const rowData: any = {};
          row.forEach((cell, i) => {
            rowData[artworksHeaders[i]] = cell;
          });
          return rowData;
        });

        const cleanedArtworks = artworksRows.filter((el) => el?.artworkTitle)
  
  
        let artworkResults;
        if (exhibitionResults && exhibitionResults.exhibitionId) {
          const artworks = await parseExcelArtworkData({rows: cleanedArtworks, exhibitionId: exhibitionResults?.exhibitionId});
          if (artworks) {
            artworkResults = await handleBatchArtworkUpload({
              artworks, 
              exhibitionId: exhibitionResults?.exhibitionId, 
              galleryId, 
              exhibition: exhibitionResults})
          }
        }
        
        if (exhibitionResults) {
          updateExhibitions({...exhibitionResults, artworks: artworkResults });
        }
        setLoading(false);
        setSuccess(true);
        handleClose();
      };
      reader.readAsArrayBuffer(file);
    } catch(error){
      // console.log(error)
    }
 
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
        }}
        >
        <Typography sx={{fontWeight: 'bold', fontSize: '0.8rem'}}>
          Upload Exhibition From .xls File
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
            <Typography variant="h4">Upload</Typography>
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
