import {Artwork} from '@darta-types';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

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
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/getDartaUserRecommendations`, {
      params: {
        uid,
        startNumber,
        endNumber,
  }, headers: {authorization: `Bearer ${idToken}`}});
  console.log(data)
    return data;
  } catch (error:any) {
    console.log(error.message)
    console.log({error: error, message: error.message, where: 'listExhibitionPinsByCity'})
    return {};
  }
}
