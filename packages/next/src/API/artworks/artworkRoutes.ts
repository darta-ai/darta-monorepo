import {Artwork} from '@darta-types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}artwork`;

export async function createArtworkAPI(): Promise<Artwork> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.get(`${URL}/create`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error) {
    throw new Error('Unable to create artwork');
  }
}

export async function editArtworkAPI({
  artwork,
}: {
  artwork: Artwork;
}): Promise<Artwork> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/edit`,
      {artwork},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable edit artwork');
  }
}

export async function deleteArtworkAPI(artworkId: string): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/delete`,
      {artworkId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable edit artwork');
  }
}

type artworkForExhibition = {
  artwork: Artwork;
};

export async function createArtworkForExhibitionAPI({
  exhibitionId,
  exhibitionOrder,
}: {
  exhibitionId: string;
  exhibitionOrder: number;
}): Promise<artworkForExhibition> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const {data} = await axios.post(
      `${URL}/createArtworkForExhibition`,
      {exhibitionId, exhibitionOrder},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return data;
  } catch (error) {
    throw new Error('Unable to edit exhibition');
  }
}

export async function editArtworkForExhibitionAPI({
  artwork,
}: {
  artwork: Artwork;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/editArtworkForExhibition`,
      {artwork},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to edit exhibition');
  }
}

export async function swapArtworkOrderAPI({
  artworkId,
  order,
}: {
  artworkId: string;
  order: string;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/swapArtworkOrder`,
      {artworkId, order},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to edit exhibition');
  }
}

export async function createAndEditArtworkForExhibition({
  exhibitionId,
  artwork,
}: {
  exhibitionId: string;
  artwork: Artwork;
}): Promise<Artwork | null> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/createAndEditArtworkForExhibition`,
      {exhibitionId, artwork},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to create and edit exhibition');
  }
}

export async function removeArtworkFromExhibition({
  exhibitionId,
  artworkId,
}: {
  exhibitionId: string;
  artworkId: string;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/removeArtworkFromExhibition`,
      {artworkId, exhibitionId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to delete exhibition');
  }
}

export async function deleteExhibitionArtwork({
  exhibitionId,
  artworkId,
}: {
  exhibitionId: string;
  artworkId: string;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/deleteExhibitionArtwork`,
      {artworkId, exhibitionId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to delete exhibition');
  }
}

export async function listArtworksByGalleryAPI(): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.get(`${URL}/listGalleryArtworks`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    const mappedGalleryArtworks = response.data.reduce(
      (accumulator: any, artwork: Artwork) => {
        if (artwork?.artworkId) {
          accumulator[artwork.artworkId] = artwork;
        }
        return accumulator;
      },
      {},
    );
    return mappedGalleryArtworks;
  } catch (error) {
    
    // throw new Error('Unable edit artwork')
  }
  return null
}

export async function listArtworkInquiresAPI(): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.get(`${URL}/listArtworkInquires`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Unable to list artwork inquires: ${error?.message}`)
  }
}

export async function editArtworkInquiryAPI({edge_id, status}: {edge_id: string, status: string}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(`${URL}/editArtworkInquiry`, {edge_id, status}, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Unable to list artwork inquires: ${error?.message}`)
  }
}

