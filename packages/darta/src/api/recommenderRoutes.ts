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
    return data;
  } catch (error:any) {
    console.log(error.message)
    console.log({error: error, message: error.message, where: 'listArtworksToRate'})
    return {};
  }
}

export async function listArtworksToRateStatelessRandomSampling({
  uid,
  startNumber,
  endNumber,
  artworkIds,
}: {
  uid: string;
  startNumber: number;
  endNumber: number;
  artworkIds: string[];
}): Promise<{[key: string] : Artwork} | any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/getRecommendationsRandomSampling`, {
      params: {
        uid,
        startNumber,
        endNumber,
        artworkIds
  }, headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log(error.message)
    console.log({error: error, message: error.message, where: 'getRecommendationsRandomSampling'})
    return {};
  }
}
