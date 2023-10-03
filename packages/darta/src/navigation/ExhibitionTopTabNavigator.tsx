import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ExhibitionRootEnum, PreviousExhibitionRootEnum} from '../typing/routes';
import {ExhibitionGalleryScreen, ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../screens/Exhibitions/'
import { ExhibitionStack } from '../../App';
import {PastExhibitionTopTabNavigator, PreviousExhibitionStackTopTab} from './PastExhibitionTopTabNavigator'

export const ExhibitionStackTopTab = createMaterialTopTabNavigator();
export type ExhibitionStackParamList = {
  [ExhibitionRootEnum.exhibitionDetails]: {
    exhibitionId?: string;
    galleryId?: string;
  };
  [ExhibitionRootEnum.artworkList]: {
    exhibitionId?: string;
  };
  [ExhibitionRootEnum.exhibitionGallery]: {
    galleryId?: string;
    exhibitionId?: string;
  };
};

export function ExhibitionTopTabNavigator({route} : {route: any}) {
  return (
    <ExhibitionStackTopTab.Navigator >
      <ExhibitionStackTopTab.Group>
      <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId}}
          options={{ title: 'Exhibition' }}
        />
        <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.artworkList}
          component={ExhibitionArtworkScreen}
          initialParams={{exhibitionId: route.params.exhibitionId}}
          options={{ title: 'Artwork' }}
        />
        <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.exhibitionGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params.galleryId, exhibitionId: route.params.exhibitionId}}
          options={{ title: 'Gallery' }}
        />
        </ExhibitionStackTopTab.Group>
    </ExhibitionStackTopTab.Navigator>
  );
}
