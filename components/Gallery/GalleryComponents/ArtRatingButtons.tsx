import React, {
  useState, useRef, useEffect, Dispatch, SetStateAction,
} from 'react';
import {
  Animated,
  View,
} from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
import { galleryInteractionStyles } from '../galleryStyles';
import { icons, duration, buttonSizes } from '../../globalVariables';
import { GlobalText } from '../../GlobalElements';
import { UserArtworkRated } from '../../../types';
import { globalTextStyles } from '../../styles';

function ArtRatingButtons({
  isPortrait,
  openRatings,
  userArtworkRatings,
  artOnDisplayId,
  userArtworkRated,
  setOpenRatings,
} : {
    isPortrait:boolean
    openRatings:boolean
    userArtworkRatings: any
    artOnDisplayId:string | undefined
    // eslint-disable-next-line no-unused-vars
    userArtworkRated: (arg0: UserArtworkRated) => void
    setOpenRatings:Dispatch<SetStateAction<boolean>>
  }) {
  const fadeAnimRate = useRef(new Animated.Value(1)).current;
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

  const fadeInRating = () => {
    setOpenRatings(!openRatings);
    Animated.timing(fadeAnimRate, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutRating = async () => {
    Animated.timing(fadeAnimRate, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => setOpenRatings(!openRatings));
  };

  const openCloseRating = (): void => {
    if (openRatings) {
      fadeOutRating();
    } else {
      fadeInRating();
    }
  };

  const saveArtwork = () => {
    if (artOnDisplayId) {
      userArtworkRated({
        [artOnDisplayId]: {
          save: true,
        },
      });
      setSnackBarText('Saved 💛😍');
      openCloseRating();
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
      openCloseRating();
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
      openCloseRating();
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
            {openRatings && (
            <Animated.View
              style={[galleryInteractionStyles.animatedContainer, {
                opacity: fadeAnimRate,
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
            )}
            <IconButton
              mode="outlined"
              icon={openRatings ? icons.minus : ratingDisplayIcon}
              size={buttonSizes.large}
              style={rateArtworkContainerStyle}
              accessibilityLabel="Options"
              testID="options"
              onPress={() => openCloseRating()}
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
