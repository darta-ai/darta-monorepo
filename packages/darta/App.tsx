/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Exhibition} from '@darta-types'
import {readExhibition} from './src/api/exhibitionRoutes'
import React, {useEffect} from 'react';
// import {getUniqueId} from 'react-native-device-info';
import {Provider as PaperProvider} from 'react-native-paper';

import {TabBarElement} from './src/components/Elements/TabBarElement';
import {ExhibitionStackNavigator} from './src/navigation/ExhibitionStackNavigator';
// import {RecommenderStackNavigator} from './src/navigation/RecommenderStackNavigator';
// import {UserStackNavigator} from './src/navigation/UserStackNavigator';
import {StoreProvider} from './src/state/Store';
import {footerColors, footerOptions} from './src/styles/styles';
import { v4 as uuidv4 } from 'uuid';

import * as SecureStore from 'expo-secure-store';

export const RecommenderStack = createStackNavigator();
export const UserStack = createStackNavigator();
export const RootStack = createBottomTabNavigator();

export const ExhibitionStack = createStackNavigator();
export const ExhibitionStackTopTab = createMaterialTopTabNavigator();


// 4e4548f6-3427-4335-b16e-4d7c1562ebae

function App() {
  const [exhibition, setExhibition] = React.useState<Exhibition | {}>({})

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
  console.log('Component re-rendered')

  return (
    <PaperProvider>
      <StoreProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{headerShown: false}}>
            <RootStack.Group>
            {/* <RootStack.Screen
              name="galleries" 
              component={RecommenderStackNavigator}
              options={{
                TabBarElement: ({focused} : {focused: any}) => (
                  <TabBarElement
                    focused={focused}
                    icon="image-frame"
                    colors={footerColors}
                  />
                ),
                ...footerOptions,
              }}
            /> */}

            {/* Delete */}
            <RootStack.Screen
              name="exhibition feed"
              component={ExhibitionStackNavigator}
              options={{
                TabBarElement: ({focused}: {focused: any}) => (
                  <TabBarElement
                    focused={focused}
                    icon="account-box-outline"
                    colors={footerColors}
                  />
                ),
                ...footerOptions,
              }}
            />
            {/* <Tab.Screen
              name="m e"
              component={UserStackNavigator}
              options={{
                TabBarElement: ({focused}: {focused: any}) => (
                  <TabBarElement
                    focused={focused}
                    icon="account-box-outline"
                    colors={footerColors}
                  />
                ),
                ...footerOptions,
              }}
            /> */}
            </RootStack.Group>
          </RootStack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </PaperProvider>
  );
}

export default App;
