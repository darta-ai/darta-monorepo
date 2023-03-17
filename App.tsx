/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import TabBarIcon from './components/GlobalElements/TabBarIcon';
import {
  // Camera,
  Home,
  Matches,
} from './screens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Tab"
            options={{
              headerShown: false,
              gestureEnabled: true,
              cardOverlayEnabled: true,
            }}
          >
            {() => (
              <Tab.Navigator>
                <Tab.Screen
                  name="d a r t a"
                  component={Home}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <TabBarIcon
                        focused={focused}
                        icon="image-frame"
                      />
                    ),
                  }}
                />

                <Tab.Screen
                  name="a c c o u n t"
                  component={Matches}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <TabBarIcon
                        focused={focused}
                        icon="account-box-outline"
                      />
                    ),
                  }}
                />
                {/* <Tab.Screen
                  name="p r o f i l e"
                  component={Profile}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <TabBarIcon
                        focused={focused}
                        icon="account-circle"
                      />
                    ),
                  }}
                /> */}
                {/* <Tab.Screen
                  name="camera beta"
                  component={Camera}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <TabBarIcon
                        focused={focused}
                        icon="camera"
                      />
                    ),
                  }}
                /> */}
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
