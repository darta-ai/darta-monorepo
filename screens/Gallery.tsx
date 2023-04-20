import React, {useContext, useEffect} from 'react';

import {GalleryStack} from '../App';
import {DartaHome} from '../src/Screens/Gallery/DartaHome';
import {DartaRoute} from '../src/Screens/Gallery/DartaRoute';
import {GalleryNavigatorEnum} from '../src/Screens/Gallery/galleryRoutes.d';
import {TombstoneRoute} from '../src/Screens/Gallery/Tombstone/TombstoneRoute';
import {createOpeningTransition} from '../src/Screens/openingTransition';
import {ETypes, StoreContext} from '../src/State/Store';
import {headerOptions} from './styles';

function GalleryStackScreen() {
  const openingTransition = createOpeningTransition();
  const {state, dispatch} = useContext(StoreContext);

  useEffect(() => {
    dispatch({
      type: ETypes.preLoadState,
    });
  }, [dispatch]);

  return (
    <GalleryStack.Navigator screenOptions={{headerTintColor: 'white'}}>
      <GalleryStack.Group>
        <GalleryStack.Screen
          name={GalleryNavigatorEnum.galleryHome}
          component={DartaHome}
          options={{...headerOptions}}
        />
        <GalleryStack.Screen
          name={GalleryNavigatorEnum.gallery}
          component={DartaRoute}
          options={{
            ...headerOptions,
            ...openingTransition,
            headerTitle: state.galleryTitle,
          }}
        />
      </GalleryStack.Group>
      <GalleryStack.Group screenOptions={{presentation: 'modal'}}>
        <GalleryStack.Screen
          name={GalleryNavigatorEnum.tombstone}
          component={TombstoneRoute}
          options={{
            ...headerOptions,
            headerTitle: state.tombstoneTitle,
            headerTitleStyle: {
              fontSize: 15,
            },
          }}
        />
      </GalleryStack.Group>
    </GalleryStack.Navigator>
  );
}

export default GalleryStackScreen;
