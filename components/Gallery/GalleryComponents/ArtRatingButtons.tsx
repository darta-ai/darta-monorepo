import React, {
  useState, useEffect,
} from 'react';
import {
  Animated,
  View,
} from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
import { galleryInteractionStyles } from '../galleryStyles';
import { icons, buttonSizes } from '../../globalVariables';
import { GlobalText } from '../../GlobalElements';
import { UserArtworkRated, OpenStateEnum } from '../../../types';
import { globalTextStyles } from '../../styles';

function ArtRatingButtons({
  artOnDisplayId,
  fadeAnimRating,
  isPortrait,
  openIdentifier,
  openRatings,
  userArtworkRatings,
  toggleButtonView,
  userArtworkRated,
} : {
    artOnDisplayId:string | undefined
    fadeAnimRating: Animated.Value
    isPortrait:boolean
    openIdentifier: OpenStateEnum
    openRatings:boolean
    userArtworkRatings: any
    // eslint-disable-next-line
    toggleButtonView:(openIdentifier: OpenStateEnum) => void
    // eslint-disable-next-line no-unused-vars
    userArtworkRated: (arg0: UserArtworkRated) => void

  }) {
  const [visibleSmack, setVisibleSnack] = useState(false);
  const [snackBarText, setSnackBarText] = useState('hey hey 👋');
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(icons.menu);

  useEffect(() => {
    if (artOnDisplayId) {
      const artworkRating = userArtworkRatings[artOnDisplayId];
      const ratingString:string = Object.keys(artworkRating)[0];
      const ratingIcon:string = icons[`${ratingString}`] ?? icons.menu;
      setRatingDisplayIcon(ratingIcon);
    }
  }, [artOnDisplayId, userArtworkRatings]);

  const saveArtwork = () => {
    if (artOnDisplayId) {
      userArtworkRated({
        [artOnDisplayId]: {
          save: true,
        },
      });
      setSnackBarText('Saved 💛😍');
      toggleButtonView(openIdentifier);
      setVisibleSnack(true);
    }
  };

  const likeArtwork = () => {
    if (artOnDisplayId) {
      userArtworkRated({
        [artOnDisplayId]: {
          like: true,
        },
      });
      setSnackBarText('Liked 👍😏');
      toggleButtonView(openIdentifier);
      setVisibleSnack(true);
    }
  };

  const dislikeArtwork = () => {
    if (artOnDisplayId) {
      userArtworkRated({
        [artOnDisplayId]: {
          dislike: true,
        },
      });
      setSnackBarText('Disliked 👎😒');
      toggleButtonView(openIdentifier);
      setVisibleSnack(true);
    }
  };

  const ratingContainer = isPortrait
    ? galleryInteractionStyles.containerPortrait
    : galleryInteractionStyles.containerLandscape;

  const flexContainer = isPortrait
    ? galleryInteractionStyles.containerPortraitFlex
    : galleryInteractionStyles.containerLandscapeFlex;

  const rateArtworkContainerStyle = isPortrait
    ? galleryInteractionStyles.mainButtonPortrait
    : galleryInteractionStyles.mainButtonLandscape;

  return (
    <>
      <View style={ratingContainer}>
        <View style={[flexContainer, { alignSelf: 'flex-end' }]}>
          <View style={{ alignSelf: 'flex-end' }}>
            <Animated.View
              style={[galleryInteractionStyles.animatedContainer, {
                opacity: fadeAnimRating,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }]}
            >
              <IconButton
                mode="outlined"
                animated
                icon={icons.like}
                size={buttonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                accessibilityLabel="Like Artwork"
                testID="likeButton"
                onPress={() => { likeArtwork(); }}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                  { justifyContent: 'flex-end' },
                ]}
              >
                like
              </GlobalText>
              <IconButton
                mode="outlined"
                animated
                icon={icons.save}
                size={buttonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                accessibilityLabel="Save Artwork"
                testID="saveButton"
                onPress={() => saveArtwork()}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                ]}
              >
                save
              </GlobalText>
              <IconButton
                mode="outlined"
                animated
                icon={icons.dislike}
                size={buttonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                accessibilityLabel="Dislike Artwork"
                testID="dislikeButton"
                onPress={() => dislikeArtwork()}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                ]}
              >
                dislike
              </GlobalText>
            </Animated.View>
            <IconButton
              mode="outlined"
              icon={openRatings ? icons.minus : ratingDisplayIcon}
              size={buttonSizes.large}
              style={rateArtworkContainerStyle}
              accessibilityLabel="Options"
              testID="options"
              onPress={() => toggleButtonView(openIdentifier)}
            />
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                galleryInteractionStyles.textLabelsStyle,
              ]}
            >
              rate
            </GlobalText>
          </View>
        </View>
      </View>
      <Snackbar
        visible={visibleSmack}
        style={{ alignContent: 'center', top: '0%' }}
        onDismiss={() => setVisibleSnack(false)}
        action={{
          label: 'OK!',
          onPress: () => {
            setVisibleSnack(false);
          },
        }}
      >
        {snackBarText}
      </Snackbar>
    </>
  );
}

export { ArtRatingButtons };
