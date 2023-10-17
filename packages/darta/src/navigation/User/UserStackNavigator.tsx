import {MILK, PRIMARY_950} from '@darta-styles';
import React, {useContext} from 'react';

import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import {UserHome} from '../../screens/UserHome';
import {UserInquiredArtwork} from '../../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../../components/User/UserSavedArtwork';
import {UserSettings} from '../../components/User/UserSettings';
import {StoreContext} from '../../state/Store';
import {headerOptions} from '../../styles/styles';
import {UserRoutesEnum} from '../../typing/routes';

import {createStackNavigator} from '@react-navigation/stack';
import { GalleryAndArtworkTopTabNavigator } from './GalleryAndArtworkTopTabNavigator';
import { PastExhibitionTopTabNavigator } from '../Exhibition/PastExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';

export const UserStack = createStackNavigator();


export function UserStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);
  return (
    <UserStack.Navigator screenOptions={{headerTintColor: PRIMARY_950}}>
      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.home}
          component={UserHome}
          options={{...headerOptions, headerTitle: 'me'}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userSettings}
          component={UserSettings}
          options={{
            ...headerOptions,
            headerTitle: 'settings',
          }}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userSavedArtwork}
          component={UserSavedArtwork}
          options={{
            ...headerOptions,
            headerTitle: 's a v e d',
          }}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userInquiredArtwork}
          component={UserInquiredArtwork}
          options={{
            ...headerOptions,
            headerTitle: 'i n q u i r e d',
          }}
        />
        <UserStack.Screen 
          name={UserRoutesEnum.UserGalleryAndArtwork}
          component={GalleryAndArtworkTopTabNavigator}
          options={{...headerOptions, headerTitle: state.currentArtworkTombstoneHeader}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.UserPastTopTabNavigator}
          component={PastExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: state.previousExhibitionHeader ?? ""}}
          />
        <UserStack.Screen
          name={UserRoutesEnum.UserGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.artOnDisplay.galleryId}}
          options={{...headerOptions, headerTitle: state.galleryHeader ?? ""}}
          />
      </UserStack.Group>

      <UserStack.Group screenOptions={{presentation: 'modal'}}>
        <UserStack.Screen
          name={UserRoutesEnum.SavedArtworkModal}
          component={ArtworkScreen}
          options={{...headerOptions, headerTitle: state.tombstoneTitle}}
        />
      </UserStack.Group>
    </UserStack.Navigator>
  );
}
