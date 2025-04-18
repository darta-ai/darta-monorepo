import {Exhibition, ExhibitionPreview} from '@darta-types';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { generateHeaders } from './utls';

const URL = `${process.env.EXPO_PUBLIC_API_URL}exhibition`;

export async function readExhibition({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<Exhibition | any> {
  try {
    const headers = await generateHeaders();

    const {data} = await axios.get(`${URL}/readForUser`, {
      params: {
        exhibitionId
    }, 
    headers
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readExhibition'})
    return {};
  }
}

export async function readMostRecentGalleryExhibitionForUser({locationId} : {locationId: string}): Promise<Exhibition | any> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/readMostRecentGalleryExhibitionForUser`, {
      params: {
        locationId
  }, headers
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
  const headers = await generateHeaders();
  try {
    const {data} = await axios.get(`${URL}/listAllExhibitionsPreviewsForUser`, {
      params: {
        limit
    }, headers
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
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/listExhibitionsPreviewsCurrentForUserByLimit`, {
      params: {
        limit
    }, headers
  });
    return data;
  } catch (error:any) {
    console.log(error.message)
    console.log({error: error, message: error.message, where: 'listExhibitionPreviewsCurrent'})
    return {};
  }
} 
  export async function listExhibitionPreviewsForthcoming({
    limit,
  }: {
    limit: number;
  }): Promise<{[key: string] : ExhibitionPreview}> {
    try {
      const headers = await generateHeaders();
      const {data} = await axios.get(`${URL}/listExhibitionsPreviewsForthcomingForUserByLimit`, {
        params: {
          limit
      }, headers
    });
      return data;
    } catch (error:any) {
      console.log({error: error, message: error.message, where: 'listExhibitionPreviewsForthcoming'})
      return {};
    }
}

export async function listExhibitionPreviewUserFollowing({
  limit,
}: {
  limit: number;
}): Promise<{[key: string] : ExhibitionPreview}> {
  try {
    const headers = await generateHeaders();
    if(auth().currentUser === null) throw new Error('User is not logged in')
    const uid = auth().currentUser?.uid
    const {data} = await axios.get(`${URL}/listExhibitionsPreviewsUserFollowingForUserByLimit`, {
      params: {
        limit, uid
    }, headers
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listExhibitionPreviewUserFollowing'})
    return {};
  }
}


export async function listExhibitionPreviewUpcomingUserFollowing({
  limit,
}: {
  limit: number;
}): Promise<{[key: string] : ExhibitionPreview}> {
  try {
    const headers = await generateHeaders();
    if(auth().currentUser === null) throw new Error('User is not logged in')
    const uid = auth().currentUser?.uid
    const {data} = await axios.get(`${URL}/listExhibitionsPreviewsForthcomingGalleryFollowingForUserByLimit`, {
      params: {
        limit, uid
    }, headers
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listExhibitionPreviewUpcomingUserFollowing'})
    return {};
  }
}


export const setUserViewedExhibition = async ({exhibitionId}: {exhibitionId: string}): Promise<boolean> => {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/userViewedExhibition`, { exhibitionId }, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'setUserViewedExhibition'})
    return false;
  }
}

export const getUnViewedExhibitionsForUser = async (): Promise<{[key: string] : string[]} | void> => {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/getUnViewedExhibitionsForUser`, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'getUnViewedExhibitionsForUser'})
    return;
  }
}


export const addExhibitionToUserSaved = async ({exhibitionId}: {exhibitionId: string}): Promise<boolean> => {  
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/addExhibitionToUserSaved`, { exhibitionId }, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'addExhibitionToUserSaved'})
    return false;
  }
}

export const removeExhibitionFromUserSaved = async ({exhibitionId}: {exhibitionId: string}): Promise<boolean> => {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/removeExhibitionFromUserSaved`, { exhibitionId }, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'removeExhibitionFromUserSaved'})
    return false;
  }
}

export const listExhibitionForUserSavedCurrent = async (): Promise<Array<string>> => {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/listExhibitionForUserSavedCurrent`, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'getUnViewedExhibitionsForUser'})
    return [];
  }
}

export const dartaUserExhibitionRating = async ({exhibitionId, rating}: {exhibitionId: string, rating: string}): Promise<boolean> => {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/dartaUserExhibitionRating`, { exhibitionId, rating }, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'dartaUserExhibitionRating'})
    return false;
  }
}