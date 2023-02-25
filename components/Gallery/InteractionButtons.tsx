import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  View,
  Alert,
} from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
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

  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState('hey hey 👋');

  const fadeIn = () => {
    setOpen(!open);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = async () => {
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

  const saveArtwork = () => {
    setSnackBarText('Saved 💛😍');
    openClose();
    setVisible(true);
  };

  const dislikeArtwork = () => {
    setSnackBarText('Disliked 👎😒');
    openClose();
    setVisible(true);
  };

  const likeArtwork = () => {
    setSnackBarText('Liked 👍😏');
    openClose();
    setVisible(true);
  };

  const interactionButtonStyles = StyleSheet.create({
    ratingContainerPortrait: {
      position: 'absolute',
      bottom: '5%',
      right: '0%',
      borderRadius: 30,
      opacity: 0.8,
      backgroundColor: '#FFF',

    },
    ratingContainerLandscape: {
      bottom: '95%',
      left: '0%',
      borderColor: 'green',
      borderWidth: 5,
      borderRadius: 30,
      transform: [{ rotate: '90deg' }],
      opacity: 0.85,
    },
  });

  const defaultIcon = 'menu';

  const ratingButtonStyle = {
    backgroundColor: '#FFF',
    opacity: 0.9,
  };

  const rateArtworkContainerStyle = isPortrait ? interactionButtonStyles.ratingContainerPortrait
    : interactionButtonStyles.ratingContainerLandscape;

  return (
    <>
      <IconButton
        mode="outlined"
        icon={open ? icons.minus : defaultIcon}
        size={40}
        style={rateArtworkContainerStyle}
        accessibilityLabel="Options"
        testID="options"
        onPress={() => openClose()}
      />
      {open && (
      <Animated.View
        style={{
          position: 'absolute',
          opacity: fadeAnim,
          top: '50%',
          left: '50%',
          width: '50%',
          height: '35%',
          flex: 1,

          paddingBottom: '5%',
          marginRight: '5%',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <IconButton
          mode="outlined"
          animated
          icon={icons.liked}
          size={30}
          style={ratingButtonStyle}
          accessibilityLabel="Like Artwork"
          testID="likeButton"
          onPress={() => { likeArtwork(); }}
        />
        <IconButton
          mode="outlined"
          animated
          icon={icons.saved}
          size={30}
          style={ratingButtonStyle}
          accessibilityLabel="Save Artwork"
          testID="saveButton"
          onPress={() => saveArtwork()}
        />
        <IconButton
          mode="outlined"
          animated
          icon={icons.disliked}
          size={30}
          style={ratingButtonStyle}
          accessibilityLabel="Dislike Artwork"
          testID="dislikeButton"
          onPress={() => dislikeArtwork()}
        />
        <IconButton
          mode="outlined"
          icon={icons.screenRotation}
          size={30}
          style={ratingButtonStyle}
          accessibilityLabel="Flip Screen Orientation"
          testID="flipScreenButton"
          onPress={() => flipOrientation()}
        />
      </Animated.View>
      )}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'OK!',
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {snackBarText}
      </Snackbar>
    </>
  );
}

export default InteractionButtons;
