import * as Colors from '@darta-styles';
import React, {useContext} from 'react';

import {ETypes, StoreContext} from '../../state/Store';
import {headerOptions, modalHeaderOptions, viewOptionsStyles} from '../../styles/styles';
import {RecommenderRoutesEnum} from '../../typing/routes';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import { DartaRecommenderView } from '../../screens/DartaRecommenderView';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { DartaRecommenderTopTab } from './DartaRecommenderTopTab';
import {Button, IconButton} from 'react-native-paper';
import {icons} from '../../utils/constants';
import { TextElement } from '../../components/Elements/TextElement';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';

export const RecommenderStack = createStackNavigator();

export function DartaRecommenderNavigator({route} : {route: any}) {
  const {state, dispatch} = useContext(StoreContext);
  const flipOrientation = () => {
    dispatch({
      type: ETypes.setPortrait,
    });
  };
  const navigation = useNavigation();
  useDeepLinking(navigation);
  return (
    <RecommenderStack.Navigator screenOptions={{headerTintColor: Colors.PRIMARY_950}}>
        <RecommenderStack.Screen
          name={RecommenderRoutesEnum.recommenderHome}
          component={DartaRecommenderView}
          options={{...headerOptions, 
            headerTitle: 'view',
            headerLeft: () => (
              <View style={{marginLeft: 5, display: 'flex', flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center'}}>
              <IconButton
                icon={icons.screenRotation}    
                iconColor={Colors.PRIMARY_950}
                size={16}
                containerColor={Colors.PRIMARY_900}
                style={viewOptionsStyles.viewOptionsButtonStyle}
                accessibilityLabel="Flip Screen Orientation"
                testID="flipScreenButton"
                onPress={() => flipOrientation()}
               />
               <TextElement>Rotate</TextElement>
            </View>
            ),
          }}
        />
        <RecommenderStack.Screen
          name={RecommenderRoutesEnum.TopTabExhibition}
          component={DartaRecommenderTopTab}
          options={{...modalHeaderOptions, presentation: 'modal',headerTitle: state.currentArtworkTombstoneHeader ?? ""}}
        />
    </RecommenderStack.Navigator>
  );
}
