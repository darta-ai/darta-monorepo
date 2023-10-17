import axios from 'axios';
import { Exhibition, GalleryPreview, Images, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_UID_KEY } from '../utils/constants';

const URL = `${process.env.EXPO_PUBLIC_API_URL}users`;

export async function createUser({
    localStorageUid,
}: {
    localStorageUid: string;
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/createNewDartaUser`, {localStorageUid});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}


export async function createUserArtworkEdge({
  localStorageUid,
  action
}: {
  localStorageUid: string;
  action: USER_ARTWORK_EDGE_RELATIONSHIP
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/createUserArtworkEdge`, {localStorageUid, action});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return error.message;
  }
}


export async function createDartaUserFollowGallery({
  galleryId,
  uid,
}: {
  galleryId: string;
  uid: string;
}): Promise<Exhibition | void> {
  try {
    const {data} = await axios.post(`${URL}/createDartaUserFollowGallery`, {
      uid,
      galleryId,
  });
    return data;
  } catch (error:any) {
    throw new Error(error)
  }
}

export async function getDartaUser(): Promise<any> {
try {
  const localStorageUid = await AsyncStorage.getItem(USER_UID_KEY);
  const {data} = await axios.get(`${URL}/getDartaUser`, {params: {localStorageUid}});
  return data;
} catch (error:any) {
  console.log({error: error, message: error.message})
  return {};
}
}


export async function editDartaUserAccount({
  profilePicture,
  userName,
  legalFirstName,
  legalLastName,
  email,
  uid,
  localStorageUid,
}: {
  profilePicture?: Images
  userName?: string;
  legalFirstName?: string;
  legalLastName?: string;
  email?: string;
  uid?: string;
  localStorageUid: string;
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/editDartaUser`, {profilePicture,
      userName,
      legalFirstName,
      legalLastName,
      uid,
      email,
      localStorageUid});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return error.message;
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

export async function deleteDartaUser({
  localStorageUid,
}: {
  localStorageUid: string;
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/deleteDartaUser`, {localStorageUid});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return error.message;
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
    const {data} = await axios.post(`${URL}/deleteDartaUserFollowGallery`, {
      galleryId,
      uid
  });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'deleteDartaUserFollowGallery'})
    return {};
  }
}