/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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

export const RecommenderStack = createStackNavigator();
export const ExhibitionStack = createStackNavigator();
export const UserStack = createStackNavigator();
export const Tab = createBottomTabNavigator();

function App() {
  const [exhibition, setExhibition] = React.useState<Exhibition | {}>({})
  
  useEffect(() => {
    const getExhibition = async () => {
      const response = await readExhibition({exhibitionId: "Exhibitions/ba99e53d-29c0-49dd-9c5f-8761fb5655c3"})
      console.log(response)
      console.log({location: response.exhibitionLocation, coordinates: response.exhibitionLocation.coordinates})
    }
    getExhibition()
  }, []);
  return (
    <PaperProvider>
      <StoreProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{headerShown: false}}>
            {/* <Tab.Screen
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
            /> */}

            {/* Delete */}
            <Tab.Screen
              name="e x h i b i t i o n"
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
          </Tab.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </PaperProvider>
  );
}

export default App;
