import { Artwork, Exhibition, ExhibitionPreviewAdmin, GalleryBase} from '@darta-types';
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
    throw new Error(error.message);  
  }
}

export async function createExhibitionForAdmin({galleryId} : {galleryId: string}): Promise<Exhibition | null> {
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

export async function createExhibitionArtworkForAdmin(
  {galleryId, exhibitionId} : 
  {galleryId: string; exhibitionId: string}): Promise<Artwork | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${URL}/createExhibitionArtworkForAdmin`,
      {galleryId, exhibitionId},
      {headers : {authorization: `Bearer ${idToken}`},
    });
    return response.data.artwork;
  }
  catch (error: any) {
    // throw new Error(error.message);  
    return null
  } 
}

export async function editExhibitionArtworkForAdmin({artwork} : {artwork: Artwork}): Promise<Artwork | null> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${URL}/editExhibitionArtworkForAdmin`,
      {artwork},
      {headers : {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  }
  catch (error: any) {
    // console.log('error editing exhibitionArtwork', {error})
    // throw new Error(error.message);  
    return null
  } 
}




export async function reOrderExhibitionArtworkForAdmin({
  exhibitionId,
  artworkId,
  desiredIndex,
  currentIndex,
}: {
  exhibitionId: string;
  artworkId: string;
  desiredIndex: number;
  currentIndex: number;
}): Promise<{[key: string] : Artwork}> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${URL}/reOrderExhibitionArtwork`,
      {
        exhibitionId,
        artworkId,
        desiredIndex,
        currentIndex,
      },
      {headers : {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  }
  catch (error: any) {
    // console.log('error reordering exhibition Artwork', {error})
    // throw new Error(error.message);  
    return {}
  } 
}


export async function deleteExhibitionArtworkForAdmin({exhibitionId, artworkId} : {exhibitionId: string; artworkId: string}): Promise<Exhibition> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.post(
      `${URL}/deleteExhibitionArtworkForAdmin`,
      {
        exhibitionId,
        artworkId,
      },
      {headers : {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  }
  catch (error: any) {
    return {} as Exhibition
  } 
}

export async function deleteExhibitionForAdmin({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}): Promise<void>{
  try {
    const idToken = await auth.currentUser?.getIdToken();
    await axios.post(
      `${URL}/deleteExhibitionForAdmin`,
      {exhibitionId, galleryId},
      {headers : {authorization: `Bearer ${idToken}`}},
    );
  }
  catch (error: any) {
    // throw new Error(error.message);  
  } 
}

export async function publishExhibitionForAdmin(
  {exhibitionId, galleryId, isPublished} : {exhibitionId: string, galleryId: string, isPublished: boolean}): Promise<Exhibition>{
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const res = await axios.post(
      `${URL}/publishExhibitionForAdmin`,
      {exhibitionId, galleryId, isPublished},
      {headers : {authorization: `Bearer ${idToken}`}},
    );
    return res.data;
  }
  catch (error: any) {
    throw new Error(error.message);  
  } 
}


export async function fetchAdminArtLogic(
  { artLogicUrl, galleryId } : { artLogicUrl: string, galleryId: string }): Promise<Exhibition>{
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const res = await axios.post(
      `${URL}/scrapeFromArtLogic`, { artLogicUrl, galleryId }, {headers : {authorization: `Bearer ${idToken}`}});
    return res.data;
  }
  catch (error: any) {
    throw new Error(error.message);  
  } 
}


export async function generateArtworksFromArtLogic(
  { artworksUrl, galleryId, exhibitionId } : { artworksUrl: string, galleryId: string, exhibitionId: string }): Promise<Exhibition>{
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const res = await axios.post(
      `${URL}/generateArtworksFromArtLogicUrl`, { artworksUrl, galleryId, exhibitionId }, {headers : {authorization: `Bearer ${idToken}`}});
    return res.data;
  }
  catch (error: any) {
    throw new Error(error.message);  
  } 
}