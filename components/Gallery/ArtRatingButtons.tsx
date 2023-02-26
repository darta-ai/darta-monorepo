import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  View,
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
    userArtworkRatings: any
    artOnDisplayId:string
    flipOrientation: () => void
    userArtworkRated: (obj:any) => void
  }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState('hey hey 👋');
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(icons.menu);

  useEffect(() => {
    const artworkRating = userArtworkRatings[artOnDisplayId];
    const ratingString = Object.keys(artworkRating)[0];
    setRatingDisplayIcon(icons[ratingString] ?? icons.menu);
  }, [open, visible, artOnDisplayId]);

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
    userArtworkRated({
      [artOnDisplayId]: {
        save: true,
      },
    });
    setSnackBarText('Saved 💛😍');
    openClose();
    setVisible(true);
  };

  const likeArtwork = () => {
    userArtworkRated({
      [artOnDisplayId]: {
        like: true,
      },
    });
    setSnackBarText('Liked 👍😏');
    openClose();
    setVisible(true);
  };

  const dislikeArtwork = () => {
    userArtworkRated({
      [artOnDisplayId]: {
        dislike: true,
      },
    });
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
        icon={open ? icons.minus : ratingDisplayIcon}
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
            icon={icons.like}
            size={30}
            style={artRatingButtonStyles.ratingButtonStyle}
            accessibilityLabel="Like Artwork"
            testID="likeButton"
            onPress={() => { likeArtwork(); }}
          />
          <IconButton
            mode="outlined"
            animated
            icon={icons.save}
            size={30}
            style={artRatingButtonStyles.ratingButtonStyle}
            accessibilityLabel="Save Artwork"
            testID="saveButton"
            onPress={() => saveArtwork()}
          />
          <IconButton
            mode="outlined"
            animated
            icon={icons.dislike}
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
          [artRatingButtonStyles.ratingsSnackBar]
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
