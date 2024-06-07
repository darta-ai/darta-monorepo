import axios from 'axios';
import { Exhibition, GalleryPreview, Images, MobileUser, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';

const URL = `${process.env.EXPO_PUBLIC_API_URL}users`;
import { generateHeaders, generateUid } from './utls';

export async function createUser({
    uid,
}: {
    uid: string;
}): Promise<any> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/createNewDartaUser`, {uid}, {headers});
    return data;
  } catch (error:any) {
    // console.log({error: error, message: error.message, where: 'createUser'})
    return {};
  }
}


export async function createUserArtworkEdge({
  uid,
  action
}: {
  uid: string;
  action: USER_ARTWORK_EDGE_RELATIONSHIP
}): Promise<any> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/createUserArtworkEdge`, {uid, action}, {headers});
    return data;
  } catch (error:any) {
    // console.log({error: error, message: error.message, where: 'createUserArtworkEdge'})
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
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/createDartaUserFollowGallery`, {
      uid,
      galleryId,
  }, {headers});
    return data;
  } catch (error:any) {
    throw new Error(error)
  }
}

export async function createUserVisitedGallery({
  galleryId,
  uid,
}: {
  galleryId: string;
  uid: string;
}): Promise<Exhibition | void> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/createUserVisitedGallery`, {
      uid,
      galleryId,
  }, {headers});
    return data;
  } catch (error:any) {
    throw new Error(error)
  }
}

export async function getDartaUser({uid} : {uid: string}): Promise<MobileUser | null> {
try {
  const headers = await generateHeaders();
  const {data} = await axios.get(`${URL}/getDartaUser`, {params: {uid}, headers});
  return data;
} catch (error:any) {
  // console.log({error})
  // console.log({error: error, message: error.message, where: 'getDartaUser'})
  return null;
}
}


export async function editDartaUserAccount({
  profilePicture,
  userName,
  legalFirstName,
  legalLastName,
  email,
  expoPushToken
}: {
  profilePicture?: Images
  userName?: string;
  legalFirstName?: string;
  legalLastName?: string;
  email?: string;
  expoPushToken?: string;
}): Promise<any> {
  try {
    const headers = await generateHeaders();
    const uid = await generateUid();
    const {data} = await axios.post(`${URL}/editDartaUser`, {
      profilePicture,
      userName,
      legalFirstName,
      legalLastName,
      email,
      uid, 
      expoPushToken
    }, {headers});
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
  const headers = await generateHeaders();
  try {
    const {data} = await axios.get(`${URL}/listDartaUserFollowsGallery`, {
      params: {
        uid
  }, headers});
    return data;
  } catch (error:any) {
    // console.log({error: error, message: error.message, where: 'listDartaUserFollowsGallery'})
    return {};
  }
}

export async function deleteDartaUser({
  uid,
}: {
  uid: string;
}): Promise<any> {
  const headers = await generateHeaders();
  try {
    const {data} = await axios.post(`${URL}/deleteDartaUser`, {uid}, {headers});
    return data;
  } catch (error:any) {
    // console.log({error: error, message: error.message})
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
    const headers = await generateHeaders();
    const {data} = await axios.post(`${URL}/deleteDartaUserFollowGallery`, {
      galleryId,
      uid
  }, {headers});
    return data;
  } catch (error:any) {
    // console.log({error: error, message: error.message, where: 'deleteDartaUserFollowGallery'})
    return {};
  }
}

export async function incrementUserGeneratedRoute(): Promise<Exhibition | any> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/incrementRouteGeneration`, {headers});
    return data;
  } catch (error:any) {
    // console.log({error: error, message: error.message, where: 'deleteDartaUserFollowGallery'})
    return {};
  }
}

