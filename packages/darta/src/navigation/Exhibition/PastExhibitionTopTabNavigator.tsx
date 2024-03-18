import {PRIMARY_600} from '@darta-styles';
import React, {useContext} from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {StoreContext} from '../../state/Store';
import {ExhibitionRootEnum, PreviousExhibitionRootEnum} from '../../typing/routes';
import {ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../../screens/Exhibition'
import { tabBarScreenOptions } from '../../theme/themeConstants';
import { ExhibitionStoreContext } from '../../state';

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

  const {exhibitionState} = useContext(ExhibitionStoreContext);
  let exhibitionId = "";
  if (route?.params?.exhibitionId){
    exhibitionId = route.params.exhibitionId;
  }

  let pastExhibitionTitle = 'past exhibition'
  if (exhibitionId && exhibitionState.exhibitionData && exhibitionState.exhibitionData[exhibitionId] && exhibitionState.exhibitionData[exhibitionId].exhibitionTitle){
    pastExhibitionTitle = exhibitionState.exhibitionData[exhibitionId].exhibitionTitle.value!
  }

  const [showArtwork , setShowArtwork] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const exhibitionId = route.params.exhibitionId;
    const exhibitionData = exhibitionState.exhibitionData;
  
    if (exhibitionData && exhibitionData[exhibitionId]) {
      const artworks = exhibitionData[exhibitionId].artworks;
      if (artworks && Object.keys(artworks).length > 0) {
        setShowArtwork(true);
      }
    }
  }, [exhibitionState.exhibitionData]);
  


  return (
    <PreviousExhibitionStackTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <PreviousExhibitionStackTopTab.Screen
          name={PreviousExhibitionRootEnum.exhibitionDetails}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route?.params?.exhibitionId, galleryId: route?.params?.galleryId}}
          options={{ title: 'Exhibition' }}
        />
        {showArtwork && (
        <PreviousExhibitionStackTopTab.Screen
            name={PreviousExhibitionRootEnum.artworkList}
            component={ExhibitionArtworkScreen}
            initialParams={{exhibitionId: route?.params?.exhibitionId, galleryId: route?.params?.galleryId, navigateTo: route.params?.navigateTo ?? ExhibitionRootEnum.individualArtwork }}
            options={{ title: 'Checklist' }}
          />
        )}
    </PreviousExhibitionStackTopTab.Navigator>
  );
}
