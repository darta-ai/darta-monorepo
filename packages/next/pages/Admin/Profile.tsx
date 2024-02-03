import { ExhibitionPreviewAdmin } from '@darta-types';
import {Box} from '@mui/material';
import { NextPageContext } from 'next'
import { useRouter } from 'next/router';
import EnhancedTable from 'packages/next/src/Components/Admin/ExhibitionTable';
import React from 'react';

import { listAllExhibitionsForAdmin } from '../../src/API/admin/adminRoutes';
import authRequired from '../../src/common/AuthRequired/AuthRequired';

export enum EGalleryDisplay {
  Profile = 'PROFILE',
  Exhibitions = 'EXHIBITIONS',
  Artwork = 'ARTWORK',
  Load = 'LOAD',
}

const profileStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  width: '100%',
  height: '100vh',
  mt: 10,
};

// About component
function AdminProfile() {
  const router = useRouter();
  const [exhibitions, setExhibitions] = React.useState<ExhibitionPreviewAdmin[]>();

  React.useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await listAllExhibitionsForAdmin()
        if (!res) {
          router.push('/')
        }
        setExhibitions(res)
      }
      fetchData()
    } catch (error) {
      router.push('/')
    }
  }, [])
  
  return (
    <Box sx={profileStyles}>
      {exhibitions && (
        <EnhancedTable exhibitions={exhibitions} />
      )}
    </Box>
  );
}
 

export default authRequired(AdminProfile);
