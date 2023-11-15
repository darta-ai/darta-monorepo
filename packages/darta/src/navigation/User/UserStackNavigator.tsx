import {PRIMARY_950} from '@darta-styles';
import React, {useContext} from 'react';

import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import {UserHome} from '../../screens/UserHome';
import {UserInquiredArtwork} from '../../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../../components/User/UserSavedArtwork';
import {UserSettings} from '../../components/User/UserSettings';
import {StoreContext} from '../../state/Store';
import {headerOptions} from '../../styles/styles';
import {UserRoutesEnum} from '../../typing/routes';
import { View, StyleSheet} from 'react-native';  

import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { GalleryAndArtworkTopTabNavigator } from './GalleryAndArtworkTopTabNavigator';
import { PastExhibitionTopTabNavigator } from '../Exhibition/PastExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';

export const UserStack = createStackNavigator();

const styles = StyleSheet.create({ 
  backButton: {
    marginLeft: 10,
    marginTop: 10, 
    marginBottom: 10
  }
});

export function UserStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);
  return (
    <UserStack.Navigator screenOptions={{
      headerTintColor: PRIMARY_950,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
      headerBackImage: () => (
        <View style={styles.backButton}>
          <BackButtonIcon />
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
      </UserStack.Group>

      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.SavedArtworkModal}
          component={ArtworkScreen}
          options={{...headerOptions, headerTitle: state?.currentArtworkTombstoneHeader ?? ""}}
        />
      </UserStack.Group>
    </UserStack.Navigator>
  );
}
