import React, {
  useState, useEffect,
} from 'react';
import {
  Animated,
  View,
} from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
import { galleryInteractionStyles } from '../galleryStyles';
import { icons } from '../../globalVariables';
import { GlobalText } from '../../GlobalElements';
import {
  OpenStateEnum,
  RatingEnum,
} from '../../../types';
import { globalTextStyles } from '../../styles';

function ArtRatingButtons({
  artOnDisplayId,
  fadeAnimRating,
  localButtonSizes,
  isPortrait,
  openIdentifier,
  openRatings,
  snackBarText,
  userArtworkRatings,
  visibleSnack,
  rateArtwork,
  setVisibleSnack,
  toggleButtonView,
} : {
    artOnDisplayId:string | undefined
    fadeAnimRating: Animated.Value
    localButtonSizes: any
    isPortrait:boolean
    openIdentifier: OpenStateEnum
    openRatings:boolean
    userArtworkRatings: any
    snackBarText: string
    visibleSnack: boolean
    // eslint-disable-next-line
    rateArtwork: (rating: RatingEnum, openIdentifier: OpenStateEnum, artOnDisplayId: string) => void
    // eslint-disable-next-line
    setVisibleSnack: (arg0: boolean) => void
    // eslint-disable-next-line
    toggleButtonView:(openIdentifier: OpenStateEnum) => void
  }) {
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(icons.menu);

  useEffect(() => {
    if (artOnDisplayId) {
      const artworkRating = userArtworkRatings[artOnDisplayId];
      const ratingString:string = Object.keys(artworkRating)[0];
      const ratingIcon:string = icons[`${ratingString}`] ?? icons.menu;
      setRatingDisplayIcon(ratingIcon);
    }
  }, [artOnDisplayId, userArtworkRatings]);

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
                accessibilityLabel="Like Artwork"
                animated
                disabled={!openRatings}
                icon={icons.like}
                mode="outlined"
                size={localButtonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                testID="likeButton"
                onPress={() => { rateArtwork(RatingEnum.like, openIdentifier, artOnDisplayId ?? ''); }}
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
                accessibilityLabel="Save Artwork"
                animated
                disabled={!openRatings}
                mode="outlined"
                icon={icons.save}
                size={localButtonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                testID="saveButton"
                onPress={() => { rateArtwork(RatingEnum.save, openIdentifier, artOnDisplayId ?? ''); }}
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
                accessibilityLabel="Dislike Artwork"
                animated
                mode="outlined"
                disabled={!openRatings}
                icon={icons.dislike}
                size={localButtonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                testID="dislikeButton"
                onPress={() => { rateArtwork(RatingEnum.dislike, openIdentifier, artOnDisplayId ?? ''); }}
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
              size={localButtonSizes.large}
              style={rateArtworkContainerStyle}
              accessibilityLabel="Options"
              testID="options"
              onPress={() => toggleButtonView(openIdentifier)}
            />
          </View>
        </View>
      </View>
      <Snackbar
        visible={visibleSnack}
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
