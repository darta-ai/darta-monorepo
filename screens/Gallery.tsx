import React, {useContext} from 'react';

import {Button, StyleSheet} from 'react-native';

import {GalleryStack} from '../App';
import {DartaHome} from '../components/Gallery/DartaHome';
import {DartaRoute} from '../components/Gallery/DartaRoute';
import {GalleryNavigatorEnum} from '../components/Gallery/galleryRoutes.d';
import {StoreContext} from '../components/Gallery/galleryStore';
import * as globals from '../components/globalVariables';
import {createOpeningTransition} from '../components/Screens/openingTransition';
import {TombstoneRoute} from '../components/Gallery/Tombstone/TombstoneRoute';
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
