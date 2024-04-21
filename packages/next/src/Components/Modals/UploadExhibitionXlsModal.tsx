

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

import {parseExcelExhibitionData} from '../../common/nextFunctions';

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
  setExhibition: (exhibition: Exhibition) => void;
}

export function UploadExhibitionXlsModal({
  setExhibition,
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
      const results = parseExcelExhibitionData(rows);

      if (results) {
        setExhibition(results);
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
