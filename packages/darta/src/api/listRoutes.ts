import axios from 'axios';
import { NewList, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import auth from '@react-native-firebase/auth';

const URL = `${process.env.EXPO_PUBLIC_API_URL}lists`;

export async function readListForUser({listId} : {listId: string}){
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/readList`, {params : {listId}, headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'readArtworkForUser'})
    return error.message;
  }
}

export async function createListForUser({
  newList,
  artworkId
}: {
  newList: NewList;
  artworkId: string;
}): Promise<any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.post(`${URL}/createList`, {newList, artworkId}, {headers: {authorization: `Bearer ${idToken}`}});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'createUserArtworkRelationship'})
    return error.message;
  }
}


export async function deleteListForUser({
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
    throw new Error('Not implemented')
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'deleteUserArtworkRelationship'})
    return null
  }
}

export async function listUserLists(): Promise<any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/listLists`, {headers: {authorization: `Bearer ${idToken}`}})
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listUserLists'})
    return null;
  }
}


export async function addArtworkToList({listId, artworkId}: {listId : string, artworkId: string}): Promise<any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.post(`${URL}/addArtworkToList`, {listId, artworkId}, {headers: {authorization: `Bearer ${idToken}`}});
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'addArtworkToList'})
    return null
  }
}


export async function getFullList({listId}: {listId : string}): Promise<any> {
  try {
    const idToken = await auth().currentUser?.getIdToken();
    const {data} = await axios.get(`${URL}/readList`, {params: {listId}, headers: {authorization: `Bearer ${idToken}`}});
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'addArtworkToList'})
    return null
  }
}


