import React, { useState, useRef } from 'react';
import {
  Animated,
} from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { artRatingButtonStyles } from './styles';
import { icons, duration } from './globals';

function ArtRatingButtons({
  isPortrait,
  userArtworkRatings,
  artOnDisplayId,
  flipOrientation,
  userArtworkRated,
} : {
    isPortrait:boolean
    userArtworkRatings: string
    artOnDisplayId:string
    flipOrientation: () => void
    userArtworkRated: (obj:any) => void
  }) {
  const [open, setOpen] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState('hey hey 👋');

  const currentRating = Object.keys(userArtworkRatings).forEach((rating) => {
    if (!userArtworkRatings[rating]) delete userArtworkRatings[rating];
  });

  const ratingString = Object.keys(userArtworkRatings)[0];

  console.log('#######', artOnDisplayId, ratingString, icons[ratingString]);
  // console.log(userArtworkRatings, Object.keys(userArtworkRatings), currentRating);

  const defaultIcon = 'menu';

  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(icons[ratingString] ?? defaultIcon);

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
    const updatedUserArtworkRating = {
      saved: true,
      liked: false,
      dislike: false,
    };
    userArtworkRated(updatedUserArtworkRating);
    setSnackBarText('Saved 💛😍');
    openClose();
    setVisible(true);
  };

  const likeArtwork = () => {
    const updatedUserArtworkRating = {
      saved: false,
      liked: true,
      dislike: false,
    };
    userArtworkRated(updatedUserArtworkRating);
    setSnackBarText('Liked 👍😏');
    openClose();
    setVisible(true);
  };

  const dislikeArtwork = () => {
    const updatedUserArtworkRating = {
      saved: false,
      liked: false,
      dislike: true,
    };
    userArtworkRated(updatedUserArtworkRating);
    setSnackBarText('Disliked 👎😒');
    openClose();
    setVisible(true);
  };

  const rateArtworkContainerStyle = isPortrait ? artRatingButtonStyles.ratingContainerPortrait
    : [artRatingButtonStyles.ratingContainerLandscape, { left: hp('70%') }];

  return (
    <>
      <IconButton
        mode="outlined"
        icon={open ? icons.minus : icons.menu}
        size={40}
        style={rateArtworkContainerStyle}
        accessibilityLabel="Options"
        testID="options"
        onPress={() => openClose()}
      />
      {open && (
      <Animated.View
        style={[artRatingButtonStyles.animatedRatingsContainer, {
          opacity: fadeAnim,
        }]}
      >
        <IconButton
          mode="outlined"
          animated
          icon={icons.liked}
          size={30}
          style={artRatingButtonStyles.ratingButtonStyle}
          accessibilityLabel="Like Artwork"
          testID="likeButton"
          onPress={() => { likeArtwork(); }}
        />
        <IconButton
          mode="outlined"
          animated
          icon={icons.saved}
          size={30}
          style={artRatingButtonStyles.ratingButtonStyle}
          accessibilityLabel="Save Artwork"
          testID="saveButton"
          onPress={() => saveArtwork()}
        />
        <IconButton
          mode="outlined"
          animated
          icon={icons.disliked}
          size={30}
          style={artRatingButtonStyles.ratingButtonStyle}
          accessibilityLabel="Dislike Artwork"
          testID="dislikeButton"
          onPress={() => dislikeArtwork()}
        />
        <IconButton
          mode="outlined"
          icon={icons.screenRotation}
          size={30}
          style={artRatingButtonStyles.ratingButtonStyle}
          accessibilityLabel="Flip Screen Orientation"
          testID="flipScreenButton"
          onPress={() => flipOrientation()}
        />
      </Animated.View>
      )}
      <Snackbar
        visible={visible}
        style={
          [artRatingButtonStyles.ratingsSnackBar, {
            height: isPortrait ? undefined : hp('70%'),
            width: isPortrait ? undefined : '95%',
          }]
        }
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

export default ArtRatingButtons;
