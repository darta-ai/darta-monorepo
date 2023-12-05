import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {runOnJS} from 'react-native-reanimated';
import {UserRoutesEnum} from '../../typing/routes';
import {YouComponent} from '../Gallery/YouComponent';
import * as SVGs from '../../assets/SVGs/index';

// people need to download the app and they're just dropped on the screen with the art ratings
// it's very simple - gets right to the point
export enum UserScreenSelectorEnum {
  savedArtwork = 'savedArtwork',
  inquiredArtwork = 'inquiredArtwork',
}

export function UserSpecificComponent({
  navigation,
}: {
  navigation: any;
}) {
  const navigateToSaved = async () => {
    return navigation.navigate(UserRoutesEnum.userSavedArtwork);
  };

  const navigateToInquired = async () => {
    return navigation.navigate(UserRoutesEnum.userInquiredArtwork);
  };

  const navigateToEditUserSettings = () => {
    navigation.navigate(UserRoutesEnum.userSettings)
  };

  const navigateToLists = () => {
    navigation.navigate(UserRoutesEnum.UserListsScreen)
  }

  const SSUserScreenSelector = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignContent: 'center',
      alignSelf: 'center',
      width: '100%',
    },
    optionsContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      alignContent: 'center',
      gap: 12,
    },
  });
  return (
    <View style={SSUserScreenSelector.container}>
      <View style={SSUserScreenSelector.optionsContainer}>
        <Pressable onPress={async () => navigateToEditUserSettings()}>
          <YouComponent
            headline="Settings"
            subHeadline="Change name, email, username, etc."
            iconComponent={SVGs.SettingsIcon}

          />
        </Pressable>
        <Pressable onPress={async () => navigateToSaved()}>
          <YouComponent
            headline="Saved"
            subHeadline="Every artwork you've saved"
            iconComponent={SVGs.SavedIcon}
          />
        </Pressable>
        <Pressable onPress={async () => navigateToInquired()}>
          <YouComponent
            headline="Inquiries"
            subHeadline="Artwork you've inquired about"
            iconComponent={SVGs.EmailLargeIcon}
          />
        </Pressable>
        <Pressable onPress={async () => navigateToLists()}>
          <YouComponent
            headline="Lists"
            subHeadline="The lists you've created and saved"
            iconComponent={SVGs.PaletteFocusedIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}
