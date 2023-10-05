import {PRIMARY_800, PRIMARY_900, PRIMARY_50} from '@darta-styles';
import React, {useContext} from 'react';

import {StoreContext} from '../../state/Store';
import {headerOptions} from '../../styles/styles';
import { ExploreMapRootEnum} from '../../typing/routes';
import { ExploreMapHomeScreen } from '../../screens/ExploreMap/ExploreMapHomeScreen';
import {createStackNavigator} from '@react-navigation/stack';

export const ExploreMapStack = createStackNavigator();

export function ExploreMapStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);

  return (
    <ExploreMapStack.Navigator screenOptions={{headerTintColor: PRIMARY_800}}>
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapHome}
          component={ExploreMapHomeScreen}
          options={{...headerOptions, headerTitle: 'explore'}}
        />
    </ExploreMapStack.Navigator>
  );
}
