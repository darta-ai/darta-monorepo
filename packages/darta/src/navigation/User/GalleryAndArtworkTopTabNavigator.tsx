import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {PreviousExhibitionRootEnum} from '../../typing/routes';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition'
import { tabBarScreenOptions } from '../../theme/themeConstants';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { UserRoutesEnum } from '../../typing/routes';
import { StoreContext } from '../../state/Store';
import {modalHeaderOptions} from '../../styles/styles';

export const GalleryAndArtworkTopTab = createMaterialTopTabNavigator();

export function GalleryAndArtworkTopTabNavigator({route} : {route: any}) {
  const {state} = React.useContext(StoreContext)
  return (
    <GalleryAndArtworkTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <GalleryAndArtworkTopTab.Screen
          name={PreviousExhibitionRootEnum.artworkList}
          component={ArtworkScreen}
          initialParams={{artOnDisplay: route.params?.artOnDisplay}}
          options={{ title: "artwork" }}
        />
      <GalleryAndArtworkTopTab.Screen
          name={PreviousExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.artOnDisplay.galleryId, navigationRoute: UserRoutesEnum.UserPastTopTabNavigator, showPastExhibitions: true}}
          options={{ title: 'gallery' }}
        />
    </GalleryAndArtworkTopTab.Navigator>
  );
}
