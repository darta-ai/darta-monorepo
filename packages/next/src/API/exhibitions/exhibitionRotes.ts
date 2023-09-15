import {Exhibition} from '@darta/types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}exhibition`;

export async function createExhibitionAPI(): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/create`,
      {},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to create exhibition');
  }
}

export async function readExhibitionForGallery({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/readExhibitionForGallery`,
      {exhibitionId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable list exhibitions');
  }
}

export async function editExhibitionAPI({
  exhibition,
}: {
  exhibition: Exhibition;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/edit`,
      {exhibition},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to edit exhibition');
  }
}

export async function deleteExhibitionOnlyAPI({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);

  try {
    const response = await axios.post(
      `${URL}/deleteExhibitionOnly`,
      {exhibitionId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to edit exhibition');
  }
}

export async function deleteExhibitionAndArtworkAPI({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/deleteExhibitionAndArtwork`,
      {exhibitionId},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to edit exhibition');
  }
}

export async function listExhibitionsByGalleryAPI(): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.get(`${URL}/listForGallery`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    if (response.data && Array.isArray(response.data)) {
      const mappedGalleryExhibitions = response.data.reduce(
        (accumulator: any, exhibition: Exhibition) => {
          if (exhibition?.exhibitionId) {
            accumulator[exhibition.exhibitionId] = exhibition;
          }
          return accumulator;
        },
        {},
      );
      return mappedGalleryExhibitions;
    }
    return {};
  } catch (error) {
    throw new Error('Unable list exhibitions');
  }
}
export async function reOrderExhibitionArtworkAPI({
  exhibitionId,
  artworkId,
  desiredIndex,
  currentIndex,
}: {
  exhibitionId: string;
  artworkId: string;
  desiredIndex: number;
  currentIndex: number;
}): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true);
  try {
    const response = await axios.post(
      `${URL}/reOrderExhibitionArtwork`,
      {
        exhibitionId,
        artworkId,
        desiredIndex,
        currentIndex,
      },
      {
        headers: {authorization: `Bearer ${idToken}`},
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
