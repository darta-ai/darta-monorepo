import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SheetProvider } from 'react-native-actions-sheet';
// eslint-disable-next-line import/extensions
import './sheets.tsx';
import { Home, Matches, Profile } from './screens';
import {
  PRIMARY_COLOR, DARK_GRAY, BLACK, WHITE,
} from './assets/styles';
import TabBarIcon from './components/TabBarIcon';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <PaperProvider>
      <SheetProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Tab"
              options={{ headerShown: false, animationEnabled: true }}

            >
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    showLabel: true,
                    activeTintColor: PRIMARY_COLOR,
                    inactiveTintColor: DARK_GRAY,
                    labelStyle: {
                      fontSize: 14,
                      textTransform: 'uppercase',
                      paddingTop: 10,
                    },
                    style: {
                      backgroundColor: WHITE,
                      borderTopWidth: 0,
                      marginBottom: 0,
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      shadowColor: BLACK,
                      shadowOffset: { height: 0, width: 0 },
                    },
                  }}
                >
                  <Tab.Screen
                    name="Openings"
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
                    name="Saved"
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
                    name="Profile"
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
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SheetProvider>
    </PaperProvider>
  );
}

export default App;
