import React from 'react';

import {RecommenderRoutesEnum} from '../../typing/routes';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ExhibitionDetailsScreen } from '../../screens/Exhibition';
import { tabBarScreenOptions } from '../../theme/themeConstants';

const RecommenderStackTopTab = createMaterialTopTabNavigator();


export function DartaRecommenderPreviousTopTab({route} : {route: any}) {
      
  return (
    <RecommenderStackTopTab.Navigator  screenOptions={{...tabBarScreenOptions}}>
        <RecommenderStackTopTab.Screen
          name={RecommenderRoutesEnum.recommenderExhibition}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId}}
          options={{ title: 'Exhibition' }}
        />
    </RecommenderStackTopTab.Navigator>
  );
}
