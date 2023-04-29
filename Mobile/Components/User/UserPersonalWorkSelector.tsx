import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {getImages} from '../../../functions/galleryFunctions';
import {GlobalText} from '../../GlobalElements';
import {UserRoutesEnum} from '../../Navigators/Routes/userRoutes.d';
import {ETypes, StoreContext} from '../../State/Store';
import {globalTextStyles} from '../../styles';
import {GallerySelectorComponent} from './GallerySelectorComponent';

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
    let fullImages;
    setShowActivityIndicator({
      ...showActivityIndicator,
      [UserScreenSelectorEnum.savedArtwork]: true,
    });
    if (
      !state.globalGallery.savedArtwork?.isLoaded ||
      !state.artworkData.savedArtwork?.fullDGallery
    ) {
      try {
        fullImages = await getImages(state.artworkData.savedArtwork.artworkIds);
        dispatch({
          type: ETypes.loadArt,
          loadedDGallery: fullImages,
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
    let fullImages;
    setShowActivityIndicator({
      ...showActivityIndicator,
      [UserScreenSelectorEnum.inquiredArtwork]: true,
    });
    if (
      !state.globalGallery.inquiredArtwork?.isLoaded ||
      !state.artworkData?.inquiredArtwork?.fullDGallery
    ) {
      try {
        fullImages = await getImages(
          state.artworkData.inquiredArtwork.artworkIds,
        );
        dispatch({
          type: ETypes.loadArt,
          loadedDGallery: fullImages,
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
        <GlobalText
          style={[globalTextStyles.boldTitleText, {marginBottom: hp('1%`')}]}>
          {headline}
        </GlobalText>
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
        {/* <GallerySelectorComponent
          headline="g a l l e r i e s"
          subHeadline="new shows from your favorite galleries"
          showBadge={false}
          notificationNumber={15}
          localButtonSizes={localButtonSizes}
        />
        <GallerySelectorComponent
          headline="c u r a t e d"
          subHeadline="new shows from curators and galleries"
          showBadge={false}
          notificationNumber={15}
          localButtonSizes={localButtonSizes}
        /> */}
      </View>
    </View>
  );
}
