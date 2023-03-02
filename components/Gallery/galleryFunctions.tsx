import {
  ImageCollection,
} from '../../firebase/hooks';
import { DataT } from '../../types';

export const getImages = async (docIds:string[]) => {
  const results: DataT[] = await Promise.all(docIds.map(
    async (docID:string): Promise<DataT> => {
      let artwork: DataT | undefined;
      await ImageCollection.doc(docID).get().then((value: any) => {
        if (value.exists) {
          ({ artwork } = value.data());
        }
      }).catch((e : Error) => {
        console.log('!!!! error', { e });
        throw new Error(`No image exists for id ${docID}`);
      });
      return artwork as DataT;
    },
  ));
  return results;
};
