import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ExhibitionRootEnum} from '../../typing/routes';
import {ExhibitionGalleryScreen, ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../../screens/Exhibition'
import { tabBarScreenOptions } from '../../theme/themeConstants';


export const ExhibitionStackTopTab = createMaterialTopTabNavigator();
export type ExhibitionStackParamList = {
  [ExhibitionRootEnum.exhibitionDetails]: {
    exhibitionId?: string;
    galleryId?: string;
    internalAppRoute: boolean;
    locationId?: string;
  };
  [ExhibitionRootEnum.artworkList]: {
    exhibitionId?: string;
    galleryId?: string;
  };
  [ExhibitionRootEnum.exhibitionGallery]: {
    galleryId?: string;
    exhibitionId?: string;
    navigationRoute?: string;
  };
};

export function ExhibitionTopTabNavigator({route} : {route: any}) {  
  return (
    <ExhibitionStackTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <ExhibitionStackTopTab.Group>
      <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId, internalAppRoute: route.params.internalAppRoute, locationId: route.params?.locationId}}
          options={{ title: 'Exhibition' }}
        />
        <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.artworkList}
          component={ExhibitionArtworkScreen}
          initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId}}
          options={{ title: 'Artwork' }}
        />
        <ExhibitionStackTopTab.Screen
          name={ExhibitionRootEnum.exhibitionGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params.galleryId, exhibitionId: route.params.exhibitionId, navigationRoute: route.params.navigationRoute}}
          options={{ title: 'Gallery' }}
        />
        </ExhibitionStackTopTab.Group>
    </ExhibitionStackTopTab.Navigator>
  );
}
