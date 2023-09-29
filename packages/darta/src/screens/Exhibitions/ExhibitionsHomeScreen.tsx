import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { SSDartaHome, touchableOpacity } from '../../styles/styles';
import { readExhibition } from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';

import { ExhibitionDates } from '@darta-types'
import { ExhibitionPreview } from '../../components/Previews/ExhibitionPreview';
import { readGallery } from '../../api/galleryRoutes';

type ExhibitionHomeScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionHome
>;

export function ExhibitionsHomeScreen({
  navigation,
}: {
  navigation: ExhibitionHomeScreenNavigationProp;
}) {
  const {state, dispatch} = useContext(StoreContext);

  const loadExhibition = async () => {
    try{
        const results = await readExhibition({exhibitionId: 'Exhibitions/ba99e53d-29c0-49dd-9c5f-8761fb5655c3'});
        const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId: results.galleryId})
        dispatch({
            type: ETypes.saveExhibition,
            exhibitionData: results,
        })
        if (results.galleryId && state?.galleryData && !state?.galleryData[results.galleryId]){
          const galleryId = results.galleryId
          const galleryResults = await readGallery({galleryId});
          const galleryData = {...galleryResults, galleryExhibitions: supplementalExhibitions}
          dispatch({
            type: ETypes.saveGallery,
            galleryData
          })
        }
        // TO-DO, save artwork to artworkData object in state
        navigation.navigate(ExhibitionRootEnum.TopTab, {galleryId: results.galleryId, exhibitionId: results.exhibitionId});
    } catch(error: any) {
      console.log(error)
    }

}   
    const exhibitionDates: ExhibitionDates = {
        exhibitionDuration: { value: "Temporary" },
        exhibitionStartDate: { 
            isOngoing: false,
            value: "Mon Sep 11 2023 00:00:00 GMT-0400 (Eastern Daylight Time)" 
        },
        exhibitionEndDate: { 
            isOngoing: false,
            value: "Mon Sep 17 2023 00:00:00 GMT-0400 (Eastern Daylight Time)" },
    }

  return (
    <View style={SSDartaHome.container}>
      <View>
        <TouchableOpacity
          onPress={async () => {
            await loadExhibition()
          }}
          style={touchableOpacity.touchableOpacityButtonStyling}>
            <View>
              <ExhibitionPreview 
                exhibitionHeroImage="http://localhost:9000/exhibitions/251317fd-a181-4523-b1f8-55423796fe9b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dvaeTqeXGMAl0hdf%2F20230924%2Fus-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230924T194834Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=dcc7085c88228fba9f2a5f012f6f77f35509dbf25897a1c1efbba9decb6ed58a"
                exhibitionTitle="The Critique of Pure Reason"
                exhibitionGallery="All Street"
                exhibitionArtist='IMMANUEL KANT'
                exhibitionDates={exhibitionDates}
                galleryLogoLink='http://localhost:9000/logo/9f1bfa72-ebb5-4343-a595-2c077a8b291c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dvaeTqeXGMAl0hdf%2F20230926%2Fus-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230926T005727Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=8c4bd3b01833332b6f174218aa4bb4b7d3cff98ccc228290c0bc0c02ba7ede00'
              />
            </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
