/* eslint-disable no-underscore-dangle */
import { Artwork, Exhibition, GalleryBase } from '@darta-types';
import { Box, Button, Typography } from '@mui/material';
import { NextPageContext } from 'next'
import { useRouter } from 'next/router';
import * as React from 'react';

import { createExhibitionForAdmin, 
  getGalleryForAdmin, listGalleryExhibitionsForAdmin, updateExhibitionForAdmin } from '../../src/API/admin/adminRoutes';
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
    const emptyExhibition = await createExhibitionForAdmin({galleryId})
    if (!emptyExhibition) {
      return
    }
    const updatedExhibition = await updateExhibitionForAdmin({galleryId, exhibition: {...emptyExhibition, ...newExhibition}})
    if (!updatedExhibition) {
      return
    }
    const newExhibitionList = [updatedExhibition, ...(exhibitions ?? [])];
    setExhibitions(newExhibitionList)
  }

  const handleExhibitionEdit = async ({exhibition} : {exhibition: Exhibition}) => {
    await updateExhibitionForAdmin({galleryId, exhibition})
    
  }

  const handleBatchArtworkUpload = ({artworks, exhibitionId}: {artworks: {[key: string]: Artwork}, exhibitionId: string}) => {
    console.log({artworks, exhibitionId})
  }

  return (
    <Box sx={profileStyles.container}>
        <Box>
            <Typography variant='h2'>{gallery?.galleryName.value}</Typography>
            <Typography variant='h4'>Exhibitions</Typography>
        </Box>
        <Box sx={profileStyles.buttonContainer}>
            <UploadExhibitionXlsModal setExhibition={handleExhibitionUpload}/>
            <Button variant="contained">From Scratch</Button>
        </Box>
        <Box sx={profileStyles.newExhibitionContainer}>
            {exhibitions && 
                exhibitions.map((exhibition) => (
                    <>
                      <ExhibitionCard 
                      exhibition={exhibition}
                      galleryName={gallery?.galleryName.value!}
                      galleryLocations={galleryLocations!}
                      exhibitionId={exhibition._id as string}
                      isLatestExhibition={false}
                      higherLevelSaveExhibition={handleExhibitionEdit}
                      />
                      <UploadArtworksXlsModal exhibitionId={exhibition._id as string} handleBatchUpload={handleBatchArtworkUpload} />
                      </>
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