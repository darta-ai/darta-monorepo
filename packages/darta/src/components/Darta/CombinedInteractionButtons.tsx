import React, {useContext, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import * as Colors from '@darta-styles'

import {
  ButtonSizesT,
  IUserArtworkRated,
  OpenStateEnum,
  RatingEnum,
} from '../../typing/types';
import {icons} from '../../utils/constants';
import {galleryInteractionStyles} from '../../styles/styles';
import {ETypes, StoreContext} from '../../state/Store';
import { Artwork, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import { deleteArtworkRelationshipAPI } from '../../utils/apiCalls';

export function CombinedInteractionButtons({
  artOnDisplay,
  fadeAnimRating,
  localButtonSizes,
  isPortrait,
  openRatings,
  rateArtwork,
  toggleButtonView,
}: {
  artOnDisplay: Artwork;
  fadeAnimRating: Animated.Value;
  localButtonSizes: ButtonSizesT;
  isPortrait: boolean;
  openRatings: boolean;
  rateArtwork: (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => void;
  toggleButtonView: (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => void;
}) {
  const [ratingDisplayIcon, setRatingDisplayIcon] = useState<string>(
    icons.thumbsUpDown,
  );
  const [ratingDisplayColor, setRatingDisplayColor] =
    useState<string>(Colors.PRIMARY_500);

  const [isRated, setIsRated] = useState<boolean>(false);

  const [currentArtRating, setCurrentArtRating] = useState<IUserArtworkRated>({});

  const {state, dispatch} = useContext(StoreContext);

  React.useEffect(() => {
    console.log('!!!!s')
    modifyDisplayRating()
  }, [artOnDisplay, state.userLikedArtwork, state.userDislikedArtwork, state.userSavedArtwork])

  const handleArtworkRating = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = state?.userLikedArtwork;
    const dislikedArtworks = state?.userDislikedArtwork;
    const savedArtworks = state?.userSavedArtwork;
    const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
    const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
    const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false
    const userRated = userLiked || userSaved || userDisliked

    if (userLiked && rating === USER_ARTWORK_EDGE_RELATIONSHIP.LIKE){
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
      dispatch({
        type: ETypes.removeUserLikedArtwork,
        artworkId: artOnDisplay._id,
      })
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userSaved && rating === USER_ARTWORK_EDGE_RELATIONSHIP.SAVE){
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
      dispatch({
        type: ETypes.removeUserSavedArtwork,
        artworkId: artOnDisplay._id,
      })
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userDisliked && rating === USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE){
      dispatch({
        type: ETypes.removeUserDislikedArtwork,
        artworkId: artOnDisplay._id,
      })
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userRated){
      if (userLiked){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
        dispatch({
          type: ETypes.removeUserLikedArtwork,
          artworkId: artOnDisplay._id,
        })
      } else if (userSaved){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
        dispatch({
          type: ETypes.removeUserSavedArtwork,
          artworkId: artOnDisplay._id,
        })
      } else if (userDisliked){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
        dispatch({
          type: ETypes.removeUserDislikedArtwork,
          artworkId: artOnDisplay._id,
        })
      }
      return rating
    } else {
      return rating
    }
  }

  const modifyDisplayRating = () => {
    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = state?.userLikedArtwork;
    const dislikedArtworks = state?.userDislikedArtwork;
    const savedArtworks = state?.userSavedArtwork;
    
    const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
    const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
    const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false

     if (userSaved){
      setCurrentArtRating({[RatingEnum.save]: true})
      setRatingDisplayColor(Colors.PRIMARY_PROGRESS)
      setIsRated(true)
      setRatingDisplayIcon(icons.save)
    } else if (userLiked){
      setCurrentArtRating({[RatingEnum.like]: true})
      setRatingDisplayColor(Colors.PRIMARY_800)
      setIsRated(true)
      setRatingDisplayIcon(icons.like)
    } else if (userDisliked){
      setCurrentArtRating({[RatingEnum.dislike]: true})
      setRatingDisplayColor(Colors.PRIMARY_800)
      setIsRated(true)
      setRatingDisplayIcon(icons.dislike)
    } else {
      setRatingDisplayColor(Colors.PRIMARY_900)
      setCurrentArtRating({})
      setIsRated(false)
      setRatingDisplayIcon(icons.thumbsUpDown)
    }
  };

  const SSCombinedInteractionButtons = StyleSheet.create({
    containerPortrait: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: 30
    },
    containerLandscape: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    iconButtonTombstone: {
      flex: 1,
      height: '100%',
      alignSelf: 'center',
    },
    iconButtonContainer: {
      flex: 4,
    },
    animatedView: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      alignSelf: 'center',
      alignItems: 'center',
      width: '100%',
    },
    globalTextJustifyEnd: {
      justifyContent: 'flex-end',
    },
    viewOptionsIconButton: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      width: '0%'
    },
  });

  const ratingContainer = isPortrait
  ? SSCombinedInteractionButtons.containerPortrait
  : SSCombinedInteractionButtons.containerLandscape;


  return (
    <View style={ratingContainer}>
      <View style={SSCombinedInteractionButtons.iconButtonContainer}>
        <Animated.View
          style={[
            SSCombinedInteractionButtons.animatedView,
            {
              opacity: fadeAnimRating,
            },
          ]}>
          <View>
            <IconButton
              accessibilityLabel="Like Artwork"
              animated
              disabled={!openRatings}
              icon={icons.like}
              iconColor={
                currentArtRating[RatingEnum.like] ? Colors.PRIMARY_800 : Colors.PRIMARY_200
              }
              mode={
                currentArtRating[RatingEnum.like] ? 'contained' : 'outlined'
              }
              size={localButtonSizes.medium}
              style={galleryInteractionStyles.secondaryButton}
              testID="likeButton"
              onPress={async () => {
                rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.LIKE));
              }}
            />
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
                  ? Colors.PRIMARY_PROGRESS
                  : Colors.PRIMARY_200
              }
              icon={icons.save}
              size={localButtonSizes.medium}
              style={galleryInteractionStyles.secondaryButton}
              testID="saveButton"
              onPress={async () => {
                rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.SAVE));
              }}
            />
          </View>
          <View>
            <IconButton
              accessibilityLabel="Dislike Artwork"
              animated={true}
              mode={
                currentArtRating[RatingEnum.dislike] ? 'contained' : 'outlined'
              }
              iconColor={
                currentArtRating[RatingEnum.dislike]
                  ? Colors.PRIMARY_800
                  : Colors.PRIMARY_200
              }
              disabled={!openRatings}
              icon={icons.dislike}
              size={localButtonSizes.medium}
              style={galleryInteractionStyles.secondaryButton}
              testID="dislikeButton"
              onPress={async () => {
                rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE));
              }}
            />
          </View>
        </Animated.View>
      </View>
      <View style={SSCombinedInteractionButtons.viewOptionsIconButton}>
        <IconButton
          animated
          mode={isRated ? 'contained' : 'outlined'}
          icon={openRatings ? icons.minus : ratingDisplayIcon}
          size={localButtonSizes.medium}
          iconColor={ratingDisplayColor}
          style={galleryInteractionStyles.mainButtonPortrait}
          accessibilityLabel="Options"
          testID="options"
          onPress={() => toggleButtonView(OpenStateEnum.openRatings)}
          onLongPress={() => toggleButtonView(OpenStateEnum.openRatings)}
        />
      </View>
    </View>
  );
}
