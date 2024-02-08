import { Exhibition, ExhibitionPreviewAdmin, GalleryBase} from '@darta-types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}admin`;

export async function listAllExhibitionsForAdmin(): Promise<ExhibitionPreviewAdmin[] | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.get(`${URL}/listAllExhibitionsForAdmin`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error: any) {
    // throw new Error(error.message);  
    return null
  }
}

export async function listGalleryExhibitionsForAdmin({galleryId} : {galleryId: string}): Promise<Exhibition[] | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.get(`${URL}/listGalleryExhibitionsForAdmin`, {
      params: {galleryId},
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error: any) {
    // console.log({error})
    // throw new Error(error.message);  
    return null
  }
}

export async function updateExhibitionForAdmin({galleryId, exhibition} : {galleryId: string, exhibition: Exhibition}): Promise<Exhibition | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(`${URL}/updateExhibitionForAdmin`, {
      galleryId,
      exhibition
    }, {
      headers: {authorization: `Bearer ${idToken}`}
    });
    return response.data;
  } catch (error: any) {
    // throw new Error(error.message);  
    return null
  }
}

export async function getGalleryForAdmin({galleryId} : {galleryId: string}): Promise<GalleryBase | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.get(`${URL}/getGalleryForAdmin`, {
      params: {galleryId},
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error: any) {
    // throw new Error(error.message);  
    return null
  }
}

export async function createExhibitionForAdmin({galleryId} : {galleryId: string}): Promise<GalleryBase | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${URL}/createExhibitionForAdmin`,
      {galleryId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error: any) {
    // throw new Error(error.message);  
    return null
  }
}

