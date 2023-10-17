import {PRIMARY_950} from '@darta-styles';
import React, {useContext} from 'react';

import {UserHome} from '../../screens/UserHome';
import {StoreContext} from '../../state/Store';
import {headerOptions} from '../../styles/styles';
import {RecommenderRoutesEnum, UserRoutesEnum} from '../../typing/routes';

import {createStackNavigator} from '@react-navigation/stack';
import { DartaRecommenderView } from '../../screens/DartaRecommenderView';

export const RecommenderStack = createStackNavigator();


export function DartaRecommenderNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);
  return (
    <RecommenderStack.Navigator screenOptions={{headerTintColor: PRIMARY_950}}>
        <RecommenderStack.Screen
          name={RecommenderRoutesEnum.recommenderHome}
          component={DartaRecommenderView}
          options={{...headerOptions, headerTitle: 'darta'}}
        />
    </RecommenderStack.Navigator>
  );
}
