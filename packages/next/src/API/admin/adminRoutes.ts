import { ExhibitionPreviewAdmin} from '@darta-types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}admin`;

export async function listAllExhibitionsForAdmin(): Promise<ExhibitionPreviewAdmin[] | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.get(`${URL}/listAllExhibitionsForAdmin`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error: any) {
    // throw new Error(error.message);  
    return null
  }
}
