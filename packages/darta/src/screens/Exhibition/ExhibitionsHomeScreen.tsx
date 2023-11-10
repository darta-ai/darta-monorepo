import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import { RefreshControl, FlatList} from 'react-native';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { listAllExhibitionsPreviewsForUser } from "../../api/exhibitionRoutes";


import { ExhibitionPreview } from '@darta-types'
import ExhibitionPreviewCard from '../../components/Previews/ExhibitionPreviewCard';
import * as Colors from '@darta-styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

type ExhibitionHomeScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionHome
>;

// To be deprecated
export function ExhibitionsHomeScreen({
  navigation,
}: {
  navigation: ExhibitionHomeScreenNavigationProp;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const [exhibitionPreviews, setExhibitionPreviews] = React.useState<ExhibitionPreview[]>([])
  const [numberOfPreviews, setNumberOfPreviews] = React.useState<number>(0)
  
  const sortPreviews = (exhibitionPreviews: ExhibitionPreview[]) => {
    return exhibitionPreviews.sort((a, b) => {
      return a.closingDate >= b.closingDate ? 1 : -1
    })
  }
  

  const requestReview = async () => {
    try {
      // Check if the device is able to review
      const isAvailable = await StoreReview.isAvailableAsync();
      if (!isAvailable) {
        return;
      }
  
      // Get the number of app opens from AsyncStorage
      const appOpens = await AsyncStorage.getItem('appOpens');
      const opens = appOpens ? parseInt(appOpens) : 0;
  
      // Define the number of opens required before showing the review prompt
      const opensRequired = 5;
  
      if (opens >= opensRequired) {
        // Show the review prompt
        StoreReview.requestReview();
        // Reset the app opens counter
        await AsyncStorage.setItem('appOpens', '0');
      } else {
        // Increase the app opens counter
        await AsyncStorage.setItem('appOpens', (opens + 1).toString());
      }
    } catch (error) {
      console.error('Error requesting store review:', error);
    }
  };

  React.useEffect(() => {
    requestReview();
  }, []);

  
  React.useEffect(()=> {
    if (state.exhibitionPreviews) {
      const exhibitionPreviewsOpen: ExhibitionPreview[] = []
      const exhibitionPreviewsClosed: ExhibitionPreview[] = []

      for (const preview of Object.values(state.exhibitionPreviews)) {
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
    
      setNumberOfPreviews(Object.values(state?.exhibitionPreviews).length)
    }
  }, [state.exhibitionPreviews])

  const [refreshing, setRefreshing] = React.useState(false);
  const [bottomLoad, setBottomLoad] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const exhibitionPreviews = await listAllExhibitionsPreviewsForUser({limit: 10})
      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})

    } catch {
        setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500)
  }, []);

  const onBottomLoad = React.useCallback(async () => {
    setBottomLoad(true);
    try{
      const newLimit = numberOfPreviews + 10
      const exhibitionPreviews = await listAllExhibitionsPreviewsForUser({limit: newLimit})
      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})
    } catch {
      setBottomLoad(false);
    } finally {
      setBottomLoad(false);
    }
  }, []);


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
      console.log(error)
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
      console.log(error)
    }
  }, [])

  return (
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
  );
}
