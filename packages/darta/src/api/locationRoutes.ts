import {Exhibition, MapPinCities} from '@darta-types';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { generateHeaders } from './utls';

const URL = `${process.env.EXPO_PUBLIC_API_URL}location`;


export async function listExhibitionPinsByCity({
  cityName,
}: {
  cityName: MapPinCities;
}): Promise<Exhibition | any> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/exhibitionPinsByCity`, {
      params: {
        cityName
  }, headers });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listExhibitionPinsByCity'})
    return {};
  }
}


export async function listExhibitionPinsByListId({
  listId,
}: {
  listId: string;
}): Promise<Exhibition | any> {
  try {
    const headers = await generateHeaders();
    const {data} = await axios.get(`${URL}/listExhibitionPinsByListId`, {
      params: {
        listId
  }, headers });
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message, where: 'listExhibitionPinsByListId'})
    return {};
  }
}
