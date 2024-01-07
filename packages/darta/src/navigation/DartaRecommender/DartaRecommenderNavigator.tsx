import * as Colors from '@darta-styles';
import React from 'react';

import { UIStoreContext} from '../../state';
import {backButtonStyles, headerOptions} from '../../styles/styles';
import {RecommenderRoutesEnum} from '../../typing/routes';
import {View } from 'react-native';
import { DartaRecommenderTopTab } from './DartaRecommenderTopTab';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { TextElement } from '../../components/Elements/TextElement';
import { DartaRecommenderViewFlatList } from '../../screens/DartaRecommenderViewFlatList';

export const RecommenderStack = createStackNavigator();
export function DartaRecommenderNavigator() {
  const {uiState} = React.useContext(UIStoreContext);

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
            component={DartaRecommenderViewFlatList}
            options={{...headerOptions, 
              headerTitle: 'View'
            }}
          />
          <RecommenderStack.Screen
            name={RecommenderRoutesEnum.TopTabExhibition}
            component={DartaRecommenderTopTab}
            options={{...headerOptions, headerTitle: uiState.currentArtworkTombstoneHeader ?? ""}}
          />
        </RecommenderStack.Group>
        <RecommenderStack.Group screenOptions={{
              presentation: 'transparentModal',
              cardStyle: {backgroundColor: 'transparent'},
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
              },
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
