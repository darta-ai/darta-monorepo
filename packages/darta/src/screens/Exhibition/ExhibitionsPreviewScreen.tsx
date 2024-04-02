import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import { RefreshControl, ScrollView, View} from 'react-native';
import {
  ExhibitionNavigatorParamList,
  ExhibitionPreviewEnum,
  ExhibitionRootEnum
} from '../../typing/routes';
import { UIStoreContext, UiETypes, GalleryStoreContext, ExhibitionStoreContext, ExhibitionETypes} from '../../state';
import { listExhibitionPreviewUserFollowing, listExhibitionPreviewsCurrent, listExhibitionPreviewsForthcoming} from "../../api/exhibitionRoutes";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';


import { ExhibitionPreview } from '@darta-types'
import ExhibitionPreviewCard from '../../components/Previews/ExhibitionPreviewCard';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { ActivityIndicator, Badge } from 'react-native-paper';
import { RecyclerListView, LayoutProvider, DataProvider, ContextProvider } from 'recyclerlistview';


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
  const {exhibitionState, exhibitionDispatch} = React.useContext(ExhibitionStoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);
  const {galleryState} = React.useContext(GalleryStoreContext);

  const [exhibitionPreviews, setExhibitionPreviews] = React.useState<ExhibitionPreview[]>([])
  const [errorHeader, setErrorHeader] = React.useState<string>("")
  const [errorText, setErrorText] = React.useState<string>("")
  
  const sortPreviews = (newPreviews: ExhibitionPreview[]) => {
    if(route.params?.type === "Upcoming"){
      return newPreviews.sort((a, b) => {
        if (!a.openingDate?.value || !b.openingDate?.value) return 0
        return b.openingDate?.value >= a.openingDate?.value ? -1 : 1
      })
    }
    const previous = exhibitionPreviews;
    const previousIds = previous.reduce((acc, el) => ({...acc, [el?.exhibitionId] : true} ), {});
    let current: ExhibitionPreview[] = [];
    current = newPreviews.filter(el => !previousIds[el.exhibitionId]).sort((a, b) => {
        if (!a.openingDate?.value || !b.openingDate?.value) return 0
        return new Date(b.openingDate?.value).toISOString() >= new Date(a.openingDate?.value).toISOString() ? -1 : 1
      })
    return [...previous, ...current]
  }

  const determineExhibitionPreviews = () => {

    const screenName = route.name
    switch(screenName) {
      case ExhibitionPreviewEnum.following:
        setErrorHeader('No exhibitions to show')
        setErrorText('Follow more galleries to see their exhibitions here.')
        return exhibitionState.userFollowsExhibitionPreviews
      case ExhibitionPreviewEnum.onView:
        setErrorHeader('No exhibitions to show')
        setErrorText('When more exhibitions are on display you will see them here.')
        return exhibitionState.currentExhibitionPreviews
      case ExhibitionPreviewEnum.forthcoming:
        setErrorHeader('No exhibitions to show')
        setErrorText('When upcoming exhibitions are available you will see them here.')
        return exhibitionState.forthcomingExhibitionPreviews
      default:
        return exhibitionState.exhibitionPreviews
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

  const [dataProvider, setDataProvider] = React.useState(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]));
  
  React.useEffect(()=> {
    const previews = setExhibitionPreviewsState()
    setExhibitionPreviews(previews)
    setDataProvider(dataProvider.cloneWithRows(previews))
  }, [exhibitionState.userFollowsExhibitionPreviews, exhibitionState.forthcomingExhibitionPreviews, exhibitionState.currentExhibitionPreviews])

  const [refreshing, setRefreshing] = React.useState(false);
  const [bottomLoad, setBottomLoad] = React.useState(false);
  // const [dataProvider, setDataProvider] = React.useState(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]));

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
    const screenName = route.name
    switch(screenName) {
      case ExhibitionPreviewEnum.following:
        const userFollowingExhibitionPreviews = await listExhibitionPreviewUserFollowing({ limit: 10 })
        exhibitionDispatch({type: ExhibitionETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
      case ExhibitionPreviewEnum.onView:
        const exhibitionPreviewsForthcoming = await listExhibitionPreviewsForthcoming({ limit: 10 })
        exhibitionDispatch({type: ExhibitionETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
      case ExhibitionPreviewEnum.forthcoming:
        const exhibitionPreviewsCurrent = await listExhibitionPreviewsCurrent({ limit: 10 })
        exhibitionDispatch({type: ExhibitionETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})
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
          if(exhibitionState.userFollowsExhibitionPreviews){
            numberOfPreviews = Object.values(exhibitionState.userFollowsExhibitionPreviews).length
          }
          const userFollowingExhibitionPreviews = await listExhibitionPreviewUserFollowing({ limit: numberOfPreviews + 10 })
          if(Object.keys(userFollowingExhibitionPreviews).length > numberOfPreviews){
            exhibitionDispatch({type: ExhibitionETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
          }
          break;
        case ExhibitionPreviewEnum.onView:
          if(exhibitionState.currentExhibitionPreviews){
            numberOfPreviews = Object.values(exhibitionState.currentExhibitionPreviews).length
          } 
          const exhibitionPreviewsCurrent = await listExhibitionPreviewsCurrent({ limit: numberOfPreviews + 10 })
          if(Object.keys(exhibitionPreviewsCurrent).length > numberOfPreviews){
            exhibitionDispatch({type: ExhibitionETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})
          }
          break;
        case ExhibitionPreviewEnum.forthcoming:
          if(exhibitionState.forthcomingExhibitionPreviews){
            numberOfPreviews = Object.values(exhibitionState.forthcomingExhibitionPreviews).length
          }
          const exhibitionPreviewsForthcoming = await listExhibitionPreviewsForthcoming({ limit: numberOfPreviews + 10 })
          if(Object.keys(exhibitionPreviewsForthcoming).length > numberOfPreviews){
            exhibitionDispatch({type: ExhibitionETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
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
  }, [exhibitionState.forthcomingExhibitionPreviews, exhibitionState.currentExhibitionPreviews, exhibitionState.userFollowsExhibitionPreviews]);


  const loadExhibition = React.useCallback(async ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => {
    if (exhibitionState.exhibitionData && !exhibitionState.exhibitionData[exhibitionId]) {
      uiDispatch({
        type: UiETypes.setCurrentHeader,
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
    if (galleryState.galleryData && !galleryState.galleryData[galleryId]) {
      uiDispatch({
        type: UiETypes.setGalleryHeader,
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
      <View key={data?.exhibitionId} ref={data?.exhibitionId}>
        <ExhibitionPreviewCard 
        exhibitionPreview={data}
        onPressExhibition={loadExhibition}
        onPressGallery={loadGallery}
        userViewed={exhibitionState.userViewedExhibition[data?.exhibitionId] || data.userViewed ? true : false}
      />
    </View>
    );
  }, [loadExhibition, loadGallery, exhibitionState.userViewedExhibition]);


  const layoutProvider = new LayoutProvider(
    index => {
      return index; // If you have multiple types of items, you can differentiate here using the index
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
          backgroundColor: Colors.PRIMARY_50,
        }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          margin: 24,
          flexDirection: 'column',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_950} onRefresh={onRefresh} />}>  
          <TextElement style={{ fontFamily: 'DMSans_700Bold', fontSize: 24 }}>{errorHeader}</TextElement>
          <TextElement style={{fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950}}>{errorText}</TextElement>

        </ScrollView>      
        )}
      {exhibitionPreviews.length > 0 && (
        <View style={{flex: 1, backgroundColor: Colors.PRIMARY_50}}>
          <RecyclerListView 
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={renderItem}
          decelerationRate={0.5}
          onEndReached={onBottomLoad}
          onEndReachedThreshold={0.1}
          renderFooter={renderFooter}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.PRIMARY_600}
              />
              )
            }}
          />
        </View>
    )}
  </>
  );
}
