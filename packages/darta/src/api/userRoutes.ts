import axios from 'axios';
import { Exhibition, GalleryPreview, Images, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';

const URL = `${process.env.EXPO_PUBLIC_API_URL}users`;

export async function createUser({
    uid,
}: {
    uid: string;
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/createNewDartaUser`, {uid});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'createUser'})
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
    const {data} = await axios.post(`${URL}/createUserArtworkEdge`, {uid, action});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'createUserArtworkEdge'})
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

export async function getDartaUser({uid} : {uid: string}): Promise<any> {
try {
  const {data} = await axios.get(`${URL}/getDartaUser`, {params: {uid}});
  return data;
} catch (error:any) {
  console.log({error})
  console.log({error: error, message: error.message, where: 'getDartaUser'})
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
}: {
  profilePicture?: Images
  userName?: string;
  legalFirstName?: string;
  legalLastName?: string;
  email?: string;
  uid?: string;
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/editDartaUser`, {profilePicture,
      userName,
      legalFirstName,
      legalLastName,
      email,
      uid});
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
  uid,
}: {
  uid: string;
}): Promise<any> {
  try {
    const {data} = await axios.post(`${URL}/deleteDartaUser`, {uid});
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