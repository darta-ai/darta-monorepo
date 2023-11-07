import React from 'react';

import {RecommenderRoutesEnum} from '../../typing/routes';

import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ExhibitionDetailsScreen, ExhibitionGalleryScreen } from '../../screens/Exhibition';
import { tabBarScreenOptions } from '../../theme/themeConstants';

const RecommenderStackTopTab = createMaterialTopTabNavigator();


export function DartaRecommenderTopTab({route} : {route: any}) {
  return (
    <RecommenderStackTopTab.Navigator  screenOptions={{...tabBarScreenOptions}}>
        <RecommenderStackTopTab.Screen
          name={RecommenderRoutesEnum.recommenderDetails}
          initialParams={{artOnDisplay: route.params.artOnDisplay}}
          component={ArtworkScreen}
          options={{ title: 'Artwork' }}
        />
        <RecommenderStackTopTab.Screen
          name={RecommenderRoutesEnum.recommenderExhibition}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId}}
          options={{ title: 'Exhibition' }}
        />
        <RecommenderStackTopTab.Screen
          name={RecommenderRoutesEnum.recommenderGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params.galleryId, showPastExhibitions: false}}
          options={{ title: 'Gallery' }}
        />
    </RecommenderStackTopTab.Navigator>
  );
}
