import {Artwork} from '@darta-types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}admin`;

export async function getAllExhibitions(): Promise<Artwork> {
  const idToken = await auth.currentUser?.getIdToken();
  try {
    const response = await axios.get(`${URL}/create`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error) {
    throw new Error('Unable to create artwork');
  }
}
