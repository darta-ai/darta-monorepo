import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import { RefreshControl, FlatList, ScrollView, Image} from 'react-native';
import {
  ExhibitionNavigatorParamList,
  ExhibitionPreviewEnum,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { listExhibitionPreviewUserFollowing, listExhibitionPreviewsCurrent, listExhibitionPreviewsForthcoming} from "../../api/exhibitionRoutes";

import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import { ExhibitionPreview } from '@darta-types'
import { ExhibitionPreviewCard } from '../../components/Previews/ExhibitionPreviewCard';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { dartaLogo } from '../../components/User/UserInquiredArtwork';


type ExhibitionHomeScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionHome
>;

export function ExhibitionPreviewScreen({
  navigation,
  route,
}: {
  navigation: ExhibitionHomeScreenNavigationProp;
  route: any;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const [exhibitionPreviews, setExhibitionPreviews] = React.useState<ExhibitionPreview[]>([])
  const [numberOfPreviews, setNumberOfPreviews] = React.useState<number>(0)
  const [errorText, setErrorText] = React.useState<string>("")
  
  const sortPreviews = (exhibitionPreviews: ExhibitionPreview[]) => {
    return exhibitionPreviews.sort((a, b) => {
      return a.closingDate >= b.closingDate ? 1 : -1
    })
  }

  const determineExhibitionPreviews = () => {

    const screenName = route.name
    switch(screenName) {
      case ExhibitionPreviewEnum.following:
        setErrorText('No exhibitions to show. Follow more galleries to see their exhibitions here.')
        return state.userFollowsExhibitionPreviews
      case ExhibitionPreviewEnum.onView:
        setErrorText('No exhibitions to show. When more exhibitions are on display you will see them here.')
        return state.currentExhibitionPreviews
      case ExhibitionPreviewEnum.forthcoming:
        setErrorText('No exhibitions to show. When future exhibitions are available you will see them here.')
        return state.forthcomingExhibitionPreviews
      default:
        return state.exhibitionPreviews
    }
  }


  
  React.useEffect(()=> {
    const previews = determineExhibitionPreviews()
    if (previews) {
      const exhibitionPreviewsOpen: ExhibitionPreview[] = []
      const exhibitionPreviewsClosed: ExhibitionPreview[] = []

      for (const preview of Object.values(previews)) {
        if (preview.exhibitionDuration.value && preview.exhibitionDuration.value === "Ongoing/Indefinite"){
          break
        }
        else if (preview?.closingDate?.value && preview.closingDate.value >= new Date().toISOString()) {
          exhibitionPreviewsOpen.push(preview)
        } else {
          exhibitionPreviewsClosed.push(preview)
        }
      }

      sortPreviews(exhibitionPreviewsOpen)
      sortPreviews(exhibitionPreviewsClosed)
      
      setExhibitionPreviews([...exhibitionPreviewsOpen, ...exhibitionPreviewsClosed])
    
      setNumberOfPreviews(Object.values(exhibitionPreviews).length)
    }
  }, [state.userFollowsExhibitionPreviews, state.exhibitionPreviews, state.forthcomingExhibitionPreviews])

  const [refreshing, setRefreshing] = React.useState(false);
  const [bottomLoad, setBottomLoad] = React.useState(false);


  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
    const screenName = route.name
    switch(screenName) {
      case ExhibitionPreviewEnum.following:
        const userFollowingExhibitionPreviews = await listExhibitionPreviewUserFollowing({ limit: 10 })
        dispatch({type: ETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
      case ExhibitionPreviewEnum.onView:
        const exhibitionPreviewsForthcoming = await listExhibitionPreviewsForthcoming({ limit: 10 })
        dispatch({type: ETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
      case ExhibitionPreviewEnum.forthcoming:
        const exhibitionPreviewsCurrent = await listExhibitionPreviewsCurrent({ limit: 10 })
        dispatch({type: ETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})
      default:
        setTimeout(() => {
          setRefreshing(false);
        }, 500)
      }
    } catch {
        setRefreshing(false);
    } finally { 
      setRefreshing(false);
    }

  }, []);

  const onBottomLoad = React.useCallback(async () => {
    setBottomLoad(true);
    try{
      const screenName = route.name
      const newLimit = numberOfPreviews + 10
      console.log(numberOfPreviews)
      switch(screenName) {
        case ExhibitionPreviewEnum.following:
          const userFollowingExhibitionPreviews = await listExhibitionPreviewUserFollowing({ limit: newLimit })
          dispatch({type: ETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
        case ExhibitionPreviewEnum.onView:
          const exhibitionPreviewsForthcoming = await listExhibitionPreviewsForthcoming({ limit: newLimit })
          dispatch({type: ETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
        case ExhibitionPreviewEnum.forthcoming:
          const exhibitionPreviewsCurrent = await listExhibitionPreviewsCurrent({ limit: newLimit })
          dispatch({type: ETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})
        default:
          setTimeout(() => {
            setRefreshing(false);
          }, 500)
        }
    } catch {
      setBottomLoad(false);
    } finally {
      setBottomLoad(false);
    }
  }, []);


  const loadExhibition = async ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => {
    if (state.exhibitionData && !state.exhibitionData[exhibitionId]) {
      dispatch({
        type: ETypes.setCurrentHeader,
        currentExhibitionHeader: ""
      })
    }
    
    try{
        if (!exhibitionId || !galleryId) return
        navigation.navigate(ExhibitionRootEnum.TopTab, {exhibitionId, galleryId, internalAppRoute: true});
    } catch(error: any) {
      console.log(error)
    }
  }   

  const loadGallery = async ({galleryId} : {galleryId: string}) => {
    if (state.galleryData && !state.galleryData[galleryId]) {
      dispatch({
        type: ETypes.setGalleryHeader,
        galleryHeader: ""
      })
    }
    try{
        if (!galleryId) return
        navigation.navigate(ExhibitionRootEnum.showGallery, {galleryId});
    } catch(error: any) {
      console.log(error)
    }
  }

  return (
    <>
      {exhibitionPreviews.length === 0 ?  (
        <ScrollView 
        style={{
          height: hp('40%'),
          width: '100%',
          backgroundColor: Colors.PRIMARY_600,
        }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>  
          <Image 
            source={require('../../assets/dartahousewhite.png')}
            style={dartaLogo.image}
          />
          <TextElement style={{margin: 5, color: Colors.PRIMARY_50}}>{errorText}</TextElement>
        </ScrollView>      ) 
      : 
    (
      <FlatList 
      data={exhibitionPreviews}
      keyExtractor={(item) => item.exhibitionId}
      renderItem={({item}) => (
        <ExhibitionPreviewCard 
            exhibitionPreview={item}
            onPressExhibition={loadExhibition}
            onPressGallery={loadGallery}
          />
        )}
      refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}
      onEndReachedThreshold={0.1}
      onEndReached={onBottomLoad}
      refreshing={bottomLoad}
      style={{backgroundColor: Colors.PRIMARY_100}}
      />
    )}
  </>
  );
}
