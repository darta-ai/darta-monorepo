import {Exhibition} from '@darta-types';
import axios from 'axios';

// const URL = `${process.env.EXPO_PUBLIC_API_URL}exhibition`;

const URL = 'http://localhost:1160/gallery'

export async function readGallery({
  galleryId,
}: {
  galleryId: string;
}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.get(`${URL}/galleryProfileForUser`, {
      params: {
        galleryId
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}

export async function listGalleryExhibitionPreviewForUser({
  galleryId,
}: {
  galleryId: string;
}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.get(`${URL}/listGalleryExhibitionPreviewForUser`, {
      params: {
        galleryId
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}