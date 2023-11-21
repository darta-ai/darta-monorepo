import React, {useContext, useEffect} from 'react';

import {RecommenderStack} from '../../App';
import {DartaRecommenderView} from '../screens/DartaRecommenderView';
// import {RecommenderHomeScreen} from '../screens/_index';
import {TombstonePortrait} from '../components/Tombstone/TombstonePortrait';
import {ETypes, StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {GalleryNavigatorEnum} from '../typing/routes'
import * as Colors from '@darta-styles';
import { ArtworkScreen } from '../screens/Artwork/ArtworkScreen';

export function RecommenderStackNavigator() {
  // const openingTransition = createOpeningTransition();
  const {state, dispatch} = useContext(StoreContext);

  useEffect(() => {
    dispatch({
      type: ETypes.preLoadState,
    });
  }, [dispatch]);

  return (
    <RecommenderStack.Navigator screenOptions={{headerTintColor: Colors.PRIMARY_50}}>
      <RecommenderStack.Group>
        <RecommenderStack.Screen
          name={GalleryNavigatorEnum.gallery}
          component={DartaRecommenderView}
          options={{
            ...headerOptions,
            headerTitle: state.galleryTitle,
          }}
        />
        <RecommenderStack.Screen
          name={GalleryNavigatorEnum.tombstone}
          component={ArtworkScreen}
          initialParams={{} as any}
          options={{
            ...headerOptions,
            headerTitle: state.tombstoneTitle ?? ""}}
        />
      </RecommenderStack.Group>
    </RecommenderStack.Navigator>
  );
}
