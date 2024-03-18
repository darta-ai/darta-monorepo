import {PRIMARY_950} from '@darta-styles';
import React from 'react';
import * as Colors from '@darta-styles';


import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import {UserHome} from '../../screens/UserHome';
import {UserInquiredArtwork} from '../../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../../components/User/UserSavedArtwork';
import {UserSettings} from '../../components/User/UserSettings';
import {backButtonStyles, headerOptions} from '../../styles/styles';
import {UserRoutesEnum} from '../../typing/routes';
import { View, StyleSheet } from 'react-native';  
import Share from 'react-native-share'


import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { GalleryAndArtworkTopTabNavigator } from './GalleryAndArtworkTopTabNavigator';
import { PastExhibitionTopTabNavigator } from '../Exhibition/PastExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import * as SVGs from '../../assets/SVGs';
import { ViewListsScreen } from '../../screens/Lists/ViewLists';
import { UIStoreContext } from '../../state';
import { ListTopTab } from '../List/ListTopTab';
import { IconButton } from 'react-native-paper';
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { TextElement } from '../../components/Elements/TextElement';

export const UserStack = createStackNavigator();


export const viewOptionsStyles = StyleSheet.create({
  viewOptionsButtonStyle: {
    opacity: 0.9,
    height: 24,
    width: 24,
    marginRight: 24,
    borderRadius: 0,
    color: Colors.PRIMARY_50,
  },
});


export function UserStackNavigator({route} : {route: any}) {
  const {uiState} = React.useContext(UIStoreContext);

  const shareList = async () => {
    if (!uiState.listUrl) return;
    try {
      await Share.open({
        url: uiState.listUrl
        // message: state.exhibitionShareDetails.shareURLMessage ?? "",
      });
    } catch (error) {

    }

  }
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
          initialParams={{saveRoute: UserRoutesEnum.userAddToList}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userInquiredArtwork}
          component={UserInquiredArtwork}
          options={{
            ...headerOptions,
            headerTitle: 'Inquiries',
          }}
          initialParams={{saveRoute: UserRoutesEnum.userAddToList}}
        />
        <UserStack.Screen 
          name={UserRoutesEnum.UserGalleryAndArtwork}
          component={GalleryAndArtworkTopTabNavigator}
          options={{...headerOptions, headerTitle: uiState.currentArtworkTombstoneHeader}}
          initialParams={{navigateTo: UserRoutesEnum.SavedArtworkModal, saveRoute: UserRoutesEnum.userAddToList}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.UserPastTopTabNavigator}
          component={PastExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: uiState.previousExhibitionHeader ?? "" }}
          initialParams={{navigateTo: UserRoutesEnum.SavedArtworkModal, saveRoute: UserRoutesEnum.userAddToList}}
          />
        <UserStack.Screen
          name={UserRoutesEnum.UserGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.artOnDisplay.galleryId, 
            navigationRoute: UserRoutesEnum.UserPastTopTabNavigator, 
            showPastExhibitions: true, 
            navigateTo: UserRoutesEnum.SavedArtworkModal,
            saveRoute: UserRoutesEnum.userAddToList
          }}
          options={{...headerOptions, headerTitle: uiState?.galleryHeader ?? ""}}
          />
          <UserStack.Screen
            name={UserRoutesEnum.userListFull}
            component={ListTopTab}
            initialParams= {{
              navigateToGalleryParams: UserRoutesEnum.UserGallery,
            }}
            options={{
              headerTintColor: Colors.PRIMARY_50,
              headerStyle: {
                backgroundColor: Colors.PRIMARY_950, 
                opacity: 0.9,
              }, 
              headerRight: () => (
                <IconButton 
                  icon={"export-variant"}
                  iconColor={Colors.PRIMARY_50}
                  style={viewOptionsStyles.viewOptionsButtonStyle}
                  onPress={() => shareList()}
                />
              ),
              headerBackImage: () => (
                <View style={backButtonStyles.backButton}>
                  <SVGs.BackButtonIconWhite />
                </View>
            ), 
            headerTitle: uiState.listHeader ?? ""}}
        />
      </UserStack.Group>

      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.SavedArtworkModal}
          component={ArtworkScreen}
          options={{...headerOptions, headerTitle: uiState?.currentArtworkTombstoneHeader ?? ""}}
          initialParams={{saveRoute: UserRoutesEnum.userAddToList, addPaddingTop: true}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.UserListsScreen}
          component={ViewListsScreen}
          options={{...headerOptions, headerTitle: "Your Lists"}}
        />
        <UserStack.Screen
            name={UserRoutesEnum.userAddToList}
            component={AddToListScreen}
            options={{ 
              headerMode: 'float', 
              cardStyle: {opacity: 1, margin:0, backgroundColor: 'transparent', width: '100%'}, 
              headerTitle: 'Add to list',
              headerTintColor: Colors.PRIMARY_50,
              headerStyle: {
                backgroundColor: Colors.PRIMARY_950, 
                opacity: 0.9,
              },
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
              },
              headerBackImage: () => (
                <View style={backButtonStyles.backButton}>
                  <TextElement style={{color: Colors.PRIMARY_50}}>Cancel</TextElement>
                </View>
            ), 
          }}/>
      </UserStack.Group>
    </UserStack.Navigator>
  );
}
