import {GalleryBase, IGalleryProfileData} from '@darta-types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}gallery`;

export async function createGalleryProfileAPI({
  galleryName,
  signUpWebsite,
  primaryOwnerPhone,
  primaryOwnerEmail,
}: any): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken();
  try {
    const response = await axios.post(
      `${URL}/createProfile`,
      {
        galleryName,
        signUpWebsite,
        primaryOwnerPhone,
        primaryOwnerEmail,
      } as GalleryBase,
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response;
  } catch (error) {
    throw new Error('Unable to create profile');
  }
}

export async function readGalleryProfileAPI(): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken();
  try {
    const response = await axios.get(`${URL}/galleryProfile`, {
      headers: {authorization: `Bearer ${idToken}`},
    });
    if (!response.data) {
      return {};
    }
    return response.data;
  } catch (error) {
    return {};
    // throw new Error('Unable to retrieve profile');
  }
}

export async function updateGalleryProfileAPI(
  data: IGalleryProfileData,
): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken();
  try {
    const response = await axios.post(
      `${URL}/editProfile`,
      {data},
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response;
  } catch (error) {
    return {};
  }
}
