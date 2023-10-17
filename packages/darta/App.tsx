/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { ExploreMapStackNavigator } from './src/navigation/ExploreMap/ExploreMapStackNavigator';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';

import {TabBarElement} from './src/components/Elements/TabBarElement';
import {ExhibitionStackNavigator} from './src/navigation/Exhibition/ExhibitionStackNavigator';
import {UserStackNavigator} from './src/navigation/User/UserStackNavigator';
import {ETypes, StoreContext, StoreProvider} from './src/state/Store';
import {footerColors, footerOptions} from './src/styles/styles';
import * as Linking from "expo-linking";
import {RootStackEnum, ExhibitionRootEnum } from './src/typing/routes'

import * as SplashScreen from 'expo-splash-screen';
import {AnimatedAppLoader} from './src/screens/SplashScreen/SplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import * as SecureStore from 'expo-secure-store';

export const RecommenderStack = createStackNavigator();
export const RootStack = createBottomTabNavigator();
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DartaRecommenderView } from './src/screens/DartaRecommenderView';
import { DartaRecommenderNavigator } from './src/navigation/DartaRecommender/DartaRecommenderNavigator';

// exp://192.168.1.35:8081/--/feed/topTab/exhibition/6e02911e-b578-4962-b248-6285d412c3e3/gallery/Galleries/8501288

// npx uri-scheme open exp://192.168.1.35:8081/--/feed/exhibition/:6e02911e-b578-4962-b248-6285d412c3e3/gallery/:Galleries/8501288 --ios   
const prefix = Linking.createURL("/");
const linking: any = {
  prefixes: [prefix],
  config: {
    screens: {
      [RootStackEnum.feed]: {
        path: 'feed',
        screens: {
          [ExhibitionRootEnum.TopTab]: 'qrRouter/:locationId'
          },
        },
    }
  }
}

function App() {
  const {state, dispatch} = React.useContext( StoreContext );

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
    <PaperProvider>
      <StoreProvider>
        <NavigationContainer
          linking={linking}
        >
          <AnimatedAppLoader>
              <RootStack.Navigator screenOptions={{headerShown: false}}>
                <RootStack.Group>
                <RootStack.Screen
                  name={RootStackEnum.feed}
                  component={ExhibitionStackNavigator}
                  options={{
                    tabBarIcon: ({focused}: {focused: any}) => (
                      <TabBarElement
                        focused={focused}
                        icon="home-group"
                        colors={footerColors}
                      />
                    ),
                    ...footerOptions,
                  }}
                />
                <RootStack.Screen
                  name={RootStackEnum.darta}
                  component={DartaRecommenderNavigator}
                  options={{
                    tabBarIcon: ({focused}: {focused: any}) => (
                      <TabBarElement
                        focused={focused}
                        icon="arrow-decision-outline"
                        colors={footerColors}
                      />
                    ),
                    ...footerOptions,
                  }}
                />
                  <RootStack.Screen
                    name={RootStackEnum.explore}
                    component={ExploreMapStackNavigator}
                    options={{
                      tabBarIcon: ({focused}: {focused: any}) => (
                        <TabBarElement
                          focused={focused}
                          icon="map-marker-radius-outline"
                          colors={footerColors}
                        />
                      ),
                      ...footerOptions,
                    }}
                  />
                <RootStack.Screen
                  name={RootStackEnum.me}
                  component={UserStackNavigator}
                  options={{
                    tabBarIcon: ({focused}: {focused: any}) => (
                      <TabBarElement
                        focused={focused}
                        icon="account-box-outline"
                        colors={footerColors}
                      />
                    ),
                    ...footerOptions,
                  }}
                />
                </RootStack.Group>
              </RootStack.Navigator>
            </AnimatedAppLoader>  
          </NavigationContainer>
        </StoreProvider>
      </PaperProvider>
  );
}

export default App;
