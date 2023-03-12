/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import TabBarIcon from './components/GlobalElements/TabBarIcon';
import {
  Camera, Home, Matches, Profile,
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
            options={{ headerShown: false, animationEnabled: true }}
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
                        icon="brush"
                      />
                    ),
                  }}
                />

                <Tab.Screen
                  name="s a v e d"
                  component={Matches}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <TabBarIcon
                        focused={focused}
                        icon="heart"
                      />
                    ),
                  }}
                />
                <Tab.Screen
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
                />
                <Tab.Screen
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
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
