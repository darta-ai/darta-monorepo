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
import { ExhibitionPreviewCard } from '../../components/Previews/ExhibitionPreviewCard';
import * as Colors from '@darta-styles';


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
  const [exhibitionPreviews, setExhibitionPreviews] = React.useState<ExhibitionPreview[]>([])
  const [numberOfPreviews, setNumberOfPreviews] = React.useState<number>(0)
  
  const sortPreviews = (exhibitionPreviews: ExhibitionPreview[]) => {
    return exhibitionPreviews.sort((a, b) => {
      return a.closingDate >= b.closingDate ? 1 : -1
    })
  }

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


  const loadExhibition = async ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => {
    try{
        if (!exhibitionId || !galleryId) return
        navigation.navigate(ExhibitionRootEnum.TopTab, {exhibitionId, galleryId, internalAppRoute: true});
    } catch(error: any) {
      console.log(error)
    }
  }   

  return (
    <>
      <FlatList 
        data={exhibitionPreviews}
        keyExtractor={(item) => item.exhibitionId}
        renderItem={({item}) => (
            <ExhibitionPreviewCard 
              exhibitionPreview={item}
              onPressExhibition={loadExhibition}
            />
          )}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.1}
        onEndReached={onBottomLoad}
        refreshing={bottomLoad}
        style={{backgroundColor: Colors.PRIMARY_100}}
        />
    </>
  );
}
