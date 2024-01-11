import React from 'react';

import {RecommenderRoutesEnum} from '../../typing/routes';

import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ExhibitionArtworkScreen, ExhibitionDetailsScreen, ExhibitionGalleryScreen } from '../../screens/Exhibition';
import { tabBarScreenOptions } from '../../theme/themeConstants';
import {headerOptions} from '../../styles/styles';
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { ExhibitionStoreContext } from '../../state';


const RecommenderStackTopTab = createMaterialTopTabNavigator();


export function DartaRecommenderPreviousTopTab({route} : {route: any}) {
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
    <RecommenderStackTopTab.Navigator  screenOptions={{...tabBarScreenOptions}}>
        <RecommenderStackTopTab.Screen
          name={RecommenderRoutesEnum.recommenderExhibition}
          component={ExhibitionDetailsScreen}
          initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId}}
          options={{ title: 'Exhibition' }}
        />
        {/* {showArtwork && (
        <RecommenderStackTopTab.Screen
            name={RecommenderRoutesEnum.recommenderArtworkList}
            component={ExhibitionArtworkScreen}
            initialParams={{exhibitionId: route.params.exhibitionId, galleryId: route.params.galleryId, navigateTo: RecommenderRoutesEnum.recommenderIndividualArtwork}}
            options={{ title: 'Artwork' }}
        />
        )} */}
    </RecommenderStackTopTab.Navigator>
  );
}
