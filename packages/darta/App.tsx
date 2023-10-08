/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LinkingOptions, NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { ExploreMapStackNavigator } from './src/navigation/ExploreMap/ExploreMapStackNavigator';
import {Exhibition} from '@darta-types'
import React from 'react';
import {Provider as PaperProvider, Text} from 'react-native-paper';

import {TabBarElement} from './src/components/Elements/TabBarElement';
import {ExhibitionStackNavigator} from './src/navigation/Exhibition/ExhibitionStackNavigator';
// import {RecommenderStackNavigator} from './src/navigation/RecommenderStackNavigator';
import {UserStackNavigator} from './src/navigation/UserStackNavigator';
import {StoreProvider} from './src/state/Store';
import {footerColors, footerOptions} from './src/styles/styles';
import * as Linking from "expo-linking";
import { v4 as uuidv4 } from 'uuid';
import { TextComponent, View } from 'react-native';
import {RootStackEnum,
  ExhibitionRootEnum,
  PreviousExhibitionRootEnum,
  ExploreMapRootEnum, } from './src/typing/routes'

import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import {AnimatedAppLoader} from './src/screens/SplashScreen/SplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import * as SecureStore from 'expo-secure-store';

export const RecommenderStack = createStackNavigator();
export const RootStack = createBottomTabNavigator();

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

// const linking: any = {
//   prefixes: [prefix],
//   config: {
//     screens: {
//       [RootStackEnum.feed]: {
//         path: 'feed',
//         screens: {
//           // [ExhibitionRootEnum.exhibitionHome]: ExhibitionRootEnum.exhibitionHome,
//           // [ExhibitionRootEnum.TopTab]: {
//           //   path: 'topTab',
//           //   screens: {
//           //     [ExhibitionRootEnum.exhibitionDetails]: {
//           //       path: 'exhibition/:exhibitionId/gallery/:galleryId',
//           //       parse: {
//           //         exhibitionId: (exhibitionId) => `${exhibitionId}`,
//           //         galleryId: (galleryId) => `${galleryId}`,
//           //       },
//           //     },
//           //     [ExhibitionRootEnum.artworkList]: 'feed/exhibition/:exhibitionId/artwork',
//           //     [ExhibitionRootEnum.exhibitionGallery]: 'feed/gallery/:galleryId',
//           //   },
//           // },
//           // [PreviousExhibitionRootEnum.navigatorScreen]: {
//           //     screens: {
//           //       [PreviousExhibitionRootEnum.exhibitionDetails]: 'pastExhibition/:exhibitionId',
//           //       [PreviousExhibitionRootEnum.artworkList]: 'pastExhibition/:exhibitionId/artwork',
//           //     },
//           //   },
//           // [ExhibitionRootEnum.individualArtwork]: 'artwork/:artworkId',
//           [ExhibitionRootEnum.qrRouter]: 'qrRouter/:galleryId'
//             // screens: {
//             //   [ExhibitionRootEnum.qrRouter]: 'qrRouter/:galleryId',
//             // },
//           // },
//           },
//         },
//       // [RootStackEnum.explore]: {
//       //   screens: {
//       //     [ExploreMapRootEnum.exploreMapHome]: ExploreMapRootEnum.exploreMapHome,
//       //     [ExploreMapRootEnum.TopTabExhibition]: {
//       //       screens: {
//       //         [ExhibitionRootEnum.exhibitionDetails]: 'explore/exhibition/:exhibitionId',
//       //         [ExhibitionRootEnum.artworkList]: 'explore/exhibition/:exhibitionId/artwork',
//       //         [ExhibitionRootEnum.exhibitionGallery]: 'explore/exhibition/:exhibitionId/gallery/:galleryId',
//       //       },
//       //     },
//       //   },
//       // }
//     }
//   }
// }


function App() {

  // useEffect(() => {

  //   const getUUID = async () =>{
  //     let uuid = uuidv4();
  //     let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
  //       //if user has already signed up prior
  //       if (fetchUUID) {
  //         uuid = JSON.parse(fetchUUID)
  //       }
  //     await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(uuid));
  //     // console.log(uuid)
  //   }
  //   getUUID()
  // }, [])

  React.useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    return () => subscription.remove();
  }, []);
  
  const handleDeepLink = (event) => {
    console.log("Received link:", event.url);
  }
  

  return (
    <PaperProvider>
      <StoreProvider>
        <NavigationContainer
          linking={linking}
        >
          <AnimatedAppLoader>
            {/* <NavigationContainer linking={linking} > */}
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
                    name={RootStackEnum.explore}
                    component={ExploreMapStackNavigator}
                    options={{
                      tabBarIcon: ({focused}: {focused: any}) => (
                        <TabBarElement
                          focused={focused}
                          icon="map-marker-outline"
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
