import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { readExhibition } from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';

import { Exhibition, ExhibitionPreview, IGalleryProfileData } from '@darta-types'
import { readGallery } from '../../api/galleryRoutes';
import { ExhibitionPreviewCard } from '../../components/Previews/ExhibitionPreviewCard';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { PRIMARY_100, PRIMARY_50, PRIMARY_950 } from '@darta-styles';
import { Button } from 'react-native-paper';
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
    backgroundColor: PRIMARY_100,
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
      setExhibitionPreviews(Object.values(state?.exhibitionPreviews))
    }
  }, [])


  const loadExhibition = async ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => {
    try{
        let exhibition =  await readExhibition({exhibitionId});
        dispatch({
          type: ETypes.saveExhibition,
          exhibitionData: exhibition
        })
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
        navigation.navigate(ExhibitionRootEnum.TopTab, {exhibitionId, galleryId});
    } catch(error: any) {
      console.log(error)
    }
  }   

  return (

      <ScrollView>
        <View style={exhibitionHomeStyle.exhibitionTogglerContainer}>
          <Button icon="view-agenda-outline" mode="outlined" textColor={PRIMARY_950}>
            <TextElement style={{color: PRIMARY_950, fontSize: 12}}>All</TextElement>
          </Button>
          <Button icon="calendar-week" mode="outlined" textColor={PRIMARY_950} >
            <TextElement style={{color: PRIMARY_950, fontSize: 12}}>Openings</TextElement>
          </Button>
          <Button icon="door-open" mode="outlined" textColor={PRIMARY_950}>
            <TextElement style={{color: PRIMARY_950, fontSize: 12}}>Closing Soon</TextElement>
          </Button>
        </View>
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
