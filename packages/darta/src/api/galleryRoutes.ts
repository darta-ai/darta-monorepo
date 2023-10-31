import {Exhibition, GalleryPreview, IGalleryProfileData} from '@darta-types';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const URL = `${process.env.EXPO_PUBLIC_API_URL}gallery`;

export async function readGallery({
  galleryId,
}: {
  galleryId: string;
}): Promise<IGalleryProfileData | any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/galleryProfileForUser`, {
      params: {
        galleryId
  }, headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readGallery'})
    throw new Error(error.message);
  }
}



export async function listGalleryExhibitionPreviewForUser({
  galleryId,
}: {
  galleryId: string;
}): Promise<Exhibition | any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/listGalleryExhibitionPreviewForUser`, {
      params: {
        galleryId
      }, headers: {authorization: `Bearer ${idToken}`}});
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
    const idToken = await auth().currentUser?.getIdToken();

    const {data} = await axios.get(`${URL}/listDartaUserFollowsGallery`, {
      params: {
        uid
  }, headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listDartaUserFollowsGallery'})
    return {};
  }
}

export async function deleteDartaUserFollowGallery({
  galleryId,
  uid,
}: {
  galleryId: string;
  uid: string;
}): Promise<Exhibition | any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.post(`${URL}/deleteDartaUserFollowGallery`, {
      galleryId,
      uid
  }, {headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'deleteDartaUserFollowGallery'})
    return {};
  }
}