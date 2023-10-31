/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { ExploreMapStackNavigator } from './src/navigation/ExploreMap/ExploreMapStackNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import * as SecureStore from 'expo-secure-store';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DartaRecommenderNavigator } from './src/navigation/DartaRecommender/DartaRecommenderNavigator';
import { useDeepLinking } from './src/components/LinkingAndNavigation/deepLinking';

// exp://192.168.1.35:8081/--/feed/topTab/exhibition/6e02911e-b578-4962-b248-6285d412c3e3/gallery/Galleries/8501288

// npx uri-scheme open exp://192.168.1.35:8081/--/feed/exhibition/:6e02911e-b578-4962-b248-6285d412c3e3/gallery/:Galleries/8501288 --ios   
export const RecommenderStack = createStackNavigator();
export const RootStack = createMaterialBottomTabNavigator();


const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    myOwnColor: '#BADA55',
    secondaryContainer: Colors.PRIMARY_50,
    underlineColor: 'transparent', background: '#003489'
  },
};

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

  return (
    <PaperProvider theme={theme}>
      <StoreProvider>
        <NavigationContainer>
          <AnimatedAppLoader>
              <RootStack.Navigator 
              initialRouteName="explore"
              activeColor={Colors.PRIMARY_800}
              inactiveColor={Colors.PRIMARY_400}
              barStyle={{ backgroundColor: Colors.PRIMARY_200, paddingBottom: 0 }}
              >
                <RootStack.Screen
                  name="view"
                  component={DartaRecommenderNavigator}
                  options={{
                    tabBarLabel: "view",
                    tabBarIcon: ({ color, focused }) => {
                      return (
                      <MaterialCommunityIcons name="eye-circle-outline" color={color} size={focused ? 25 : 20} />
                    )}
                   }}
                />
                <RootStack.Screen
                  name="exhibitions"
                  component={ExhibitionStackNavigator}
                  options={{
                    tabBarLabel: "exhibitions",
                    tabBarIcon: ({ color, focused }) => (
                      <MaterialCommunityIcons name="home-circle-outline" color={color} size={focused ? 25 : 20} />
                    )
                  }}
                />

                  <RootStack.Screen
                    name="visit"
                    component={ExploreMapStackNavigator}
                    options={{
                      tabBarLabel: "visit",
                      tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name="map-marker-circle" color={color} size={focused ? 25 : 20} />
                      )
                    }}
                  />
                <RootStack.Screen
                  name="you"
                  component={UserStackNavigator}
                  options={{
                    tabBarLabel: "you",
                    tabBarIcon: ({ color, focused }) => (
                      <MaterialCommunityIcons name="account-circle-outline" color={color} size={focused ? 25 : 20} />
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
