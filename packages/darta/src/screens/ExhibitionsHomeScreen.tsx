import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {PRIMARY_BLUE, PRIMARY_MILK} from '@darta-styles';
import {imagePrefetch} from '../utils/functions';
import {GalleryPreview} from '../components/Previews/GalleryPreview';
import {TextElement} from '../components/Elements/_index';
import {days, today} from '../utils/constants';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../typing/routes';
import {ETypes, StoreContext} from '../state/Store';
import { SSDartaHome } from '../styles/styles';
import { readExhibition } from '../api/exhibitionRoutes';
import {Exhibition} from '@darta-types'

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
  const [isLoadingDict, setIsLoadingDict] = useState<boolean>(false);

  const loadExhibition = async () => {
    try{
        const results = await readExhibition({exhibitionId: 'Exhibitions/ba99e53d-29c0-49dd-9c5f-8761fb5655c'});
        dispatch({
            type: ETypes.saveExhibition,
            exhibitionData: results,
        })
        // TO-DO, save artwork to artworkData object in state
        navigation.navigate(ExhibitionRootEnum.exhibitionDetails, {
            exhibition: results
        });
    } catch(error: any) {
      console.log(error)
    }
}   

  return (
    <View style={SSDartaHome.container}>
      <View>
        <TouchableOpacity
          onPress={async () => {
            await loadExhibition()
          }}
          style={{marginLeft: hp('1%'), marginRight: hp('1%')}}>
                <View >
                    <TextElement>Exhibition Preview</TextElement>
                    <GalleryPreview 
                        exhibitionHeroImage="http://localhost:9000/exhibitions/251317fd-a181-4523-b1f8-55423796fe9b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dvaeTqeXGMAl0hdf%2F20230924%2Fus-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230924T194834Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=dcc7085c88228fba9f2a5f012f6f77f35509dbf25897a1c1efbba9decb6ed58a"
                        exhibitionTitle
                        exhibitionGallery
                        exhibitionDates
                        exhibitionLocationData
                    />
                </View>
            {/* // To-Do: add element for exhibition */}
              <TextElement>click me</TextElement>
        </TouchableOpacity>
      </View>
    </View>
  );
}
