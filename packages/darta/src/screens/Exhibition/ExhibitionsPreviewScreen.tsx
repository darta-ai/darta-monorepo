import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import { RefreshControl, FlatList, ScrollView, Image, View} from 'react-native';
import {
  ExhibitionNavigatorParamList,
  ExhibitionPreviewEnum,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { listExhibitionPreviewUserFollowing, listExhibitionPreviewsCurrent, listExhibitionPreviewsForthcoming} from "../../api/exhibitionRoutes";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';


import { ExhibitionPreview } from '@darta-types'
import ExhibitionPreviewCard from '../../components/Previews/ExhibitionPreviewCard';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { dartaLogo } from '../../components/User/UserInquiredArtwork';
import { ActivityIndicator } from 'react-native-paper';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';


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
  const [errorText, setErrorText] = React.useState<string>("")
  
  const sortPreviews = (exhibitionPreviews: ExhibitionPreview[]) => {
    return exhibitionPreviews.sort((a, b) => {
      if (!a.openingDate?.value || !b.openingDate?.value) return 0
      return b.openingDate?.value >= a.openingDate?.value ? 1 : -1
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


  const setExhibitionPreviewsState = () : ExhibitionPreview[] | [] => {
    const previews = determineExhibitionPreviews()
    if (previews) {
      const exhibitionPreviewsOpen: ExhibitionPreview[] = []
      const exhibitionPreviewsClosed: ExhibitionPreview[] = []

      const statePreviews = previews ? Object.values(previews) : []

      for (const preview of statePreviews) {
        if (preview?.exhibitionDuration?.value && preview.exhibitionDuration.value === "Ongoing/Indefinite"){
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
      
      return [...exhibitionPreviewsOpen, ...exhibitionPreviewsClosed]
    }
    return []
  }
  
  React.useEffect(()=> {
    const previews = setExhibitionPreviewsState()
    setExhibitionPreviews(previews)
  }, [state.userFollowsExhibitionPreviews, state.forthcomingExhibitionPreviews, state.currentExhibitionPreviews])

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
      let numberOfPreviews = 0
      switch(screenName) {
        case ExhibitionPreviewEnum.following:
          if(state.userFollowsExhibitionPreviews){
            numberOfPreviews = Object.values(state.userFollowsExhibitionPreviews).length
          }
          const userFollowingExhibitionPreviews = await listExhibitionPreviewUserFollowing({ limit: numberOfPreviews + 10 })
          if(Object.keys(userFollowingExhibitionPreviews).length > numberOfPreviews){
            dispatch({type: ETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
          }
          break;
        case ExhibitionPreviewEnum.onView:
          if(state.currentExhibitionPreviews){
            numberOfPreviews = Object.values(state.currentExhibitionPreviews).length
          } 
          const exhibitionPreviewsCurrent = await listExhibitionPreviewsCurrent({ limit: numberOfPreviews + 10 })
          if(Object.keys(exhibitionPreviewsCurrent).length > numberOfPreviews){
            dispatch({type: ETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})
          }
          break;
        case ExhibitionPreviewEnum.forthcoming:
          if(state.forthcomingExhibitionPreviews){
            numberOfPreviews = Object.values(state.forthcomingExhibitionPreviews).length
          }
          const exhibitionPreviewsForthcoming = await listExhibitionPreviewsForthcoming({ limit: numberOfPreviews + 10 })
          if(Object.keys(exhibitionPreviewsForthcoming).length > numberOfPreviews){
            dispatch({type: ETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
          }
          break
        default:
          setTimeout(() => {
            setRefreshing(false);
          }, 500)
          break;
        }
        setBottomLoad(false);
    } catch {
      setBottomLoad(false);
    } 
  }, [state.forthcomingExhibitionPreviews, state.currentExhibitionPreviews, state.userFollowsExhibitionPreviews]);


  const loadExhibition = React.useCallback(async ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => {
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
    }
  }, [])

  const loadGallery = React.useCallback(async({galleryId} : {galleryId: string}) => {
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
    }
  }, [])

  const renderItem = React.useCallback((_, data) => {
    return (
      <View key={data?.exhibitionId}>
        <ExhibitionPreviewCard 
        exhibitionPreview={data}
        onPressExhibition={loadExhibition}
        onPressGallery={loadGallery}
      />
    </View>
    );
  }, [loadExhibition, loadGallery]);


  const layoutProvider = new LayoutProvider(
    index => {
      return 'NORMAL'; // If you have multiple types of items, you can differentiate here using the index
    },
    (_, dim) => {
      dim.width = wp('100%');
      dim.height = 600;
    }
  );

  layoutProvider.shouldRefreshWithAnchoring = false;

  const renderFooter = () => {
    return bottomLoad ? (
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.PRIMARY_50 }}>
        <ActivityIndicator size={"small"} color={Colors.PRIMARY_700}/>
      </View>
    ) : null;
  };

  return (
    <>
      {exhibitionPreviews.length === 0 && (
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
        </ScrollView>      
        )}
      {exhibitionPreviews.length > 0 && (
        <View style={{flex: 1, backgroundColor: Colors.PRIMARY_50}}>
          <RecyclerListView 
          ref={(ref) => { this.flatListRef = ref }}
          dataProvider={new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(exhibitionPreviews)}
          layoutProvider={layoutProvider}
          rowRenderer={renderItem}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.PRIMARY_600}
              />
              )
            }}
          decelerationRate={0.5}
          onEndReached={onBottomLoad}
          onEndReachedThreshold={0.1}
          renderFooter={renderFooter}
          />
        </View>
    )}
  </>
  );
}
