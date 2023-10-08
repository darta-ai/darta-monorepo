import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { readExhibition } from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';
import { listAllExhibitionsPreviewsForUser } from "../../api/exhibitionRoutes";
import {Button} from 'react-native-paper';


import { ExhibitionPreview, IGalleryProfileData, Exhibition, ArtworkObject } from '@darta-types'
import { readGallery } from '../../api/galleryRoutes';
import { ExhibitionPreviewCard } from '../../components/Previews/ExhibitionPreviewCard';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';


type ExhibitionHomeScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionHome
>;

const exhibitionHomeStyle = StyleSheet.create({
  exhibitionTogglerContainer : {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: hp('10%'),
    backgroundColor: Colors.PRIMARY_100,
  }
})

export function ExhibitionsHomeScreen({
  navigation,
}: {
  navigation: ExhibitionHomeScreenNavigationProp;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const [exhibitionPreviews, setExhibitionPreviews] = React.useState<ExhibitionPreview[]>([])
  
  React.useEffect(()=> {
    if (state.exhibitionPreviews) {
      setExhibitionPreviews(Object.values(state?.exhibitionPreviews).sort((a, b) => {
        return a.openingDate > b.openingDate ? 1 : -1
      })
  )}
  }, [])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const {galleries, exhibitions, exhibitionPreviews} : 
      {galleries: {[key: string] : IGalleryProfileData}, exhibitions: {[key: string] : Exhibition}, artwork: ArtworkObject, exhibitionPreviews: {[key: string]: ExhibitionPreview}} = await listAllExhibitionsPreviewsForUser({limit: 10})

      let artwork: ArtworkObject = {};
      Object.values(exhibitions).forEach((exhibitionValue) => {
        if (exhibitionValue?.artworks){
          artwork = {
            ...artwork,
            ...exhibitionValue.artworks
          }
        }
      })
      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})
      dispatch({type: ETypes.saveGalleries, galleryDataMulti: galleries})
      dispatch({type: ETypes.saveArtworkMulti, artworkDataMulti: artwork})
      dispatch({type: ETypes.saveExhibitionMulti, exhibitionDataMulti: exhibitions})
    } catch {
        setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500)
  }, []);


  const loadExhibition = async ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => {
    try{
        if (!exhibitionId || !galleryId) return
        let exhibition = {} as Exhibition;
        if(!state.exhibitionData && !state.exhibitionData?.[exhibitionId]){
          exhibition =  await readExhibition({exhibitionId});
          dispatch({
            type: ETypes.saveExhibition,
            exhibitionData: exhibition
          })
        } else{
          exhibition = state.exhibitionData[exhibitionId]
        }
        let galleryResults = {} as IGalleryProfileData;
        if (state.galleryData && state.galleryData[galleryId]){
          galleryResults = state.galleryData[galleryId]
        } else {
          galleryResults = await readGallery({galleryId});
        }
        const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId})
        dispatch({
          type: ETypes.setCurrentHeader,
          currentExhibitionHeader: exhibition.exhibitionTitle.value!,
        })
        const galleryData = {...galleryResults, galleryExhibitions: supplementalExhibitions}
        dispatch({
          type: ETypes.saveGallery,
          galleryData
        })

        navigation.navigate(ExhibitionRootEnum.TopTab, {exhibitionId, galleryId, internalAppRoute: true});
    } catch(error: any) {
      console.log(error)
    }
  }   

  return (

      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>
          {/* <View style={exhibitionHomeStyle.exhibitionTogglerContainer}>
            <Button icon={"weather-sunset-up"} mode="elevated" >
            <TextElement>Opening</TextElement>
            </Button>
            <Button icon={"weather-sunset-down"} mode="contained">
            <TextElement>Closing Soon</TextElement>
            </Button>
          </View> */}
          {exhibitionPreviews.map((exhibition) => 
          <View key={exhibition.exhibitionId}>
              <ExhibitionPreviewCard 
                exhibitionPreview={exhibition}
                onPressExhibition={loadExhibition}
              />
            </View>
          )}
      </ScrollView>
  );
}
