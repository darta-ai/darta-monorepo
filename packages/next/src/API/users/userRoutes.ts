import {GalleryBase} from '@darta-types';
import axios from 'axios';

import {auth} from '../../ThirdPartyAPIs/firebaseApp';

const URL = `${process.env.NEXT_PUBLIC_API_URL}users`;

export async function createGalleryUser({
  galleryName,
  signUpWebsite,
  primaryOwnerPhone,
  primaryOwnerEmail,
}: any): Promise<any> {
  const idToken = await auth.currentUser?.getIdToken();
  try {
    const response = await axios.post(
      `${URL}/newGallery`,
      {
        galleryName,
        signUpWebsite,
        primaryOwnerPhone,
        primaryOwnerEmail,
      } as GalleryBase,
      {headers: {authorization: `Bearer ${idToken}`}},
    );
    return response;
  } catch (error: any) {
    throw new Error('Unable to create profile', error.message);
  }
}
