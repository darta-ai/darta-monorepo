/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {getUniqueId} from 'react-native-device-info';
import {Provider as PaperProvider} from 'react-native-paper';

import {footerColors, footerOptions} from './src/styles/styles';
import { TabBarElement } from './src/components/Elements/_index';
import {RecommenderStackNavigator, UserStackNavigator} from './src/navigation/_index';
import {StoreProvider} from './src/state/Store';

export const RecommenderStack = createStackNavigator();
export const UserStack = createStackNavigator();
export const Tab = createBottomTabNavigator();

export const getDeviceInformation = async () => {
  const uniqueId = await getUniqueId();
  return {uniqueId};
};
getDeviceInformation();

function App() {
  return (
    <PaperProvider>
      <StoreProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen
              name="d a r t a" 
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
            />
            <Tab.Screen
              name="m e"
              component={UserStackNavigator}
              options={{
                TabBarElement: ({focused} : {focused: any}) => (
                  <TabBarElement
                    focused={focused}
                    icon="account-box-outline"
                    colors={footerColors}
                  />
                ),
                ...footerOptions,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </PaperProvider>
  );
}

export default App;
