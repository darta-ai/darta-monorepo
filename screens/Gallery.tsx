import React, {useContext} from 'react';

import {Button, StyleSheet} from 'react-native';

import {GalleryStack} from '../App';
import {GalleryHome} from '../components/Gallery/GalleryHome';
import {GalleryRoute} from '../components/Gallery/Gallery';
import {GalleryNavigatorEnum} from '../components/Gallery/galleryRoutes.d';
import {StoreContext} from '../components/Gallery/galleryStore';
import * as globals from '../components/globalVariables';
import {createOpeningTransition} from '../components/Screens/openingTransition';
import {TombstoneRoute} from '../components/Gallery/Tombstone/TombstoneRoute';
import { headerOptions } from './styles';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const galleryInfo = globals.galleryDummyData;

function GalleryStackScreen() {
  const openingTransition = createOpeningTransition();
  const {state} = useContext(StoreContext);

  return (
    <GalleryStack.Navigator screenOptions={{headerTintColor: 'white'}}>
      <GalleryStack.Group>
        <GalleryStack.Screen
          name={GalleryNavigatorEnum.galleryHome}
          component={GalleryHome}
          options={{...headerOptions}}
          initialParams={{galleryInfo}}
        />
        <GalleryStack.Screen
          name={GalleryNavigatorEnum.gallery}
          component={GalleryRoute}
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
          options={{...headerOptions, headerTitle: state.tombstoneTitle}}
        />
      </GalleryStack.Group>
    </GalleryStack.Navigator>
  );
}

export default GalleryStackScreen;
