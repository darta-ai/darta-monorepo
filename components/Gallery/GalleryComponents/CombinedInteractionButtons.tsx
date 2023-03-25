import React, {useContext, useEffect, useState} from 'react';
import {Animated, View} from 'react-native';
import {IconButton, Snackbar} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  ButtonSizesT,
  IUserArtworkRated,
  OpenStateEnum,
  RatingEnum,
} from '../../../types';
import {GlobalText} from '../../GlobalElements';
import {icons} from '../../globalVariables';
import {globalTextStyles} from '../../styles';
import {galleryInteractionStyles} from '../galleryStyles';
import {StoreContext} from '../galleryStore';

function CombinedInteractionButtons({
  fadeAnimRating,
  localButtonSizes,
  isPortrait,
  openRatings,
  snackBarText,
  visibleSnack,
  rateArtwork,
  setVisibleSnack,
  toggleArtTombstone,
  toggleButtonView,
}: {
  fadeAnimRating: Animated.Value;
  galleryId: string;
  localButtonSizes: ButtonSizesT;
  isPortrait: boolean;
  openRatings: boolean;
  openNav: boolean;
  snackBarText: string;
  visibleSnack: boolean;
  // eslint-disable-next-line
  rateArtwork: (rating: RatingEnum, openIdentifier: OpenStateEnum) => void;
  // eslint-disable-next-line
  setVisibleSnack: (arg0: boolean) => void;
  toggleArtTombstone: () => void;
  // eslint-disable-next-line
  toggleButtonView: (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => void;
}) {
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(
    icons.menu,
  );
  const [currentArtRating, setCurrentArtRating] = useState<IUserArtworkRated>(
    {},
  );

  const {state} = useContext(StoreContext);

  const modifyDisplayRating = () => {
    const artworkOnDisplayId = state.artworkOnDisplayId;
    const ratingObject = state.userArtworkRatings[artworkOnDisplayId];
    if (ratingObject) {
      const ratingString = Object.keys(ratingObject)[0];
      setRatingDisplayIcon(icons[ratingString] || icons.menu);
    } else {
      toggleButtonView(OpenStateEnum.openRatings, false);
    }
    setCurrentArtRating(ratingObject || {});
  };

  useEffect(() => {
    modifyDisplayRating();
  }, []);

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
            size={localButtonSizes.large}
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
            mode={
              currentArtRating[RatingEnum.save] ||
              currentArtRating[RatingEnum.dislike] ||
              currentArtRating[RatingEnum.like]
                ? 'contained'
                : 'outlined'
            }
            icon={openRatings ? icons.minus : ratingDisplayIcon}
            size={localButtonSizes.large}
            style={galleryInteractionStyles.mainButtonPortrait}
            accessibilityLabel="Options"
            testID="options"
            onPress={() => toggleButtonView(OpenStateEnum.openRatings)}
          />
        </View>
      </View>
      <Snackbar
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
      </Snackbar>
    </>
  );
}

export {CombinedInteractionButtons};
