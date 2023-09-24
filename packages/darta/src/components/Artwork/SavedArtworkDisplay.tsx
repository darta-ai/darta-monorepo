import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK, PRIMARY_DARK_RED} from '@darta/styles';
import {
  DEFAULT_Gallery_Image,
  galleryDimensionsLandscape,
  icons,
} from '../../utils/constants';
import {UserRoutesEnum} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import {SavedArtOnDisplay} from './SavedArtOnDisplay';

const galleryWallRaw = DEFAULT_Gallery_Image;

export function SavedArtworkDisplay({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {artOnDisplay} = route.params;

  const {state, dispatch} = useContext(StoreContext);

  const [backgroundImage] = useState<ImageSourcePropType>({
    uri: galleryWallRaw,
  });

  const [showActivityIndicator, setShowActivityIndicator] =
    useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowActivityIndicator(false);
    }, 1000);
  }, []);

  const [currentZoomScale, setCurrentZoomScale] = useState<number>(0);

  const unSaveArtwork = () => {
    dispatch({
      type: ETypes.setSaveArtwork,
      artOnDisplay,
      saveWork: false,
    });
    navigation.navigate(UserRoutesEnum.userSavedArtwork);
  };

  const confirmUnsaveAlert = () =>
    Alert.alert('Are you sure?', `You may never see this work again`, [
      {
        text: `Yes, delete`,
        onPress: () => unSaveArtwork(),
        style: 'destructive',
      },
      {
        text: 'No, do not delete',
      },
    ]);

  const SSDartaGalleryView = StyleSheet.create({
    container: {
      margin: state.isPortrait ? hp('0%') : hp('2%'),
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      height: hp('60%'),
      width: wp('95%'),
      marginTop: state.isPortrait ? hp('1%') : hp('17%'),
    },
    artOnDisplayContainer: {
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],
      backgroundColor: 'black',
    },
    interactionButtonsContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    galleryViewContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    progressBarContainer: {
      alignSelf: 'center',
    },
    activityIndicator: {alignSelf: 'center', justifyContent: 'center', flex: 1},
    removeButton: {
      marginTop: hp('2%'),
    },
  });

  const backgroundContainerDimensionsPixels = state.isPortrait
    ? {height: hp('60%'), width: wp('95%')}
    : {...galleryDimensionsLandscape};

  const wallHeight = 96;

  return (
    <View style={SSDartaGalleryView.container}>
      <OrientationLocker orientation={PORTRAIT} />
      <View
        style={[
          backgroundContainerDimensionsPixels,
          SSDartaGalleryView.artOnDisplayContainer,
        ]}>
        {showActivityIndicator ? (
          <ActivityIndicator
            size="large"
            color={MILK}
            style={SSDartaGalleryView.activityIndicator}
          />
        ) : (
          <SavedArtOnDisplay
            artImage={artOnDisplay?.image}
            backgroundImage={backgroundImage}
            backgroundImageDimensionsPixels={
              backgroundContainerDimensionsPixels
            }
            currentZoomScale={currentZoomScale}
            dimensionsInches={artOnDisplay?.dimensionsInches}
            isPortrait={state.isPortrait}
            wallHeight={wallHeight}
            setCurrentZoomScale={setCurrentZoomScale}
          />
        )}
      </View>
      <View style={SSDartaGalleryView.removeButton}>
        <Button
          icon={icons.brokenHeart}
          dark
          buttonColor={PRIMARY_DARK_RED}
          mode="contained"
          onPress={() => confirmUnsaveAlert()}>
          Remove From Saved Artwork
        </Button>
      </View>
    </View>
  );
}
