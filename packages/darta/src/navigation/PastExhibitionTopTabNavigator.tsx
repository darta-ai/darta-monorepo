import {PRIMARY_600} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionStack} from '../../App';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {PreviousExhibitionRootEnum} from '../typing/routes';
import {ExhibitionGalleryScreen, ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../screens/Exhibitions'
import {ArtworkNavigatorModal} from '../components/Modal/ArtworkNavigatorModal';

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
  let exhibitionId;
  if (route?.params?.exhibitionId){
    exhibitionId = route.params.exhibitionId;
  }

  let pastExhibitionTitle = 'past exhibition'
  if (exhibitionId && state.exhibitionData && state.exhibitionData[exhibitionId] && state.exhibitionData[exhibitionId].exhibitionTitle){
    pastExhibitionTitle = state.exhibitionData[exhibitionId].exhibitionTitle.value!
    console.log({exhibitionId}, pastExhibitionTitle)
  }


  return (
    <PreviousExhibitionStackTopTab.Navigator >
      <PreviousExhibitionStackTopTab.Screen
          name={PreviousExhibitionRootEnum.artworkList}
          component={ExhibitionArtworkScreen}
          initialParams={{exhibitionId: route?.params?.exhibitionId}}
          options={{ title: 'artworks' }}
        />
      <PreviousExhibitionStackTopTab.Screen
          name={PreviousExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route?.params?.exhibitionId}}
          options={{ title: 'exhibition' }}
        />
    </PreviousExhibitionStackTopTab.Navigator>
  );
}
