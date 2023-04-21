import React, {useContext, useState} from 'react';
import {ImageSourcePropType, StyleSheet, View} from 'react-native';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  DEFAULT_Gallery_Image,
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../../../../globalVariables';
import {StoreContext} from '../../../../State/Store';
import {SavedArtOnDisplay} from './SavedArtworkDisplayComponents/SavedArtOnDisplay';

const galleryWallRaw = DEFAULT_Gallery_Image;

export function SavedArtworkDisplay({route}: {route: any}) {
  const {artOnDisplay} = route.params;

  const {state} = useContext(StoreContext);

  const [backgroundImage] = useState<ImageSourcePropType>({
    uri: galleryWallRaw,
  });

  const [currentZoomScale, setCurrentZoomScale] = useState<number>(0);

  const SSDartaRoute = StyleSheet.create({
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
  });

  const backgroundContainerDimensionsPixels = state.isPortrait
    ? {height: hp('60%'), width: wp('95%')}
    : {...galleryDimensionsLandscape};

  const wallHeight = 96;

  return (
    <View style={SSDartaRoute.container}>
      <OrientationLocker orientation={PORTRAIT} />
      <View
        style={[
          backgroundContainerDimensionsPixels,
          SSDartaRoute.artOnDisplayContainer,
        ]}>
        <SavedArtOnDisplay
          artImage={artOnDisplay?.image}
          backgroundImage={backgroundImage}
          backgroundImageDimensionsPixels={backgroundContainerDimensionsPixels}
          currentZoomScale={currentZoomScale}
          dimensionsInches={artOnDisplay?.dimensionsInches}
          isPortrait={state.isPortrait}
          wallHeight={wallHeight}
          // rateArtwork={rateArtwork}
          setCurrentZoomScale={setCurrentZoomScale}
        />
      </View>
    </View>
  );
}
