import React, {useContext, useEffect} from 'react';

import {RecommenderStack} from '../../App';
import {DartaGalleryView} from '../Screens/Gallery/DartaGalleryView';
import {RecommenderHomeScreen} from '../screens/_index';
import {TombstonePortrait} from '../components/Tombstone/TombstonePortrait';
import {ETypes, StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {createOpeningTransition} from '../utils/openingTransition';
import {GalleryNavigatorEnum} from '../typing/routes';

export function RecommenderStackNavigator() {
  const openingTransition = createOpeningTransition();
  const {state, dispatch} = useContext(StoreContext);

  useEffect(() => {
    dispatch({
      type: ETypes.preLoadState,
    });
  }, [dispatch]);

  return (
    <RecommenderStack.Navigator screenOptions={{headerTintColor: 'white'}}>
      <RecommenderStack.Group>
        <RecommenderStack.Screen
          name={GalleryNavigatorEnum.galleryHome}
          component={RecommenderHomeScreen}
          options={{...headerOptions}}
        />
        <RecommenderStack.Screen
          name={GalleryNavigatorEnum.gallery}
          component={DartaGalleryView}
          options={{
            ...headerOptions,
            ...openingTransition,
            headerTitle: state.galleryTitle,
          }}
        />
      </RecommenderStack.Group>
      <RecommenderStack.Group screenOptions={{presentation: 'modal'}}>
        <RecommenderStack.Screen
          name={GalleryNavigatorEnum.tombstone}
          component={TombstonePortrait}
          options={{
            ...headerOptions,
            headerTitle: state.tombstoneTitle,
            headerTitleStyle: {
              fontSize: 15,
            },
          }}
        />
      </RecommenderStack.Group>
    </RecommenderStack.Navigator>
  );
}
