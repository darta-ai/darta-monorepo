import {Exhibition, GalleryPreview, IGalleryProfileData} from '@darta-types';
import axios from 'axios';

const URL = `${process.env.EXPO_PUBLIC_API_URL}gallery`;

export async function readGallery({
  galleryId,
}: {
  galleryId: string;
}): Promise<IGalleryProfileData | any> {
  try {
    const {data} = await axios.get(`${URL}/galleryProfileForUser`, {
      params: {
        galleryId
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readGallery'})
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
    console.log({error: error, message: error.message, where: 'listGalleryExhibitionPreviewForUser'})
    return {};
  }
}

export async function listDartaUserFollowsGallery({
  uid,
}: {
  uid: string;
}): Promise<GalleryPreview | any> {
  try {
    const {data} = await axios.get(`${URL}/listDartaUserFollowsGallery`, {
      params: {
        uid
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listDartaUserFollowsGallery'})
    return {};
  }
}

export async function deleteDartaUserFollowGallery({
  galleryId,
  localStorageUid,
}: {
  galleryId: string;
  localStorageUid: string;
}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.post(`${URL}/deleteDartaUserFollowGallery`, {
      galleryId,
      localStorageUid
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'deleteDartaUserFollowGallery'})
    return {};
  }
}