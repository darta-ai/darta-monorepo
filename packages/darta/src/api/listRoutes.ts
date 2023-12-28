import axios from 'axios';
import { FullList, NewList, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import auth from '@react-native-firebase/auth';
import { generateHeaders } from './utls';

const URL = `${process.env.EXPO_PUBLIC_API_URL}lists`;

export async function readListForUser({listId} : {listId: string}){
  try {
    const headers = await generateHeaders()
    const {data} = await axios.get(`${URL}/readList`, {params : {listId}, headers});
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
    const headers = await generateHeaders()
    const {data} = await axios.post(`${URL}/createList`, {newList, artworkId}, {headers});
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
    const headers = await generateHeaders()
    const {data} = await axios.post(`${URL}/deleteUserArtworkRelationship`, {uid, action, artworkId}, {headers});
    throw new Error('Not implemented')
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'deleteUserArtworkRelationship'})
    return null
  }
}

export async function listUserLists(): Promise<any> {
  try {
    const headers = await generateHeaders()
    const {data} = await axios.get(`${URL}/listLists`, {headers})
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listUserLists'})
    return null;
  }
}


export async function addArtworkToList({listId, artworkId}: {listId : string, artworkId: string}): Promise<any> {
  try {
    const headers = await generateHeaders()
    const {data} = await axios.post(`${URL}/addArtworkToList`, {listId, artworkId}, {headers});
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'addArtworkToList'})
    return null
  }
}


export async function getFullList({listId}: {listId : string}): Promise<any> {
  try {
    const headers = await generateHeaders()
    const {data} = await axios.get(`${URL}/readList`, {params: {listId}, headers});
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'addArtworkToList'})
    return null
  }
}

export async function removeArtworkFromList({listId, artworkId}: {listId : string, artworkId: string}): Promise<{[key: string]: FullList} | null> {
  try {
    const headers = await generateHeaders()
    const {data} = await axios.post(`${URL}/removeArtworkFromList`, {listId, artworkId}, {headers});
    return data
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'removeArtworkFromList'})
    return null
  }
}




