import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ListEnum } from '../../typing/routes';
import { tabBarScreenOptions } from '../../theme/themeConstants';
import { ListMap } from '../../screens/Lists/ListMap';
import { FullListScreen } from '../../screens/Lists/FullListScreen';

export const ListTopTabNavigation = createMaterialTopTabNavigator();

export function ListTopTab({route} : {route: any}) {
  return (
    <ListTopTabNavigation.Navigator screenOptions={{...tabBarScreenOptions}}>
      <ListTopTabNavigation.Group>
          <ListTopTabNavigation.Screen
            name={ListEnum.fullList}
            component={FullListScreen}
            options={{ title: 'List' }}
            initialParams={{listId: route.params?.listId}}
          />
          <ListTopTabNavigation.Screen
            name={ListEnum.fullMap}
            component={ListMap}
            options={{ title: 'Map' }}
            initialParams={{listId: route.params?.listId}}
          />
        </ListTopTabNavigation.Group>
    </ListTopTabNavigation.Navigator>
  );
}
