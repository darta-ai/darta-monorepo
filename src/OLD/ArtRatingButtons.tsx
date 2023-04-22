import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {
  ButtonSizesT,
  IUserArtworkRated,
  OpenStateEnum,
  RatingEnum,
} from '../../types';
import {GlobalText} from '../GlobalElements';
import {icons} from '../globalVariables';
import {galleryInteractionStyles} from '../Screens/Gallery/galleryStyles';
import {globalTextStyles} from '../styles';

function ArtRatingButtons({
  artOnDisplayId,
  fadeAnimRating,
  localButtonSizes,
  isPortrait,
  openIdentifier,
  openRatings,
  userArtworkRatings,
  rateArtwork,
  toggleButtonView,
}: {
  artOnDisplayId: string | undefined;
  fadeAnimRating: Animated.Value;
  localButtonSizes: ButtonSizesT;
  isPortrait: boolean;
  openIdentifier: OpenStateEnum;
  openRatings: boolean;
  userArtworkRatings: any;

  rateArtwork: (
    rating: RatingEnum,
    openIdentifier: OpenStateEnum,
    artOnDisplayId: string,
  ) => void;

  toggleButtonView: (openIdentifier: OpenStateEnum) => void;
}) {
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(
    icons.menu,
  );
  const [currentArtRating, setCurrentArtRating] = useState<IUserArtworkRated>(
    {},
  );

  const rateAndUpdateState = (rating: RatingEnum) => {
    setRatingDisplayIcon(icons[`${rating}`]);
    setCurrentArtRating({[rating]: true});
    rateArtwork(rating, openIdentifier, artOnDisplayId ?? '');
  };

  useEffect(() => {
    if (artOnDisplayId) {
      const artworkRating = userArtworkRatings[artOnDisplayId] ?? {};
      setCurrentArtRating(artworkRating);
      const ratingString: string = Object.keys(artworkRating)[0] ?? null;
      const ratingIcon: string = icons[`${ratingString}`] ?? icons.menu;
      setRatingDisplayIcon(ratingIcon);
    }
  }, [userArtworkRatings, artOnDisplayId]);

  const ratingContainer = isPortrait
    ? galleryInteractionStyles.containerPortrait
    : galleryInteractionStyles.containerLandscape;

  const rateArtworkContainerStyle = isPortrait
    ? galleryInteractionStyles.mainButtonPortrait
    : galleryInteractionStyles.mainButtonLandscape;

  const artRatingButtonsStyleSheet = StyleSheet.create({
    animatedViewContainer: {
      opacity: fadeAnimRating as unknown,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={ratingContainer}>
      <View style={{alignSelf: 'flex-end'}}>
        <View style={{alignSelf: 'center'}}>
          <Animated.View
            style={artRatingButtonsStyleSheet.animatedViewContainer}>
            <IconButton
              accessibilityLabel="Like Artwork"
              animated
              disabled={!openRatings}
              icon={icons.like}
              mode={
                currentArtRating[RatingEnum.like] ? 'contained' : 'outlined'
              }
              size={localButtonSizes.medium}
              style={galleryInteractionStyles.secondaryButton}
              testID="likeButton"
              onPress={() => {
                rateAndUpdateState(RatingEnum.like);
              }}
            />
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                galleryInteractionStyles.textLabelsStyle,
                {justifyContent: 'flex-end'},
              ]}>
              like
              {currentArtRating[RatingEnum.like] && 'd'}
            </GlobalText>
            <IconButton
              accessibilityLabel="Save Artwork"
              animated
              disabled={!openRatings}
              mode={
                currentArtRating[RatingEnum.save] ? 'contained' : 'outlined'
              }
              icon={icons.save}
              size={localButtonSizes.medium}
              style={galleryInteractionStyles.secondaryButton}
              testID="saveButton"
              onPress={() => {
                rateAndUpdateState(RatingEnum.save);
              }}
            />
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                galleryInteractionStyles.textLabelsStyle,
              ]}>
              save
              {currentArtRating[RatingEnum.save] && 'd'}
            </GlobalText>
            <IconButton
              accessibilityLabel="Dislike Artwork"
              animated
              mode={
                currentArtRating[RatingEnum.dislike] ? 'contained' : 'outlined'
              }
              disabled={!openRatings}
              icon={icons.dislike}
              size={localButtonSizes.medium}
              style={galleryInteractionStyles.secondaryButton}
              testID="dislikeButton"
              onPress={() => {
                rateAndUpdateState(RatingEnum.dislike);
              }}
            />
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                galleryInteractionStyles.textLabelsStyle,
              ]}>
              dislike
              {currentArtRating[RatingEnum.dislike] && 'd'}
            </GlobalText>
          </Animated.View>
          <IconButton
            mode={
              currentArtRating[RatingEnum.save] ||
              currentArtRating[RatingEnum.dislike] ||
              currentArtRating[RatingEnum.like]
                ? 'contained'
                : 'outlined'
            }
            icon={openRatings ? icons.minus : ratingDisplayIcon}
            size={localButtonSizes.large}
            style={rateArtworkContainerStyle}
            accessibilityLabel="Options"
            testID="options"
            disabled
            onPress={() => toggleButtonView(openIdentifier)}
          />
        </View>
      </View>
    </View>
  );
}

export {ArtRatingButtons};
