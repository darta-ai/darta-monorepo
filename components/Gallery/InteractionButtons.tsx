import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  View,
  Alert,
} from 'react-native';
import { IconButton } from 'react-native-paper';
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
  const [open, setOpen] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const duration = 250;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    setOpen(!open);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = async () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => setOpen(!open));
  };

  const openClose = (): void => {
    if (open) {
      fadeOut();
    } else {
      fadeIn();
    }
  };

  const interactionButtonStyles = StyleSheet.create({
    ratingContainerPortrait: {
      position: 'absolute',
      bottom: hp('0%'),
      left: wp('75%'),
      borderRadius: 30,
      opacity: 0.8,
      backgroundColor: '#FFF',
    },
    ratingContainerLandscape: {
      top: hp('50%'),
      left: wp('40%'),
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
    animatedButtonStyle: {
      height: hp('75%'),
    },
  });

  const defaultIcon = 'menu';

  const ratingButtonStyle = {
    position: 'absolute',
    backgroundColor: '#FFF',
    opacity: 0.9,
  };

  const orientationStylePortrait = {
    ...ratingButtonStyle,
    marginBottom: hp('24%'),
    marginRight: hp('6%'),
  };

  const orientationStyleLandscape = {
    ...ratingButtonStyle,
    marginBottom: hp('28%'),
  };

  const likedButtonStylePortrait = {
    ...ratingButtonStyle,
    top: hp('42%'),
    left: wp('76%'),
  };

  const likedButtonStyleLandscape = {
    ...ratingButtonStyle,
    marginBottom: hp('25%'),
  };

  const heartButtonStylePortrait = {
    ...ratingButtonStyle,
    top: hp('48%'),
    left: wp('76%'),
  };

  const heartButtonStyleLandscape = {
    ...ratingButtonStyle,
    marginBottom: hp('5%'),
  };

  const disLikeButtonStylePortrait = {
    ...ratingButtonStyle,
    top: hp('54%'),
    left: wp('76%'),
  };

  const disLikeButtonStyleLandscape = {
    ...ratingButtonStyle,
    marginBottom: hp('18%'),
    marginRight: hp('1.5%'),
    transition: 'width 2s',
  };

  const rotateScreenPortrait = {
    ...ratingButtonStyle,
    top: hp('60%'),
    left: wp('76%'),
  };

  const rotateScreenLandscape = {
    ...ratingButtonStyle,
    marginBottom: hp('18%'),
    marginRight: hp('1.5%'),
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

  const rotateScreenButtonStyle:any = isPortrait
    ? rotateScreenPortrait : rotateScreenLandscape;

  const rateArtworkContainerStyle = isPortrait ? interactionButtonStyles.ratingContainerPortrait
    : interactionButtonStyles.ratingContainerLandscape;

  return (
    <View style={interactionButtonStyles.animatedButtonStyle}>
      <IconButton
        mode="outlined"
        icon={open ? icons.minus : defaultIcon}
        size={40}
        style={rateArtworkContainerStyle}
        accessibilityLabel="Options"
        testID="options"
        onPress={() => openClose()}
      />
      <Animated.View
        style={{
          position: 'absolute',
          opacity: fadeAnim,
        }}
      >
        {open && (
          <>
            <IconButton
              mode="outlined"
              animated
              icon={icons.liked}
              size={30}
              style={likedButtonStyle}
              accessibilityLabel="Like Artwork"
              testID="likeButton"
              onPress={() => {
                Alert.alert('Pressed Liked!');
                openClose();
              }}
            />
            <IconButton
              mode="outlined"
              animated
              icon={icons.saved}
              size={30}
              style={heartButtonStyle}
              accessibilityLabel="Save Artwork"
              testID="saveButton"
              onPress={() => openClose()}
            />
            <IconButton
              mode="outlined"
              animated
              icon={icons.disliked}
              size={30}
              style={dislikeButtonStyle}
              accessibilityLabel="Dislike Artwork"
              testID="dislikeButton"
              onPress={() => openClose()}
            />
            <IconButton
              mode="outlined"
              icon={icons.screenRotation}
              size={30}
              style={rotateScreenButtonStyle}
              accessibilityLabel="Flip Screen Orientation"
              testID="flipScreenButton"
              onPress={() => flipOrientation()}
            />
          </>
        )}
      </Animated.View>
    </View>
  );
}

export default InteractionButtons;
