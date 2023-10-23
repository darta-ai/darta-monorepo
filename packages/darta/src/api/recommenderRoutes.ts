import {Artwork} from '@darta-types';
import axios from 'axios';

const URL = `${process.env.EXPO_PUBLIC_API_URL}recommendations`;

export async function listArtworksToRate({
  uid,
  startNumber,
  endNumber,
}: {
  uid: string;
  startNumber: number;
  endNumber: number;
}): Promise<{[key: string] : Artwork} | any> {
  try {
    const {data} = await axios.get(`${URL}/getDartaUserRecommendations`, {
      params: {
        uid,
        startNumber,
        endNumber,
  }});
    return data;
  } catch (error:any) {
    console.log(error.message)
    console.log({error: error, message: error.message, where: 'listExhibitionPinsByCity'})
    return {};
  }
}
