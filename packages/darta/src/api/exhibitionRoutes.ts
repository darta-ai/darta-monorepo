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
/**
 * @deprecated This function will be removed when all apps are updated
 */
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
export async function listExhibitionPreviewsCurrent({
  limit,
}: {
  limit: number;
}): Promise<{[key: string] : ExhibitionPreview}> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/listExhibitionsPreviewsCurrentForUserByLimit`, {
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
  export async function listExhibitionPreviewsForthcoming({
    limit,
  }: {
    limit: number;
  }): Promise<{[key: string] : ExhibitionPreview}> {
    try {
      const idToken = await auth().currentUser?.getIdToken();
      const {data} = await axios.get(`${URL}/listExhibitionsPreviewsForthcomingForUserByLimit`, {
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

export async function listExhibitionPreviewUserFollowing({
  limit,
}: {
  limit: number;
}): Promise<{[key: string] : ExhibitionPreview}> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    if(auth().currentUser === null) throw new Error('User is not logged in')
    const uid = auth().currentUser?.uid
    const {data} = await axios.get(`${URL}/listExhibitionsPreviewsUserFollowingForUserByLimit`, {
      params: {
        limit, uid
    }, headers: {authorization: `Bearer ${idToken}`}
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listAllExhibitionsPreviewsForUser'})
    return {};
  }
}