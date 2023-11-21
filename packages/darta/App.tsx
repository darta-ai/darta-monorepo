/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { ExploreMapStackNavigator } from './src/navigation/ExploreMap/ExploreMapStackNavigator';
import { StatusBar } from 'react-native';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import * as Colors from '@darta-styles';

import {
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {ExhibitionStackNavigator} from './src/navigation/Exhibition/ExhibitionStackNavigator';
import {UserStackNavigator} from './src/navigation/User/UserStackNavigator';
import {ETypes, StoreContext, StoreProvider} from './src/state/Store';

import * as SplashScreen from 'expo-splash-screen';
import {AnimatedAppLoader} from './src/screens/SplashScreen/SplashScreen';

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DartaRecommenderNavigator } from './src/navigation/DartaRecommender/DartaRecommenderNavigator';
import * as SVGs from './src/assets/SVGs';
import { ExhibitionRootEnum, ExploreMapRootEnum, PreviousExhibitionRootEnum, RecommenderRoutesEnum, UserRoutesEnum, ExhibitionPreviewEnum} from './src/typing/routes';
export const RecommenderStack = createStackNavigator();
export const RootStack = createMaterialBottomTabNavigator();


function App() {
  const {dispatch} = React.useContext( StoreContext );
  React.useEffect(() => {
    auth().onAuthStateChanged((userState: FirebaseAuthTypes.User | null) => {
      if (userState?.uid && userState.email) {
        dispatch({
          type: ETypes.setUser,
          userData: {
            uid: userState.uid,
            email: userState.email,
          }
        })
      } else{
        dispatch({
          type: ETypes.setUser,
          userData: {
            uid: "",
            email: "",
          }
        })
      }
      })
  }, []);



  try{
    useFonts({
      DMSans_400Regular,
      DMSans_400Regular_Italic,
      DMSans_500Medium,
      DMSans_500Medium_Italic,
      DMSans_700Bold,
      DMSans_700Bold_Italic,
    });
  } catch{
    console.log("error loading fonts")
  }


  const theme = {
    ...DefaultTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
      ...DefaultTheme.colors,
      myOwnColor: '#BADA55',
      secondaryContainer: Colors.PRIMARY_50,
      underlineColor: 'transparent', 
      background: Colors.PRIMARY_50,
    },
  };

  const [isTabVisible, setIsTabVisible] = React.useState(true);

  function getActiveRouteName(state) {
    const route = state.routes[state.index];
    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state);
    }
    return route.name;
  }
  

  const handleNavigationChange = (state) => {
    // Find the current active route
    const route = getActiveRouteName(state);
    // Based on the route, decide whether to show or hide the tab bar
    const hideTabBarRoutes = [
      RecommenderRoutesEnum.TopTabExhibition, 
      RecommenderRoutesEnum.recommenderDetails, 
      RecommenderRoutesEnum.recommenderExhibition, 
      RecommenderRoutesEnum.recommenderGallery,
      ExhibitionRootEnum.individualArtwork,
      ExploreMapRootEnum.individualArtwork,
      UserRoutesEnum.SavedArtworkModal,
      UserRoutesEnum.UserGalleryAndArtwork,
      UserRoutesEnum.UserPastTopTabNavigator,
      UserRoutesEnum.UserGallery,
      PreviousExhibitionRootEnum.artworkList,
      PreviousExhibitionRootEnum.exhibitionDetails,
    ];
    const showTabBarRoutes = {
      [RecommenderRoutesEnum.recommenderHome]: true,
      [ExhibitionRootEnum.exhibitionHome]: true,
      [ExhibitionPreviewEnum.onView]: true,
      [ExhibitionPreviewEnum.following]: true,
      [ExhibitionPreviewEnum.forthcoming]: true,
      [ExploreMapRootEnum.exploreMapHome]: true,
      [ExhibitionRootEnum.exhibitionDetails]: true,
      [ExhibitionRootEnum.exhibitionGallery]: true,
      [ExhibitionRootEnum.artworkList]: true,
      [ExploreMapRootEnum.exploreMapGallery]: true, 
      [UserRoutesEnum.home]: true,
      [UserRoutesEnum.userSavedArtwork]: true,
      [UserRoutesEnum.userInquiredArtwork]: true,
      [UserRoutesEnum.UserGalleryAndArtwork]: true,
      [UserRoutesEnum.UserPastTopTabNavigator]: true,
      [UserRoutesEnum.UserGallery]: true,
    }
    setIsTabVisible(showTabBarRoutes[route]);
  };

   return (
      <PaperProvider theme={theme}>
        <StoreProvider>
          <NavigationContainer onStateChange={handleNavigationChange}>
            <AnimatedAppLoader>
              <StatusBar barStyle="dark-content" />
                <RootStack.Navigator 
                initialRouteName="explore"
                activeColor={Colors.PRIMARY_950}
                inactiveColor={Colors.PRIMARY_300}
                backBehavior={'order'}
                barStyle={{ backgroundColor: Colors.PRIMARY_50, paddingBottom: 0, display: isTabVisible ? 'flex' : 'none'}}
                
                labeled={true} // This ensures labels are shown
                >
                  <RootStack.Screen
                    name="View"
                    component={DartaRecommenderNavigator}
                    options={{
                      tabBarLabel: "View",
                      tabBarIcon: ({ focused }) => {
                        return (
                        focused ? <SVGs.ViewFocusedIcon /> : <SVGs.ViewUnfocusedIcon />
                      )},
                    }}
                  />
                  <RootStack.Screen
                    name="exhibitions"
                    component={ExhibitionStackNavigator}
                    options={{
                      tabBarLabel: "Exhibitions",
                      tabBarIcon: ({ focused }) => (
                        focused ? <SVGs.PaletteFocusedIcon /> : <SVGs.PaletteUnfocusedIcon />
                      )
                    }}
                  />
                    <RootStack.Screen
                      name="Visit"
                      component={ExploreMapStackNavigator}
                      options={{
                        tabBarLabel: "Visit",
                        tabBarIcon: ({ focused }) => (
                          focused ? <SVGs.VisitFocusedIcon /> : <SVGs.VisitUnfocusedIcon />
                        )
                      }}
                    />
                  <RootStack.Screen
                    name="Profile"
                    component={UserStackNavigator}
                    options={{
                      tabBarLabel: "Profile",
                      tabBarIcon: ({ focused }) => (
                        focused ? <SVGs.ProfileFocusedIcon /> : <SVGs.ProfileUnfocusedIcon />
                      )
                    }}
                  />
                </RootStack.Navigator>
              </AnimatedAppLoader>  
            </NavigationContainer>
          </StoreProvider>
        </PaperProvider>
    );
}

export default App;
