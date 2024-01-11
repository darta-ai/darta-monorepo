import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ExhibitionRootEnum, ExploreMapRootEnum} from '../../typing/routes';
import {ExhibitionGalleryScreen, ExhibitionDetailsScreen, ExhibitionArtworkScreen} from '../../screens/Exhibition'
import { tabBarScreenOptions } from '../../theme/themeConstants';
import { ExhibitionStoreContext } from '../../state';

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
    locationId?: string;
    navigateTo: string;
  };
  [ExhibitionRootEnum.exhibitionGallery]: {
    galleryId?: string;
    exhibitionId?: string;
    navigationRoute?: string;
    showPastExhibitions: boolean
  };
};

export function ExhibitionTopTabNavigator({route} : {route: any}) {  
  const {exhibitionState} = React.useContext(ExhibitionStoreContext);
  
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
    <ExhibitionStackTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <ExhibitionStackTopTab.Group>
        <ExhibitionStackTopTab.Screen
            name={ExhibitionRootEnum.exhibitionDetails}
            component={ExhibitionDetailsScreen}
            initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId, internalAppRoute: route.params.internalAppRoute, locationId: route.params?.locationId}}
            options={{ title: 'Exhibition' }}
          />
          {showArtwork && (
            <ExhibitionStackTopTab.Screen
              name={ExhibitionRootEnum.artworkList}
              component={ExhibitionArtworkScreen}
              initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId, navigateTo: route.params.navigateTo}}
              options={{ title: 'Artwork' }}
            />
          )}
          <ExhibitionStackTopTab.Screen
            name={ExhibitionRootEnum.exhibitionGallery}
            component={ExhibitionGalleryScreen}
            initialParams={{galleryId: route.params.galleryId, exhibitionId: route.params.exhibitionId, navigationRoute: route.params.navigationRoute, showPastExhibitions: true}}
            options={{ title: 'Gallery' }}
          />
        </ExhibitionStackTopTab.Group>
    </ExhibitionStackTopTab.Navigator>
  );
}
