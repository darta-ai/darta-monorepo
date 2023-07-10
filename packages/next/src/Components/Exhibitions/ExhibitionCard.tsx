import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

import {Exhibition} from '../../../globalTypes';
import {ExhibitionPressReleaseEdit} from './index';

const useStyles = {
  root: {
    minWidth: '85vw',
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '20vh',
    maxWidth: '70vw',
    margin: 'auto',
    border: '1px solid darkgrey',
  },
  media: {
    minHeight: '15vh',
    '@media (min-width: 800px)': {
      minHeight: '50vh',
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1vh',
    borderRadius: '0.5vw',
    m: '1vh',
    border: '1px solid #eaeaea',
    // minHeight: '50vh',
    alignItems: 'center',
    '@media (min-width: 800px)': {
      flexDirection: 'row',
      width: '85vw',
      minHeight: '15vh',
    },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '@media (min-width: 800px)': {
      flexDirection: 'column',
    },
  },
};

export function ExhibitionCard({
  exhibition,
  saveExhibition,
  galleryLocations,
  deleteExhibition,
}: {
  exhibition: Exhibition;
  saveExhibition: (arg0: string, arg1: Exhibition) => void;
  galleryLocations: string[];
  deleteExhibition: (arg0: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [editExhibition, setEditExhibition] = React.useState<boolean>(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSave = (savedExhibition: Exhibition) => {
    saveExhibition(savedExhibition.exhibitionId!, savedExhibition);
    setEditExhibition(!editExhibition);
  };

  const handleDelete = (exhibitionId: string) => {
    deleteExhibition(exhibitionId);
  };

  const displayRed =
    !exhibition?.exhibitionTitle?.value ||
    !exhibition?.exhibitionPrimaryImage?.value ||
    !exhibition?.exhibitionPressRelease?.value ||
    !exhibition?.exhibitionStartDate?.value ||
    !exhibition?.exhibitionEndDate?.value;

  let locations = galleryLocations;
  if (
    exhibition?.exhibitionLocation?.exhibitionLocationString?.value &&
    !galleryLocations.includes(
      exhibition?.exhibitionLocation?.exhibitionLocationString?.value,
    )
  ) {
    locations = [
      ...galleryLocations,
      exhibition?.exhibitionLocation?.exhibitionLocationString?.value,
    ];
  }
  return (
    <Card sx={useStyles.root} data-testid="exhibition-card">
      <Box
        sx={{
          ...useStyles.cardContainer,
          borderColor: displayRed ? 'orange' : null,
          borderWidth: displayRed ? '0.2vh' : null,
        }}>
        <Box sx={{width: '25vw'}}>
          <CardActionArea
            onClick={handleExpandClick}
            sx={{display: 'flex', flexDirection: 'column', maxHeight: '15vh'}}
            data-testid="exhibition-card-image">
            <img
              src={exhibition?.exhibitionPrimaryImage?.value as string}
              alt={exhibition?.exhibitionTitle?.value as string}
              style={useStyles.media}
            />
          </CardActionArea>
        </Box>
        <Box
          sx={{
            alignSelf: 'center',
            width: '35vw',
            textOverflow: 'ellipsis',
            textAlign: 'start',
          }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              data-testid="artwork-card-exhibition-title">
              {exhibition?.exhibitionTitle?.value}
            </Typography>
            {exhibition?.exhibitionStartDate?.value &&
              exhibition?.exhibitionEndDate?.value && (
                <Typography
                  data-testid="artwork-card-exhibition-dates"
                  variant="h6"
                  color="textSecondary">
                  {dayjs(exhibition?.exhibitionStartDate?.value).format(
                    'MM/DD/YYYY',
                  )}
                  {' - '}
                  {dayjs(exhibition?.exhibitionEndDate?.value).format(
                    'MM/DD/YYYY',
                  )}
                </Typography>
              )}
            <Typography
              paragraph
              data-testid="artwork-card-exhibition-location-string"
              color="textSecondary">
              {exhibition?.exhibitionLocation?.exhibitionLocationString?.value}
            </Typography>
          </CardContent>
        </Box>
        <CardContent sx={{alignSelf: 'center', width: '35vw'}}>
          {exhibition?.exhibitionPressRelease?.value && (
            <Typography paragraph>
              {exhibition?.exhibitionPressRelease?.value}
            </Typography>
          )}
        </CardContent>
      </Box>
      {displayRed && (
        <Typography
          data-testid="artwork-card-additional-information-warning"
          sx={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
          Additional Information Required. Please Edit.
        </Typography>
      )}
      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setEditExhibition(!editExhibition)}
          sx={{alignSelf: 'center', m: '1vh'}}>
          <Typography>Edit</Typography>
        </Button>
      </Box>
      <Collapse in={editExhibition}>
        {editExhibition ? (
          <Box>
            <ExhibitionPressReleaseEdit
              newExhibition={exhibition}
              saveExhibition={handleSave}
              cancelAction={setEditExhibition}
              handleDelete={handleDelete}
              galleryLocations={locations}
            />
          </Box>
        ) : (
          <Box />
        )}
      </Collapse>
    </Card>
  );
}
