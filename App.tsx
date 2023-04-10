/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {StoreProvider} from './components/Gallery/galleryStore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {footerOptions, footerColors} from './screens/styles';

import TabBarIcon from './components/GlobalElements/TabBarIcon';
import {GalleryStackScreen, User} from './screens';

export const GalleryStack = createStackNavigator();
export const UserStack = createStackNavigator();
export const Tab = createBottomTabNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StoreProvider>
          <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}}>
              <Tab.Screen
                name="d | a r t | ai"
                component={GalleryStackScreen}
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
                component={User}
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
