import {Exhibition, MapPinCities} from '@darta-types';
import axios from 'axios';

const URL = `${process.env.EXPO_PUBLIC_API_URL}location`;

export async function listExhibitionPinsByCity({
  cityName,
}: {
  cityName: MapPinCities;
}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.get(`${URL}/exhibitionPinsByCity`, {
      params: {
        cityName
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}
