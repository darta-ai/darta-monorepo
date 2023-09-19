import React, {useContext, useEffect} from 'react';

import {GalleryStack} from '../../App';
import {headerOptions} from '../../screens/styles';
import {DartaGalleryView} from '../Screens/Gallery/DartaGalleryView';
import {DartaHome} from '../Screens/Gallery/DartaHome';
import {TombstoneRoute} from '../Screens/Gallery/TombstoneRoute';
import {ETypes, StoreContext} from '../State/Store';
import {createOpeningTransition} from './NavigationStyling/openingTransition';
import {GalleryNavigatorEnum} from './Routes/galleryRoutes.d';

export function GalleryStackNavigator() {
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
          component={DartaGalleryView}
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
