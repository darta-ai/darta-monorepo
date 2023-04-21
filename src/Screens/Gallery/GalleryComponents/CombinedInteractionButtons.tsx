import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Animated, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  PRIMARY_BLUE,
  PRIMARY_GREY,
  PRIMARY_PROGRESS,
  PRIMARY_RED,
} from '../../../../assets/styles';
import {
  ButtonSizesT,
  IUserArtworkRated,
  OpenStateEnum,
  RatingEnum,
} from '../../../../types';
import {GlobalText} from '../../../GlobalElements';
import {icons} from '../../../globalVariables';
import {StoreContext} from '../../../State/Store';
import {globalTextStyles} from '../../../styles';
import {galleryInteractionStyles} from '../galleryStyles';

function CombinedInteractionButtons({
  fadeAnimRating,
  localButtonSizes,
  isPortrait,
  openRatings,
  rateArtwork,
  toggleArtTombstone,
  toggleButtonView,
}: {
  fadeAnimRating: Animated.Value;
  localButtonSizes: ButtonSizesT;
  isPortrait: boolean;
  openRatings: boolean;
  rateArtwork: (rating: RatingEnum, openIdentifier: OpenStateEnum) => void;
  toggleArtTombstone: () => void;
  toggleButtonView: (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => void;
}) {
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(
    icons.save,
  );
  const [ratingDisplayColor, setRatingDisplayColor] =
    useState<string>(PRIMARY_GREY);

  const [isRated, setIsRated] = useState<boolean>(false);

  const [currentArtRating, setCurrentArtRating] = useState<IUserArtworkRated>(
    {},
  );

  const {state} = useContext(StoreContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const modifyDisplayRating = useCallback(() => {
    const {artworkOnDisplayId} = state;
    const ratingObject = state.userArtworkRatings[artworkOnDisplayId];

    if (ratingObject) {
      const ratingString = Object.keys(ratingObject)[0];
      setRatingDisplayIcon(icons[ratingString] || icons.thumbsUpDown);
      switch (ratingString) {
        case RatingEnum.like:
          setRatingDisplayColor(PRIMARY_BLUE);
          break;
        case RatingEnum.dislike:
          setRatingDisplayColor(PRIMARY_RED);
          break;
        case RatingEnum.save:
          setRatingDisplayColor(PRIMARY_PROGRESS);
          break;
        default:
          setRatingDisplayColor(PRIMARY_GREY);
          break;
      }
    } else {
      toggleButtonView(OpenStateEnum.openRatings, false);
    }
    const ratingBool =
      ratingObject[RatingEnum.save] ||
      ratingObject[RatingEnum.dislike] ||
      ratingObject[RatingEnum.like];
    setIsRated(ratingBool as boolean);
    setCurrentArtRating(ratingObject || {});
  });

  // useEffect(() => {
  //   console.log('triggered in use Effect1');
  //   modifyDisplayRating();
  // }, []);

  useEffect(() => {
    modifyDisplayRating();
  }, [state]);

  const ratingContainer = isPortrait
    ? galleryInteractionStyles.containerPortrait
    : galleryInteractionStyles.containerLandscape;

  return (
    <>
      <View
        style={[
          ratingContainer,
          {flexDirection: 'row', bottom: '10%', maxHeight: hp('10%')},
        ]}>
        <View
          style={{
            flex: 1,
            height: '100%',
            alignSelf: 'center',
          }}>
          <IconButton
            icon={icons.learnMore}
            mode="outlined"
            size={localButtonSizes.medium}
            iconColor={PRIMARY_GREY}
            style={galleryInteractionStyles.secondaryButton}
            accessibilityLabel="view tombstone"
            testID="tombstone"
            onPress={() => toggleArtTombstone()}
          />
        </View>
        <View
          style={{
            flex: 4,
          }}>
          <Animated.View
            style={{
              opacity: fadeAnimRating,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View>
              <IconButton
                accessibilityLabel="Like Artwork"
                animated
                disabled={!openRatings}
                icon={icons.like}
                iconColor={
                  currentArtRating[RatingEnum.like]
                    ? PRIMARY_BLUE
                    : PRIMARY_GREY
                }
                mode={
                  currentArtRating[RatingEnum.like] ? 'contained' : 'outlined'
                }
                size={localButtonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                testID="likeButton"
                onPress={() => {
                  rateArtwork(RatingEnum.like, OpenStateEnum.openRatings);
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
            </View>
            <View>
              <IconButton
                accessibilityLabel="Save Artwork"
                animated
                disabled={!openRatings}
                mode={
                  currentArtRating[RatingEnum.save] ? 'contained' : 'outlined'
                }
                iconColor={
                  currentArtRating[RatingEnum.save]
                    ? PRIMARY_PROGRESS
                    : PRIMARY_GREY
                }
                icon={icons.save}
                size={localButtonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                testID="saveButton"
                onPress={() => {
                  rateArtwork(RatingEnum.save, OpenStateEnum.openRatings);
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
            </View>
            <View>
              <IconButton
                accessibilityLabel="Dislike Artwork"
                animated
                mode={
                  currentArtRating[RatingEnum.dislike]
                    ? 'contained'
                    : 'outlined'
                }
                iconColor={
                  currentArtRating[RatingEnum.dislike]
                    ? PRIMARY_RED
                    : PRIMARY_GREY
                }
                disabled={!openRatings}
                icon={icons.dislike}
                size={localButtonSizes.medium}
                style={galleryInteractionStyles.secondaryButton}
                testID="dislikeButton"
                onPress={() => {
                  rateArtwork(RatingEnum.dislike, OpenStateEnum.openRatings);
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
            </View>
          </Animated.View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            height: '100%',
          }}>
          <IconButton
            animated
            mode={isRated ? 'contained' : 'outlined'}
            icon={openRatings ? icons.minus : ratingDisplayIcon}
            size={isRated ? localButtonSizes.large : localButtonSizes.medium}
            iconColor={ratingDisplayColor}
            style={galleryInteractionStyles.mainButtonPortrait}
            accessibilityLabel="Options"
            testID="options"
            onPress={() => toggleButtonView(OpenStateEnum.openRatings)}
            onLongPress={() => toggleButtonView(OpenStateEnum.openRatings)}
          />
        </View>
      </View>
      {/* <Snackbar
        visible={visibleSnack}
        style={{alignContent: 'center', top: '0%'}}
        onDismiss={() => setVisibleSnack(false)}
        action={{
          label: 'OK!',
          onPress: () => {
            setVisibleSnack(false);
          },
        }}>
        {snackBarText}
      </Snackbar> */}
    </>
  );
}

export {CombinedInteractionButtons};
