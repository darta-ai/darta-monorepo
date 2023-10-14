import {PRIMARY_600} from '@darta-styles';
import React, {useContext} from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {StoreContext} from '../../state/Store';
import {PreviousExhibitionRootEnum} from '../../typing/routes';
import {ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../../screens/Exhibition'
import { tabBarScreenOptions } from '../../theme/themeConstants';

export const PreviousExhibitionStackTopTab = createMaterialTopTabNavigator();
export type PreviousExhibitionStackParamList = {
  [PreviousExhibitionRootEnum.exhibitionDetails]: {
    exhibitionId?: string;
  };
  [PreviousExhibitionRootEnum.artworkList]: {
    exhibitionId?: string;
  };
};

export function PastExhibitionTopTabNavigator({route} : {route: any}) {

  const {state} = useContext(StoreContext);
  let exhibitionId = "";
  if (route?.params?.exhibitionId){
    exhibitionId = route.params.exhibitionId;
  }

  let pastExhibitionTitle = 'past exhibition'
  if (exhibitionId && state.exhibitionData && state.exhibitionData[exhibitionId] && state.exhibitionData[exhibitionId].exhibitionTitle){
    pastExhibitionTitle = state.exhibitionData[exhibitionId].exhibitionTitle.value!
  }


  return (
    <PreviousExhibitionStackTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <PreviousExhibitionStackTopTab.Screen
          name={PreviousExhibitionRootEnum.artworkList}
          component={ExhibitionArtworkScreen}
          initialParams={{exhibitionId: route?.params?.exhibitionId, galleryId: route?.params?.galleryId}}
          options={{ title: 'artworks' }}
        />
      <PreviousExhibitionStackTopTab.Screen
          name={PreviousExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route?.params?.exhibitionId, galleryId: route?.params?.galleryId}}
          options={{ title: 'exhibition' }}
        />
    </PreviousExhibitionStackTopTab.Navigator>
  );
}
