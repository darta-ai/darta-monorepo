import * as Colors from '@darta-styles';
import React, {useContext} from 'react';

import {ETypes, StoreContext} from '../../state/Store';
import {backButtonStyles, headerOptions, viewOptionsStyles} from '../../styles/styles';
import {RecommenderRoutesEnum} from '../../typing/routes';
import {View } from 'react-native';
import { DartaRecommenderView } from '../../screens/DartaRecommenderView';
import { DartaRecommenderTopTab } from './DartaRecommenderTopTab';
import { IconButton} from 'react-native-paper';
import {icons} from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { TextElement } from '../../components/Elements/TextElement';

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
        <RecommenderStack.Group>
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
        </RecommenderStack.Group>
        <RecommenderStack.Group screenOptions={{
              presentation: 'transparentModal',
              cardStyle: {backgroundColor: 'transparent'},
            }}>
            <RecommenderStack.Screen
              name={RecommenderRoutesEnum.recommenderLists}
              component={AddToListScreen}
              options={{ 
                headerMode: 'float', 
                cardStyle: {opacity: 1, margin:0, backgroundColor: 'transparent', width: '100%'}, 
                headerTitle: 'Add to list',
                headerTintColor: Colors.PRIMARY_50,
                headerStyle: {
                  backgroundColor: Colors.PRIMARY_950, 
                  opacity: 0.9,
                },
                headerBackImage: () => (
                  <View style={backButtonStyles.backButton}>
                    <TextElement style={{color: Colors.PRIMARY_50}}>Cancel</TextElement>
                  </View>
              ), 
            }}/>
          </RecommenderStack.Group>
    </RecommenderStack.Navigator>
  );
}
