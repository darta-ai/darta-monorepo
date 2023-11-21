import * as Colors from '@darta-styles';
import React, {useContext} from 'react';

import {ETypes, StoreContext} from '../../state/Store';
import {backButtonStyles, headerOptions, viewOptionsStyles} from '../../styles/styles';
import {RecommenderRoutesEnum} from '../../typing/routes';
import {View, StyleSheet} from 'react-native';
import { DartaRecommenderView } from '../../screens/DartaRecommenderView';
import { DartaRecommenderTopTab } from './DartaRecommenderTopTab';
import { IconButton} from 'react-native-paper';
import {icons} from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';

export const RecommenderStack = createStackNavigator();




export function DartaRecommenderNavigator() {
  const {state, dispatch} = useContext(StoreContext);
  const flipOrientation = () => {
    dispatch({
      type: ETypes.setPortrait,
    });
  };
  const navigation = useNavigation();
  useDeepLinking(navigation);
  return (
    <RecommenderStack.Navigator 
      screenOptions={{
        headerTintColor: Colors.PRIMARY_950, 
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
        headerBackImage: () => (
          <View style={backButtonStyles.backButton}>
            <BackButtonIcon />
          </View>
        ), 
        headerBackTitleVisible: false,
      }}
      >
      <RecommenderStack.Screen
        name={RecommenderRoutesEnum.recommenderHome}
        component={DartaRecommenderView}
        options={{...headerOptions, 
          headerTitle: 'View',
          headerRight: () => (
            <IconButton
              icon={icons.screenRotation}    
              iconColor={Colors.PRIMARY_950}
              containerColor={Colors.PRIMARY_50}
              style={viewOptionsStyles.viewOptionsButtonStyle}
              accessibilityLabel="Flip Screen Orientation"
              testID="flipScreenButton"
              onPress={() => flipOrientation()}
            />
          ),
        }}
      />
      <RecommenderStack.Screen
        name={RecommenderRoutesEnum.TopTabExhibition}
        component={DartaRecommenderTopTab}
        options={{...headerOptions, headerTitle: state.currentArtworkTombstoneHeader ?? ""}}
      />
    </RecommenderStack.Navigator>
  );
}
