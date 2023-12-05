import axios from 'axios';
import { USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import auth from '@react-native-firebase/auth';

const URL = `${process.env.EXPO_PUBLIC_API_URL}artwork`;

export async function readArtworkForUser({artworkId} : {artworkId: string}){
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/readArtworkForUser`, {params : {artworkId}, headers: {authorization: `Bearer ${idToken}`}});
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
    const idToken = await auth().currentUser?.getIdToken();
    const uid = auth().currentUser?.uid;
    const {data} = await axios.post(`${URL}/createUserArtworkRelationship`, {uid, action, artworkId}, {headers: {authorization: `Bearer ${idToken}`}});
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
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.post(`${URL}/deleteUserArtworkRelationship`, {uid, action, artworkId}, {headers: {authorization: `Bearer ${idToken}`}});
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
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/listUserArtworkRelationships`, {params : {uid, action, limit}, headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listUserArtworkRelationships'})
    return error.message;
  }
}

