import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {PreviousExhibitionRootEnum} from '../../typing/routes';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition'
import { tabBarScreenOptions } from '../../theme/themeConstants';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { UserRoutesEnum } from '../../typing/routes';

export const GalleryAndArtworkTopTab = createMaterialTopTabNavigator();

export function GalleryAndArtworkTopTabNavigator({route} : {route: any}) {
  return (
    <GalleryAndArtworkTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <GalleryAndArtworkTopTab.Screen
          name={PreviousExhibitionRootEnum.artworkList}
          component={ArtworkScreen}
          initialParams={{artOnDisplay: route.params?.artOnDisplay}}
          options={{ title: "Artwork"}}
        />
      <GalleryAndArtworkTopTab.Screen
          name={PreviousExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.artOnDisplay.galleryId, navigationRoute: UserRoutesEnum.UserPastTopTabNavigator, showPastExhibitions: true}}
          options={{ title: 'Gallery' }}
        />
    </GalleryAndArtworkTopTab.Navigator>
  );
}
