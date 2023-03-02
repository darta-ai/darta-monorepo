import {
  Image,
} from 'react-native';
import {
  ImageCollection,
} from '../../firebase/hooks';
import { DataT } from '../../types';

const imagePrefetch = async (imageUrls: string[]) => {
  const imagePrefetchResults: boolean[] = await Promise.all(imageUrls.map(
    async (imageUrl:string): Promise<boolean> => Image.prefetch(imageUrl),
  ));
  return imagePrefetchResults;
};

export const getImages = async (docIds:string[]) => {
  const imageIds: string[] = [];
  const results: DataT[] = await Promise.all(docIds.map(
    async (docID:string): Promise<DataT> => {
      let artwork: DataT | undefined;
      await ImageCollection.doc(docID).get().then((value: any) => {
        if (value.exists) {
          ({ artwork } = value.data());
          if (artwork) {
            imageIds.push(artwork.image);
          }
        }
      }).catch((e : Error) => {
        console.log('!!!! error', { e });
        throw new Error(`No image exists for id ${docID}`);
      });
      return artwork as DataT;
    },
  ));
  await imagePrefetch(imageIds);
  return results;
};
