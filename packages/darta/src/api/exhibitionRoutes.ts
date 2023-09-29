import {Exhibition} from '@darta-types';
import axios from 'axios';

// const URL = `${process.env.EXPO_PUBLIC_API_URL}exhibition`;

const URL = 'http://localhost:1160/exhibition'

export async function readExhibition({
  exhibitionId,
}: {
  exhibitionId: string;
}): Promise<Exhibition | any> {
  try {
    const {data} = await axios.get(`${URL}/readForUser`, {
      params: {
        exhibitionId
  }});
    return data;
  } catch (error:any) {
    console.log({error: error, message: error.message})
    return {};
  }
}

