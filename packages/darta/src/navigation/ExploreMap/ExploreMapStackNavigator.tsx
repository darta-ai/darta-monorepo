import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {StoreContext} from '../../state/Store';
import {backButtonStyles, headerOptions, modalHeaderOptions} from '../../styles/styles';
import { ExploreMapRootEnum} from '../../typing/routes';
import { ExploreMapHomeScreen } from '../../screens/ExploreMap/ExploreMapHomeScreen';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { ExhibitionTopTabNavigator } from '../Exhibition/ExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { Pressable, StyleSheet, View} from 'react-native';  
import { useNavigation } from '@react-navigation/native';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import { UIStoreContext } from '../../state';
import { TextElement } from '../../components/Elements/TextElement';
import * as Colors from '@darta-styles'
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { BottomSheetNavigation } from '../../screens/ExploreMap/BottomSheetNavigation';


export const ExploreMapStack = createStackNavigator();

export function ExploreMapStackNavigator({route} : {route: any}) {
  const {uiState} = useContext(UIStoreContext);
  const navigation = useNavigation();
  return (
    <ExploreMapStack.Navigator screenOptions={{
      headerTintColor: PRIMARY_800,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
      headerBackImage: () => (
        <View style={backButtonStyles.backButton}>
          <BackButtonIcon />
        </View>
        ),
        headerBackTitleVisible: false,
      }}>
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapHome}
          component={ExploreMapHomeScreen}
          options={{...headerOptions, headerTitle: 'Visit'}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.TopTabExhibition}
          component={ExhibitionTopTabNavigator}
          initialParams={{navigationRoute: ExploreMapRootEnum.explorePastNavigator, navigateTo: ExploreMapRootEnum.individualArtwork}}
          options={{...headerOptions, headerTitle: uiState.currentExhibitionHeader ?? "",
          headerLeft: () => ( 
            <Pressable
            style={backButtonStyles.backButton}
            onPress={() => {navigation.navigate(ExploreMapRootEnum.exploreMapHome as never)}}>
              <BackButtonIcon />
            </Pressable>
          )}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.explorePastNavigator}
          component={ExhibitionTopTabNavigator}
          initialParams={{navigationRoute: ExploreMapRootEnum.explorePastNavigator, navigateTo: ExploreMapRootEnum.individualArtwork }}
          options={{...headerOptions, headerTitle: uiState.userExhibitionHeader ?? ""}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.galleryId, showPastExhibitions: true, navigationRoute: ExploreMapRootEnum.explorePastNavigator, navigateTo: ExploreMapRootEnum.individualArtwork}}
          options={{...headerOptions, headerTitle: uiState.galleryHeader ?? ""}}
        />
        <ExploreMapStack.Screen
            name={ExploreMapRootEnum.individualArtwork}
            component={ArtworkScreen}
            options={{...headerOptions, headerTitle: uiState.currentArtworkTombstoneHeader ?? ""}}
            initialParams={{saveRoute: ExploreMapRootEnum.exploreMapListAdd, addPaddingTop: true}}
          />
        <ExploreMapStack.Screen
            name={ExploreMapRootEnum.bottomSheetOptions}
            component={BottomSheetNavigation}
            options={{...headerOptions, 
              headerShown: false,
              presentation: 'transparentModal',
              headerMode: 'screen', 
              headerTitle: 'Options',
              cardStyle: {backgroundColor: 'transparent'},
            }}
          />
        <ExploreMapStack.Group screenOptions={{
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
          <ExploreMapStack.Screen
            name={ExploreMapRootEnum.exploreMapListAdd}
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
              headerBackImage: () => (
                <View style={backButtonStyles.backButton}>
                  <TextElement style={{color: Colors.PRIMARY_50}}>Cancel</TextElement>
                </View>
            ), 
          }}/>
        </ExploreMapStack.Group>
    </ExploreMapStack.Navigator>
  );
}
