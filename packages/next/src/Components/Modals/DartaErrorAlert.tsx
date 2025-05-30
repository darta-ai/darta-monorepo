import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

export function DartaErrorAlert({
  errorAlertOpen,
  setErrorAlertOpen,
}: {
  errorAlertOpen: boolean;
  setErrorAlertOpen: (arg0: boolean) => void;
}) {
  return (
    <Box sx={{width: '100%'}}>
      <Snackbar
        open={errorAlertOpen}
        autoHideDuration={6000}
        message="Note archived">
        <Collapse in={errorAlertOpen}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorAlertOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{mb: 2}}>
            <AlertTitle>Oops!</AlertTitle>
            Something went wrong, please try refreshing and then attempt again
          </Alert>
        </Collapse>
      </Snackbar>
    </Box>
  );
}
