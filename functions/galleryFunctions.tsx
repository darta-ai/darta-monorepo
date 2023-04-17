import {Image} from 'react-native';

import {ImageCollection} from '../firebase/hooks';
import {buttonSizes} from '../src/globalVariables';
import {DataT} from '../types';

export const imagePrefetch = async (imageUrls: string[]) => {
  const imagePrefetchResults: boolean[] = await Promise.all(
    imageUrls.map(
      async (imageUrl: string): Promise<boolean> =>
        Image.prefetch(imageUrl).catch((e: Error) => {
          throw new Error(`No image exists for id ${imageUrl}, ${e}`);
        }),
    ),
  );
  return imagePrefetchResults;
};

export const getImages = async (docIds: string[]) => {
  const imageIds: string[] = [];
  const results: DataT[] = await Promise.all(
    docIds.map(async (docID: string): Promise<DataT> => {
      let artwork: DataT | undefined;
      await ImageCollection.doc(docID)
        .get()
        .then((value: any) => {
          if (value.exists) {
            ({artwork} = value.data());
            if (artwork) {
              imageIds.push(artwork.image);
            }
          }
        })
        .catch((e: Error) => {
          console.log('!!!! error', {e});
          throw new Error(`No image exists for id ${docID}`);
        });
      return artwork as DataT;
    }),
  );
  await imagePrefetch(imageIds);
  return results;
};

export const getButtonSizes = (hp: number) => {
  const baseHeight = 926;
  // { extraSmall: 15, small: 20, medium: 30, large: 40 }
  return {
    extraSmall: Math.floor((hp / baseHeight) * buttonSizes.extraSmall),
    small: Math.floor((hp / baseHeight) * buttonSizes.small),
    mediumSmall: Math.floor((hp / baseHeight) * buttonSizes.mediumSmall),
    medium: Math.floor((hp / baseHeight) * buttonSizes.medium),
    large: Math.floor((hp / baseHeight) * buttonSizes.large),
  };
};
