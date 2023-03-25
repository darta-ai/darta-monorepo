import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useState} from 'react';
import {View, Alert} from 'react-native';

import {TombstoneLandscape, TombstonePortrait} from '.';
import {
  GalleryNavigatorEnum,
  GalleryRootStackParamList,
} from '../galleryRoutes.d';
import {ETypes, StoreContext} from '../galleryStore';
import {OpenStateEnum, RatingEnum, SnackTextEnum} from '../../../types';

type ProfileScreenNavigationProp = StackNavigationProp<
  GalleryRootStackParamList,
  GalleryNavigatorEnum.tombstone
>;

export function TombstoneRoute({
  route,
}: {
  navigation: ProfileScreenNavigationProp;
  route: any;
}) {
  const {artOnDisplay} = route.params;

  const {state} = useContext(StoreContext);


  const inquireAlert = () =>
    Alert.alert('We\'ll reach out', 'How would you like to get in contact?', [
      {
        text: 'Email: fake.email@gmail.com',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Text: (415)612-3214',
        onPress: () => console.log('Cancel Pressed')
      },
      {text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'destructive'},
    ]);

  return (
    <View>
      {state.isPortrait ? (
        <TombstonePortrait
          artOnDisplay={artOnDisplay}
          inquireAlert={inquireAlert}
        />
      ) : (
        <TombstoneLandscape
        artOnDisplay={artOnDisplay}
        inquireAlert={inquireAlert}
        />
      )}
    </View>
  );
}
