import {Exhibition, ExhibitionPreview} from '@darta-types';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const URL = `${process.env.EXPO_PUBLIC_API_URL}exhibition`;

export async function readExhibition({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<Exhibition | any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();

    const {data} = await axios.get(`${URL}/readForUser`, {
      params: {
        exhibitionId
    }, 
    headers: {authorization: `Bearer ${idToken}`}
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readExhibition'})
    return {};
  }
}

export async function readMostRecentGalleryExhibitionForUser({locationId} : {locationId: string}): Promise<Exhibition | any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/readMostRecentGalleryExhibitionForUser`, {
      params: {
        locationId
  }, headers: {authorization: `Bearer ${idToken}`}
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readMostRecentGalleryExhibitionForUser'})
    return {};
  }
}

// listAllExhibitionsForUser

export async function listAllExhibitionsPreviewsForUser({
  limit,
}: {
  limit: number;
}): Promise<{[key: string] : ExhibitionPreview}> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/listAllExhibitionsPreviewsForUser`, {
      params: {
        limit
    }, headers: {authorization: `Bearer ${idToken}`}
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listAllExhibitionsPreviewsForUser'})
    return {};
  }
}