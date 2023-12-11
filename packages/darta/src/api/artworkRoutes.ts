import axios from 'axios';
import { USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import auth from '@react-native-firebase/auth';
import { generateHeaders } from './utls';

const URL = `${process.env.EXPO_PUBLIC_API_URL}artwork`;

export async function readArtworkForUser({artworkId} : {artworkId: string}){
  try {
    const headers = await generateHeaders()
    const {data} = await axios.get(`${URL}/readArtworkForUser`, {params : {artworkId}, headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readArtworkForUser'})
    return error.message;
  }
}

export async function createUserArtworkRelationship({
  uid,
  action,
  artworkId
}: {
  uid?: string;
  action: USER_ARTWORK_EDGE_RELATIONSHIP;
  artworkId: string;
}): Promise<any> {
  try {
    const headers = await generateHeaders()
    const uid = auth().currentUser?.uid;
    const {data} = await axios.post(`${URL}/createUserArtworkRelationship`, {uid, action, artworkId}, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'createUserArtworkRelationship'})
    return error.message;
  }
}


export async function deleteUserArtworkRelationship({
  uid,
  action,
  artworkId
}: {
  uid: string;
  action: USER_ARTWORK_EDGE_RELATIONSHIP;
  artworkId: string;
}): Promise<any> {
  try {
    const headers = await generateHeaders()
    const {data} = await axios.post(`${URL}/deleteUserArtworkRelationship`, {uid, action, artworkId}, {headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'deleteUserArtworkRelationship'})
    return error.message;
  }
}

export async function listUserArtworkAPIRelationships({
  uid,
  action, 
  limit
}: {
  uid: string;
  action: USER_ARTWORK_EDGE_RELATIONSHIP;
  limit: number;
}): Promise<any> {
  try {
    const headers = await generateHeaders()
    const {data} = await axios.get(`${URL}/listUserArtworkRelationships`, {params : {uid, action, limit}, headers});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listUserArtworkRelationships'})
    return error.message;
  }
}

