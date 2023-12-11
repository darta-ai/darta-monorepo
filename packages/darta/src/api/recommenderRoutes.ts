import {Artwork} from '@darta-types';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { generateHeaders } from './utls';

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
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/getDartaUserRecommendations`, {
      params: {
        uid,
        startNumber,
        endNumber,
  }, headers});
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
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/getRecommendationsRandomSampling`, {
      params: {
        uid,
        startNumber,
        endNumber,
        artworkIds
  }, headers});
    return data;
  } catch (error:any) {
    console.log(error.message)
    console.log({error: error, message: error.message, where: 'getRecommendationsRandomSampling'})
    return {};
  }
}
