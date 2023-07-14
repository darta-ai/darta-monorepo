import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import _ from 'lodash';
import Image from 'next/image';
import React from 'react';

import {Artwork, Exhibition} from '../../../globalTypes';
import {PRIMARY_MILK} from '../../../styles';
import {cardStyles} from '../../../styles/CardStyles';
import {newArtworkShell} from '../../common/templates';
import {ArtworkHeader} from '../Artwork';
import {useAppState} from '../State/AppContext';
import {ExhibitionArtworkList} from './ExhibitionArtworkList';
import {CreateExhibition} from './index';

export function ExhibitionCard({
  exhibition,
  saveExhibition,
  galleryLocations,
  deleteExhibition,
  exhibitionId,
}: {
  exhibition: Exhibition;
  saveExhibition: (arg0: string, arg1: Exhibition) => void;
  galleryLocations: string[];
  deleteExhibition: (arg0: string) => void;
  exhibitionId: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [editExhibition, setEditExhibition] = React.useState<boolean>(false);
  const {state} = useAppState();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSave = (savedExhibition: Exhibition) => {
    saveExhibition(savedExhibition.exhibitionId!, savedExhibition);
    setEditExhibition(!editExhibition);
  };

  const handleDelete = (id: string) => {
    deleteExhibition(id);
  };

  const addNewArtwork = () => {
    const newArtwork: Artwork = _.cloneDeep(newArtworkShell);
    const newExhibition: Exhibition = _.cloneDeep(
      state?.galleryExhibitions[exhibitionId],
    );
    let exhibitionOrder;
    if (!newExhibition.artworks || !Object.keys(newExhibition?.artworks)) {
      exhibitionOrder = 0;
    } else {
      exhibitionOrder = Object.keys(newExhibition?.artworks)?.length;
    }
    newArtwork.artworkId = crypto.randomUUID();
    newArtwork.updatedAt = new Date().toISOString();
    newArtwork.createdAt = new Date().toISOString();
    newArtwork.exhibitionOrder = exhibitionOrder;
    newExhibition.artworks = {
      ...newExhibition.artworks,
      [newArtwork.artworkId]: newArtwork as any,
    };
    saveExhibition(exhibitionId, newExhibition);
  };

  const handleBatchUpload = (uploadArtworks: {[key: string]: Artwork}) => {
    // setArtworks({...artworks, ...uploadArtworks});
    const newExhibition: Exhibition = _.cloneDeep(
      state?.galleryExhibitions[exhibitionId],
    );

    if (!newExhibition || !newExhibition?.artworks) return;

    let counter: number = Object.keys(newExhibition?.artworks).length;

    for (const artworkId in uploadArtworks) {
      if (uploadArtworks[artworkId]) {
        // eslint-disable-next-line no-param-reassign
        uploadArtworks[artworkId].exhibitionOrder = counter++;
      }
    }

    newExhibition.artworks = {
      ...newExhibition.artworks,
      ...(uploadArtworks as any),
    };

    saveExhibition(exhibitionId, newExhibition);
  };

  const displayRed =
    !exhibition?.exhibitionTitle?.value ||
    !exhibition?.exhibitionPrimaryImage?.value ||
    !exhibition?.exhibitionPressRelease?.value ||
    !exhibition?.exhibitionDates?.exhibitionStartDate?.value ||
    !exhibition?.exhibitionDates?.exhibitionEndDate?.value;

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
  } else {
    locations = ['edit profile to add gallery locations'];
  }
  return (
    <Card sx={cardStyles.root} data-testid="exhibition-card">
      {displayRed ? (
        <Box
          sx={{
            ...cardStyles.cardContainer,
            borderColor: 'orange',
            borderWidth: '0.2vh',
            justifyContent: 'center',
          }}>
          <Typography
            data-testid="artwork-card-additional-information-warning"
            sx={{textAlign: 'center', color: 'red', fontWeight: 'bold'}}>
            Additional Information Required. Please Edit.
          </Typography>
        </Box>
      ) : (
        <Box sx={cardStyles.cardContainer}>
          <Box sx={{width: '35vw', m: 1}}>
            <Box
              onClick={handleExpandClick}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '15vh',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}
              data-testid="exhibition-card-image">
              <Box>
                <Image
                  width={100}
                  height={100}
                  src={exhibition?.exhibitionPrimaryImage?.value as string}
                  alt={exhibition?.exhibitionTitle?.value as string}
                  style={cardStyles.media}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={cardStyles.informationContainer}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                data-testid="artwork-card-exhibition-title">
                {exhibition?.exhibitionTitle?.value}
              </Typography>
              {exhibition?.exhibitionDates?.exhibitionStartDate?.value &&
                exhibition?.exhibitionDates?.exhibitionEndDate?.value && (
                  <Typography
                    data-testid="artwork-card-exhibition-dates"
                    variant="h6"
                    color="textSecondary">
                    {dayjs(
                      exhibition?.exhibitionDates?.exhibitionStartDate?.value,
                    ).format('MM/DD/YYYY')}
                    {' - '}
                    {dayjs(
                      exhibition?.exhibitionDates?.exhibitionEndDate?.value,
                    ).format('MM/DD/YYYY')}
                  </Typography>
                )}
              <Typography
                paragraph
                data-testid="artwork-card-exhibition-location-string"
                color="textSecondary">
                {
                  exhibition?.exhibitionLocation?.exhibitionLocationString
                    ?.value
                }
              </Typography>
            </CardContent>
          </Box>
          <Box sx={cardStyles.informationContainer}>
            <CardContent sx={{alignSelf: 'center', width: '35vw'}}>
              {exhibition?.exhibitionPressRelease?.value && (
                <Typography paragraph>
                  {exhibition?.exhibitionPressRelease?.value}
                </Typography>
              )}
            </CardContent>
          </Box>
        </Box>
      )}
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Button
            variant="contained"
            color={displayRed ? 'warning' : 'secondary'}
            onClick={() => setEditExhibition(!editExhibition)}
            sx={{alignSelf: 'center', m: '1vh'}}>
            <Typography sx={{fontWeight: 'bold', color: PRIMARY_MILK}}>
              Edit Exhibition
            </Typography>
          </Button>
        </Box>
        <Box>
          <Divider variant="middle" sx={{m: 2}} flexItem>
            Artworks
          </Divider>
          <ArtworkHeader
            addNewArtwork={addNewArtwork}
            handleBatchUpload={handleBatchUpload}
          />
        </Box>
        <Collapse in={editExhibition}>
          {editExhibition ? (
            <Box>
              <CreateExhibition
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
        <ExhibitionArtworkList
          artworks={exhibition.artworks}
          saveExhibition={saveExhibition}
          exhibitionId={exhibitionId}
        />
      </Box>
    </Card>
  );
}
