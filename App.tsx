/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {getUniqueId} from 'react-native-device-info';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {footerColors, footerOptions} from './screens/styles';
import TabBarIcon from './src/GlobalElements/TabBarIcon';
import {GalleryStackNavigator, UserStackNavigator} from './src/Navigators';
import {StoreProvider} from './src/State/Store';

export const GalleryStack = createStackNavigator();
export const UserStack = createStackNavigator();
export const Tab = createBottomTabNavigator();

export const deviceInformation = async () => {
  const uniqueId = await getUniqueId();
  return {uniqueId};
};

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StoreProvider>
          <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}}>
              <Tab.Screen
                name="d | a r t | ai"
                component={GalleryStackNavigator}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabBarIcon
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
                  tabBarIcon: ({focused}) => (
                    <TabBarIcon
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
    </SafeAreaProvider>
  );
}

export default App;
