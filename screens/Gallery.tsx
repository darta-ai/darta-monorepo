import React, {useContext} from 'react';

import {GalleryStack} from '../App';
import * as globals from '../src/globalVariables';
import {DartaHome} from '../src/Screens/Gallery/DartaHome';
import {DartaRoute} from '../src/Screens/Gallery/DartaRoute';
import {GalleryNavigatorEnum} from '../src/Screens/Gallery/galleryRoutes.d';
import {TombstoneRoute} from '../src/Screens/Gallery/Tombstone/TombstoneRoute';
import {createOpeningTransition} from '../src/Screens/openingTransition';
import {StoreContext} from '../src/State/Store';
import {headerOptions} from './styles';

const galleryInfo = globals.galleryDummyData;

function GalleryStackScreen() {
  const openingTransition = createOpeningTransition();
  const {state} = useContext(StoreContext);

  return (
    <GalleryStack.Navigator screenOptions={{headerTintColor: 'white'}}>
      <GalleryStack.Group>
        <GalleryStack.Screen
          name={GalleryNavigatorEnum.galleryHome}
          component={DartaHome}
          options={{...headerOptions}}
          initialParams={{galleryInfo}}
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
