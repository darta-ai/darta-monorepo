import axios from 'axios';
import {firebaseSignUp} from './firebase';
import { Images } from '@darta-types';

const URL = `${process.env.EXPO_PUBLIC_API_URL}users`;

export async function createUser({
    localStorageUid,
}: {
    localStorageUid: string;
}): Promise<any> {
  try {
      console.log(localStorageUid)
    const {data} = await axios.post(`${URL}/newDartaUser`, {localStorageUid});
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
      localStorageUid});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return error.message;
  }
}