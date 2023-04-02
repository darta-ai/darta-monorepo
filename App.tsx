/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {StoreProvider} from './components/Gallery/galleryStore';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import TabBarIcon from './components/GlobalElements/TabBarIcon';
import {
  GalleryStackScreen,
  // Camera,
  User,
} from './screens';

export const GalleryStack = createStackNavigator();
export const UserStack = createStackNavigator();
export const Tab = createBottomTabNavigator();

const footerOptions = {
  headerTitle: 'Openings',
  tabBarLabelStyle: {
    fontFamily: 'Avenir Next',
    fontSize: 15,
  },
  tabBarStyle: {
    backgroundColor: 'black',
  },
};
const colors = {
  focused: 'white',
  notFocused: '#A9A9A9',
};

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StoreProvider>
          <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}}>
              <Tab.Screen
                name="d a r t a"
                component={GalleryStackScreen}
                options={{
                  tabBarIcon: ({focused}) => (
                    <TabBarIcon
                      focused={focused}
                      icon="image-frame"
                      colors={colors}
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
                      colors={colors}
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
