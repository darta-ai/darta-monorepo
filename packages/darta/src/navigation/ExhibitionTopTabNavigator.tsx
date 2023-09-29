import {PRIMARY_600} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionStack} from '../../App';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {ExhibitionRootEnum} from '../typing/routes';
import {ExhibitionGalleryScreen, ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../screens/Exhibitions/'
import {ArtworkNavigatorModal} from '../components/Modal/ArtworkNavigatorModal';

export const ExhibitionStackTopTab = createMaterialTopTabNavigator();
export type ExhibitionStackParamList = {
  [ExhibitionRootEnum.exhibitionDetails]: {
    exhibitionId?: string;
  };
  [ExhibitionRootEnum.artworkList]: {
    exhibitionId?: string;
  };
  [ExhibitionRootEnum.exhibitionGallery]: {
    galleryId?: string;
  };
};

export function ExhibitionTopTabNavigator({route} : {route: any}) {
  return (
    <ExhibitionStackTopTab.Navigator >
      <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route.params.exhibitionId}}
        />
        <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.artworkList}
          component={ExhibitionArtworkScreen}
          initialParams={{exhibitionId: route.params.exhibitionId}}
        />
        <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.exhibitionGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params.galleryId}}
        />
    </ExhibitionStackTopTab.Navigator>
  );
}
