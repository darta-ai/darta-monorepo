import {PRIMARY_950} from '@darta-styles';
import React, {useContext} from 'react';
import * as Colors from '@darta-styles';


import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import {UserHome} from '../../screens/UserHome';
import {UserInquiredArtwork} from '../../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../../components/User/UserSavedArtwork';
import {UserSettings} from '../../components/User/UserSettings';
import {StoreContext} from '../../state/Store';
import {backButtonStyles, headerOptions} from '../../styles/styles';
import {UserRoutesEnum} from '../../typing/routes';
import { View, StyleSheet} from 'react-native';  

import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { GalleryAndArtworkTopTabNavigator } from './GalleryAndArtworkTopTabNavigator';
import { PastExhibitionTopTabNavigator } from '../Exhibition/PastExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import * as SVGs from '../../assets/SVGs';
import { ViewListsScreen } from '../../screens/Lists/ViewLists';
import { TextElement } from '../../components/Elements/TextElement';
import { FullListScreen } from '../../screens/Lists/FullListScreen';

export const UserStack = createStackNavigator();


export function UserStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);
  return (
    <UserStack.Navigator screenOptions={{
      headerTintColor: PRIMARY_950,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
      headerBackImage: () => (
        <View style={backButtonStyles.backButton}>
          <SVGs.BackButtonIcon />
        </View>
        ),
        headerBackTitleVisible: false,
      }}>
      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.home}
          component={UserHome}
          options={{...headerOptions, headerTitle: 'Profile'}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userSettings}
          component={UserSettings}
          options={{
            ...headerOptions,
            headerTitle: 'Settings',
          }}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userSavedArtwork}
          component={UserSavedArtwork}
          options={{
            ...headerOptions,
            headerTitle: 'Saved',
          }}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userInquiredArtwork}
          component={UserInquiredArtwork}
          options={{
            ...headerOptions,
            headerTitle: 'Inquiries',
          }}
        />
        <UserStack.Screen 
          name={UserRoutesEnum.UserGalleryAndArtwork}
          component={GalleryAndArtworkTopTabNavigator}
          options={{...headerOptions, headerTitle: state.currentArtworkTombstoneHeader}}
          initialParams={{navigateTo: UserRoutesEnum.SavedArtworkModal}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.UserPastTopTabNavigator}
          component={PastExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: state.previousExhibitionHeader ?? "" }}
          initialParams={{navigateTo: UserRoutesEnum.SavedArtworkModal}}
          />
        <UserStack.Screen
          name={UserRoutesEnum.UserGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.artOnDisplay.galleryId, navigationRoute: UserRoutesEnum.UserPastTopTabNavigator, showPastExhibitions: true, navigateTo: UserRoutesEnum.SavedArtworkModal}}
          options={{...headerOptions, headerTitle: state?.galleryHeader ?? ""}}
          />
          <UserStack.Screen
          name={UserRoutesEnum.userListFull}
          component={FullListScreen}
          options={{
            headerTintColor: Colors.PRIMARY_50,
            headerStyle: {
              backgroundColor: Colors.PRIMARY_950, 
              opacity: 0.9,
            }, 
            headerBackImage: () => (
              <View style={backButtonStyles.backButton}>
                <SVGs.BackButtonIconWhite />
              </View>
          ), 
            headerTitle: state.listHeader ?? ""}}
        />
      </UserStack.Group>

      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.SavedArtworkModal}
          component={ArtworkScreen}
          options={{...headerOptions, headerTitle: state?.currentArtworkTombstoneHeader ?? ""}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.UserListsScreen}
          component={ViewListsScreen}
          options={{
            headerMode: 'float', 
            cardStyle: {opacity: 1, margin:0, backgroundColor: 'transparent', width: '100%'}, 
            headerTintColor: Colors.PRIMARY_50,
            headerStyle: {
              backgroundColor: Colors.PRIMARY_950, 
              opacity: 0.9,
            }, 
            headerBackImage: () => (
              <View style={backButtonStyles.backButton}>
                <SVGs.BackButtonIconWhite />
              </View>
          ), 
            headerTitle: "Lists"}}
        />
      </UserStack.Group>
    </UserStack.Navigator>
  );
}
