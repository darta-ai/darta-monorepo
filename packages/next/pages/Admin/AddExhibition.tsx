/* eslint-disable no-underscore-dangle */
import { Artwork, Exhibition, GalleryBase } from '@darta-types';
import { Box, Button, Typography } from '@mui/material';
import _ from 'lodash';
import { NextPageContext } from 'next'
import { useRouter } from 'next/router';
import * as React from 'react';

import { 
  createExhibitionArtworkForAdmin, 
  createExhibitionForAdmin, 
  deleteExhibitionArtworkForAdmin,
  deleteExhibitionForAdmin,
  editExhibitionArtworkForAdmin, 
  getGalleryForAdmin, 
  listGalleryExhibitionsForAdmin, 
  publishExhibitionForAdmin, 
  reOrderExhibitionArtworkForAdmin, 
  updateExhibitionForAdmin} from '../../src/API/admin/adminRoutes';
import { ExhibitionCard } from '../../src/Components/Exhibitions';
import { UploadArtworksXlsModal } from '../../src/Components/Modals';
import { UploadExhibitionXlsModal } from '../../src/Components/Modals/UploadExhibitionXlsModal';

const profileStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'flex-start',   
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        mt: 10,
    },
    buttonContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: '10vh',
        marginTop: 10
    },
    newExhibitionContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'flex-start',   
        alignSelf: 'center',
        width: '100%',
        minHeight: '100vh',
        mt: 10,
    }
  };

// component that displays hi but also has getInitialProps set up 
export default function AddExhibition({ galleryId }: { galleryId: string }) {
    // const { galId } = galId;
    const router = useRouter();
    // eslint-disable-next-line react/destructuring-assignment
    // const [galId, setGalleryId] = React.useState<string>(galleryId)
    const [gallery, setGallery] = React.useState<GalleryBase>();
    const [exhibitions, setExhibitions] = React.useState<Exhibition[]>();
    const [galleryLocations, setGalleryLocations] = React.useState<string[]>()


  React.useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await getGalleryForAdmin({galleryId})
        if (!res) {
          return router.push('/')
        }
        const galLocations = Object.values(res).map((location) => location.locationString?.value).filter((location) => location !== undefined)
        setGalleryLocations(galLocations)
        const allExhibitions = await listGalleryExhibitionsForAdmin({galleryId})
        if (!allExhibitions) {
          return null
        }
        setExhibitions(allExhibitions)
        return setGallery(res)
      }
      fetchData()
    } catch (error) {
      router.push('/')
    }
  }, [])

  const handleExhibitionUpload = async (newExhibition: Exhibition) => {
    const emptyExhibition = await createExhibitionForAdmin({galleryId});
    if (!emptyExhibition) {
      return;
    }
    const updatedExhibition = await updateExhibitionForAdmin({
      galleryId,
      exhibition: { ...emptyExhibition, ...newExhibition },
    });
    if (!updatedExhibition) {
      return;
    }
  
    // Assuming each exhibition has a unique 'id' you can use to check for duplicates
    const isDuplicate = exhibitions?.some(exhibition => exhibition._id === updatedExhibition._id);
  
    if (!isDuplicate) {
      const newExhibitionList = [updatedExhibition, ...(exhibitions ?? [])];
      setExhibitions(newExhibitionList);
    } else if (exhibitions) {
      // Optionally, handle the duplicate case, such as updating the existing exhibition in your state
      const updatedExhibitions = exhibitions.map(exhibition =>
        exhibition._id === updatedExhibition._id ? updatedExhibition : exhibition
      );
      setExhibitions(updatedExhibitions);
    }
  };
  

  const handleExhibitionEdit = async ({exhibition} : {exhibition: Exhibition}) => {
    const res = await updateExhibitionForAdmin({galleryId, exhibition});
    if (!res) return;
  
    // Assuming each exhibition has a unique identifier, such as 'id'.
    // Replace the existing exhibition in the list with the updated one.
    if (!exhibitions) return;
    const updatedExhibitionList = exhibitions.map(existingExhibition => 
      existingExhibition._id === res._id ? res : existingExhibition
    );
  
    setExhibitions(updatedExhibitionList);
  };
  

  const handleBatchArtworkUpload = async ({artworks, exhibitionId}: {artworks: Artwork[], exhibitionId: string}) => {
    try{ 
      const results = [];
      for (const artwork of artworks) {
        // eslint-disable-next-line no-await-in-loop
        const initialArtwork = await createExhibitionArtworkForAdmin({ galleryId, exhibitionId });
        if (!initialArtwork) {
          results.push(null); // or continue; if you want to skip this iteration
        }
        const art = { ...initialArtwork, ...artwork };
        // eslint-disable-next-line no-await-in-loop
        const result = await editExhibitionArtworkForAdmin({ artwork: art });
        results.push(result);
      }
    
      const newExhibition = exhibitions?.find((exhibition) => exhibition._id === exhibitionId);
      if (!newExhibition || results.some((result) => !result)) {
        return;
      }
      const newArtworks = results.reduce<{ [key: string]: Artwork }>((obj, artwork) => {
        if (!artwork || !artwork._key) { // Also checks if _id is truthy
          return obj;
        }
        // eslint-disable-next-line no-param-reassign
        obj[artwork?._key] = artwork;
        return obj;
      }, {});
      newExhibition.artworks = {
        ...newExhibition.artworks,
        ...newArtworks,
      }
      const newExhibitions = exhibitions?.map((exhibition) => {
        if (exhibition._id === exhibitionId){
          return newExhibition;
        }
        return exhibition;
      })
      setExhibitions(newExhibitions)
    } catch(error: any) {
      throw new Error(error.message)
    }
  }

  const handleArtworkSave = async ({artwork}: {artwork: Artwork}) => {
    const res = await editExhibitionArtworkForAdmin({artwork});
    if (!res) return;
  
    const updatedExhibitions = exhibitions?.map(exhibition => {
      if (exhibition._id !== res.exhibitionId) {
        return exhibition; // Return the exhibition unchanged if it's not the one being updated
      }
      
      // Create a new updated exhibition object
      const updatedExhibition = {
        ...exhibition,
        artworks: {
          ...exhibition.artworks,
          [res._key as string]: res, // Update the specific artwork within the artworks object
        },
      };
        
      return updatedExhibition;
    });
  
    setExhibitions(updatedExhibitions);
  };

  const handleDeleteArtwork = async ({exhibitionId, artworkId}: {exhibitionId: string, artworkId: string}) => {
    try {
      const results = await deleteExhibitionArtworkForAdmin({exhibitionId, artworkId});
      if (!results) return;
      const updatedExhibitions = exhibitions?.map((exhibition) => {
        if (exhibition._id === exhibitionId){
          return results;
        }
        return exhibition;
      });
      if (!updatedExhibitions) return;
      setExhibitions(updatedExhibitions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  const handleNewArtworkCreate = async ({exhibitionId}: {exhibitionId: string}) => {
     const res = await createExhibitionArtworkForAdmin({galleryId, exhibitionId});
      if (!res) return;
      const newExhibitions = exhibitions?.map((exhibition) => {
        if (exhibition._id === exhibitionId){
          // eslint-disable-next-line no-param-reassign
          exhibition.artworks = {...exhibition.artworks, [res._key as string]: res};
        }
        return exhibition
      });
      if (!newExhibitions) return;
      setExhibitions(newExhibitions);
  }

  const handleExhibitionOrderEdit = async ({
    exhibitionId,
    artworkId,
    direction,
  }: {
    exhibitionId: string;
    artworkId: string;
    direction: 'up' | 'down';
  }) => {
    const exhibition = exhibitions?.find((exhibit) => exhibit._id === exhibitionId);

    if (!exhibition) return;
    
    const tempArtworks = _.cloneDeep(
      exhibition?.artworks as {[key: string]: Artwork},
    );
    if (!tempArtworks) return;
    if (!tempArtworks[artworkId]) return;
    const currentIndex = tempArtworks[artworkId].exhibitionOrder;



    if (currentIndex === undefined || currentIndex === null) return;

    const desiredIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (!currentIndex && currentIndex !== 0) {
      throw new Error('oops');
    }

    try {
      const results = await reOrderExhibitionArtworkForAdmin({
        exhibitionId,
        artworkId,
        desiredIndex,
        currentIndex,
      });

      if (!results) return;

      const updatedExhibitions = exhibitions?.map((exhibit) => {
        if(exhibit._id === exhibitionId){
          // eslint-disable-next-line no-param-reassign
          exhibit.artworks = results;
        }
        return exhibit;
       })
      setExhibitions(updatedExhibitions);

    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleExhibitionDelete = async ({exhibitionId}: {exhibitionId: string}) => {
    await deleteExhibitionForAdmin({exhibitionId, galleryId});
    const updatedExhibitions = exhibitions?.filter((exhibition) => exhibition._key !== exhibitionId);
    setExhibitions(updatedExhibitions);
  }

  const handleExhibitionPublish = async ({exhibitionId}: {exhibitionId: string}) => {
    const exhibition = exhibitions?.find((exhibit) => exhibit._id === exhibitionId);
    if (!exhibition) return;
    const isPublished = !exhibition.published;
    const res = await publishExhibitionForAdmin({galleryId, exhibitionId, isPublished});
    if (!res) return;
    const updatedExhibitions = exhibitions?.map((exhibit) => {
      if (exhibit._id === exhibitionId){
        return res;
      }
      return exhibit;
    });
    setExhibitions(updatedExhibitions);
  }

  const handleExhibitionCreate = async () => {
    const emptyExhibition = await createExhibitionForAdmin({galleryId});
    if (!emptyExhibition) {
      return;
    }
    const isDuplicate = exhibitions?.some((exhibition) => exhibition._id === emptyExhibition._id);
    if (!isDuplicate) {
      const newExhibitionList = [emptyExhibition, ...(exhibitions ?? [])];
      setExhibitions(newExhibitionList);
    } else if (exhibitions) {
      const updatedExhibitions = exhibitions.map((exhibition) =>
        exhibition._id === emptyExhibition._id ? emptyExhibition : exhibition
      );
      setExhibitions(updatedExhibitions);
    }
  }

  return (
    <Box sx={profileStyles.container}>
        <Box>
            <Typography variant='h2'>{gallery?.galleryName.value}</Typography>
            <Typography variant='h4'>Exhibitions</Typography>
        </Box>
        <Box sx={profileStyles.buttonContainer}>
            <UploadExhibitionXlsModal setExhibition={handleExhibitionUpload}/>
            <Button variant="contained" onClick={handleExhibitionCreate}>From Scratch</Button>
        </Box>
        <Box sx={profileStyles.newExhibitionContainer}>
            {exhibitions && 
                exhibitions.map((exhibition) => (
                    <Box key={exhibition._key}>
                      <ExhibitionCard 
                      exhibition={exhibition}
                      galleryName={gallery?.galleryName.value!}
                      galleryLocations={galleryLocations!}
                      exhibitionId={exhibition._id as string}
                      isLatestExhibition={false}
                      higherLevelSaveExhibition={handleExhibitionEdit}
                      higherLevelSaveArtwork={handleArtworkSave}
                      higherLevelCreateArtwork={handleNewArtworkCreate}
                      higherLevelReOrderArtwork={handleExhibitionOrderEdit}
                      higherLevelDeleteArtwork={handleDeleteArtwork}
                      higherLevelDeleteExhibition={handleExhibitionDelete}
                      higherLevelPublishExhibition={handleExhibitionPublish}
                      />
                      <UploadArtworksXlsModal exhibitionId={exhibition._id as string} handleBatchUpload={handleBatchArtworkUpload} />
                      </ Box>
                    ))
          }
        </Box>
    </Box>
  )
}

// getInitialProps for the page
AddExhibition.getInitialProps = async (ctx: NextPageContext) => {

    const { galleryId } = ctx.query;
    // console.log({galleryId})
    return {galleryId};
}