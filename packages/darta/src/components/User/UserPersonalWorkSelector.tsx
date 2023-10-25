import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {UserRoutesEnum} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import {globalTextStyles} from '../../styles/styles';
import {GallerySelectorComponent} from '../Gallery/GallerySelectorComponent';

// people need to download the app and they're just dropped on the screen with the art ratings
// it's very simple - gets right to the point
export enum UserScreenSelectorEnum {
  savedArtwork = 'savedArtwork',
  inquiredArtwork = 'inquiredArtwork',
}

type ShowActivityIndicator = {
  [key in UserScreenSelectorEnum]: boolean;
};

export function UserPersonalWorkSelector({
  navigation,
  headline,
  localButtonSizes,
}: {
  navigation: any;
  headline: string;
  localButtonSizes: any;
}) {
  const navigateToSaved = async () => {
    return navigation.navigate(UserRoutesEnum.userSavedArtwork);
  };

  const navigateToInquired = async () => {
    return navigation.navigate(UserRoutesEnum.userInquiredArtwork);
  };
  const SSUserScreenSelector = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignContent: 'center',
      alignSelf: 'center',
      width: wp('90%'),
    },
    headlineContainer: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: hp('1%'),
    },
    optionsContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      alignContent: 'center',
      gap: hp('1%'),
    },
  });
  return (
    <View style={SSUserScreenSelector.container}>
      <View style={SSUserScreenSelector.headlineContainer}>
        <TextElement
          style={[globalTextStyles.boldTitleText, {marginBottom: hp('1%`')}]}>
          {headline}
        </TextElement>
      </View>
      <View style={SSUserScreenSelector.optionsContainer}>
        <Pressable onPress={async () => navigateToSaved()}>
          <GallerySelectorComponent
            headline="s a v e s"
            subHeadline="artwork you have saved"
            showBadge={false}
            notificationNumber={15}
            localButtonSizes={localButtonSizes}
          />
        </Pressable>
        <Pressable onPress={async () => navigateToInquired()}>
          <GallerySelectorComponent
            headline="i n q u i r i e s"
            subHeadline="artwork you have inquired about"
            showBadge={false}
            notificationNumber={15}
            localButtonSizes={localButtonSizes}
          />
        </Pressable>
      </View>
    </View>
  );
}
