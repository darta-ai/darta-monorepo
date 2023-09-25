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
  const {state, dispatch} = React.useContext(StoreContext);

  const [showActivityIndicator, setShowActivityIndicator] =
    useState<ShowActivityIndicator>({
      [UserScreenSelectorEnum.savedArtwork]: false,
      [UserScreenSelectorEnum.inquiredArtwork]: false,
    });

  const navigateToSaved = async () => {
    setShowActivityIndicator({
      ...showActivityIndicator,
      [UserScreenSelectorEnum.savedArtwork]: true,
    });
    if (
      !state.dartaData.savedArtwork?.isLoaded ||
      !state.artworkData.savedArtwork?.artworkIds
    ) {
      try {
        dispatch({
          type: ETypes.loadArt,
          loadedDGallery: [],
          galleryId: UserScreenSelectorEnum.savedArtwork,
        });
      } catch (e) {
        Alert.alert('Unable to load saved artwork 🧑‍💻🤦');
      }
    }

    setShowActivityIndicator({
      ...showActivityIndicator,
      [UserScreenSelectorEnum.savedArtwork]: false,
    });
    return navigation.navigate(UserRoutesEnum.userSavedArtwork);
  };

  const navigateToInquired = async () => {
    setShowActivityIndicator({
      ...showActivityIndicator,
      [UserScreenSelectorEnum.inquiredArtwork]: true,
    });
    if (
      !state.dartaData.savedArtwork?.isLoaded ||
      !state.artworkData.savedArtwork?.artworkIds
    ) {
      try {
        // fullImages = await getImages(
        //   state.artworkData.inquiredArtwork.artworkIds,
        // );
        dispatch({
          type: ETypes.loadArt,
          loadedDGallery: [],
          galleryId: 'inquiredArtwork',
        });
      } catch (e) {
        Alert.alert('Unable to load saved artwork 🧑‍💻🤦');
      }
    }

    setShowActivityIndicator({
      ...showActivityIndicator,
      [UserScreenSelectorEnum.inquiredArtwork]: false,
    });
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
            showActivityIndicator={
              showActivityIndicator[UserScreenSelectorEnum.savedArtwork]
            }
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
            showActivityIndicator={
              showActivityIndicator[UserScreenSelectorEnum.inquiredArtwork]
            }
            showBadge={false}
            notificationNumber={15}
            localButtonSizes={localButtonSizes}
          />
        </Pressable>
      </View>
    </View>
  );
}
