import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {backButtonStyles, headerOptions} from '../../styles/styles';
import { ExploreMapRootEnum } from '../../typing/routes';
import { ExploreMapHomeScreen } from '../../screens/ExploreMap/ExploreMapHomeScreen';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { ExhibitionTopTabNavigator } from '../Exhibition/ExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { Pressable, View} from 'react-native';  
import { useNavigation } from '@react-navigation/native';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import { UIStoreContext } from '../../state';
import { TextElement } from '../../components/Elements/TextElement';
import * as Colors from '@darta-styles'
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { PlanARoute } from '../../screens/ExploreMap/PlanARoute';

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
      }}
      initialRouteName={ExploreMapRootEnum.exploreMapHome}
      >
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
            component={PlanARoute}
            options={{...headerOptions, 
              headerMode: 'screen', 
              headerTitle: 'Plan A Route',
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
          {/* <ExploreMapStack.Screen
            name={ExploreMapRootEnum.genericLoadingExploreMap}
            component={GenericLoadingScreen}
            options={{...headerOptions, 
            headerLeft: () => ( 
              <View style={backButtonStyles.backButton}>
                <HeaderBackButton 
                  backImage={() => <BackButtonIcon />}
                  labelVisible={false}
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0, // sets the active route index
                        routes: [
                          { name: ExploreMapRootEnum.exploreMapHome}, // the only route in the stack after reset
                        ],
                      })
                    );
                  }}
                  tintColor={PRIMARY_800}
                />
              </View>
            )
            }}
          /> */}
          {/* <ExploreMapStack.Screen
            name={ExploreMapRootEnum.qrRouterExploreMap}
            component={ExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: uiState.currentExhibitionHeader ?? "", 
            headerRight: () => (
              <IconButton 
                icon={"export-variant"}
                iconColor={Colors.PRIMARY_950}
                style={viewOptionsStyles.viewOptionsButtonStyle}
                onPress={() => shareExhibition()}
              />
            ),
            headerLeft: () => ( 
              <Pressable
              style={backButtonStyles.backButton}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0, // sets the active route index
                    routes: [
                      { name: ExhibitionRootEnum.exhibitionHome }, // the only route in the stack after reset
                    ],
                  })
                );
              }}>
                <BackButtonIcon />
              </Pressable>
            )
            }}
          /> */}
          {/* <ExploreMapStack.Screen
              name={ExploreMapRootEnum.exploreRouterFullList}
              component={ListTopTab}
              initialParams= {{
                navigateToGalleryParams: ExploreMapRootEnum.exploreMapGallery,
              }}
              options={{
                headerTintColor: Colors.PRIMARY_950,
                headerStyle: {
                  backgroundColor: Colors.PRIMARY_50, 
                }, 
                headerBackImage: () => (
                  <View style={backButtonStyles.backButton}>
                    <SVGs.BackButtonIcon />
                  </View>
              ), 
              headerTitle: uiState.listHeader ?? ""}}
            /> */}
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
