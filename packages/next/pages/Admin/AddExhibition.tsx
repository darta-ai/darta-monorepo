import { Box } from '@mui/material';
import { NextPageContext } from 'next'
import { useRouter } from 'next/router';
import { listAllExhibitionsForAdmin } from 'packages/next/src/API/admin/adminRoutes';
import * as React from 'react';

// component that displays hi but also has getInitialProps set up 
export default function AddExhibition(galId: {galleryId: string}) {
    const {galleryId} = galId;
    const router = useRouter();


  React.useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await listAllExhibitionsForAdmin()
        if (!res) {
          return router.push('/')
        }
        // return setExhibitions(res)
      }
      fetchData()
    } catch (error) {
      router.push('/')
    }
  }, [])
  return (
    <Box>
        <h1>Hi</h1>
        <h2>{galleryId}</h2>
    </Box>
  )
}

// getInitialProps for the page
AddExhibition.getInitialProps = async (ctx: NextPageContext) => {

    const { galleryId } = ctx.query;
    // console.log({galleryId})
    return {galId : galleryId};
}