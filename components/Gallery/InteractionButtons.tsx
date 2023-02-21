import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
} from 'react-native';
import { FAB, Provider } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const icons = {
  undecided: 'menu',
  liked: 'thumb-up-outline',
  disliked: 'thumb-down-outline',
  saved: 'heart',
  minus: 'minus',
  screenRotation: 'screen-rotation',
};

function InteractionButtons({
  isPortrait,
  flipOrientation,
} : {
    isPortrait:boolean
    flipOrientation: () => void
  }) {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }: {open: boolean}) => setState({ open });

  const { open } = state;

  const interactionButtonStyles = StyleSheet.create({
    ratingContainerPortrait: {
      position: 'absolute',
      top: hp('0%'),
      left: wp('70%'),
      borderRadius: 30,
      opacity: 0.85,
    },
    ratingContainerLandscape: {
      top: hp('0%'),
      left: wp('75%'),
      borderRadius: 30,
      transform: [{ rotate: '90deg' }],
      opacity: 0.85,
    },
    fabStyle: {
      display: 'flex',
      opacity: 0.85,
      backgroundColor: '#FFF',
      borderRadius: 30,
    },
  });

  const defaultIcon = 'menu';

  const orientationStylePortrait = {
    position: 'absolute',
    marginBottom: hp('44%'),
  };

  const orientationStyleLandscape = {
    position: 'absolute',
    marginBottom: hp('25%'),
  };

  const likedButtonStylePortrait = {
    position: 'absolute',
    marginBottom: hp('36%'),
  };

  const likedButtonStyleLandscape = {
    position: 'absolute',
    marginBottom: hp('25%'),
  };

  const disLikeButtonStylePortrait = {
    position: 'absolute',
    marginBottom: hp('28%'),
  };

  const disLikeButtonStyleLandscape = {
    position: 'absolute',
    marginBottom: hp('18%'),
  };

  const heartButtonStylePortrait = {
    position: 'absolute',
    marginBottom: hp('20%'),
  };

  const heartButtonStyleLandscape = {
    position: 'absolute',
    marginBottom: hp('11%'),
  };

  const orientationButtonStyle:any = isPortrait
    ? orientationStylePortrait
    : orientationStyleLandscape;

  const likedButtonStyle:any = isPortrait
    ? likedButtonStylePortrait : likedButtonStyleLandscape;

  const dislikeButtonStyle:any = isPortrait
    ? disLikeButtonStylePortrait : disLikeButtonStyleLandscape;

  const heartButtonStyle:any = isPortrait
    ? heartButtonStylePortrait : heartButtonStyleLandscape;

  const rateArtworkContainerStyle = isPortrait ? interactionButtonStyles.ratingContainerPortrait
    : interactionButtonStyles.ratingContainerLandscape;

  return (
    <Provider>
      <FAB.Group
        fabStyle={rateArtworkContainerStyle}
        open={open}
        visible
        icon={open ? `${icons.minus}` : `${defaultIcon}`}
        actions={[
          {
            icon: `${icons.screenRotation}`,
            style: orientationButtonStyle,
            onPress: () => flipOrientation(),
          },
          {
            icon: `${icons.liked}`,
            style: likedButtonStyle,
            onPress: () => Alert.alert('Liked!'),
          },
          {
            icon: `${icons.disliked}`,
            style: dislikeButtonStyle,
            labelTextColor: '#FFF',
            onPress: () => Alert.alert('Disliked!'),
          },
          {
            icon: `${icons.saved}`,
            labelTextColor: '#FFF',
            style: heartButtonStyle,
            onPress: () => Alert.alert('Saved!'),
          },
        ]}
        onStateChange={onStateChange}
      />
    </Provider>
  );
}

export default InteractionButtons;
