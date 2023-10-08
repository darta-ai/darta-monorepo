import {Exhibition} from '@darta-types';
import axios from 'axios';

const URL = `${process.env.EXPO_PUBLIC_API_URL}exhibition`;

export async function readExhibition({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.get(`${URL}/readForUser`, {
      params: {
        exhibitionId
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}

export async function readMostRecentGalleryExhibitionForUser({locationId} : {locationId: string}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.get(`${URL}/readMostRecentGalleryExhibitionForUser`, {
      params: {
        locationId
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}

// listAllExhibitionsForUser

export async function listAllExhibitionsPreviewsForUser({
  limit,
}: {
  limit: number;
}): Promise<any> {
  try {
    const {data} = await axios.get(`${URL}/listAllExhibitionsPreviewsForUser`, {
      params: {
        limit
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}