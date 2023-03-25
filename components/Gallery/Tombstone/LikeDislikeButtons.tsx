import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

function LikeDislikeButtons(){

    return(
        <>
                      <View>
                <IconButton
                  accessibilityLabel="Like Artwork"
                  animated
                  mode={
                    currentArtRating[RatingEnum.like] ? 'contained' : 'outlined'
                  }
                  icon={icons.like}
                  size={buttonSizes.small}
                  style={artworkPortraitStyle}
                  testID="likeButton"
                  onPress={() => {
                    if (!currentArtRating[RatingEnum.like]) {
                      rateArtwork(RatingEnum.like);
                    }
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
                  mode={
                    currentArtRating[RatingEnum.save] ? 'contained' : 'outlined'
                  }
                  icon={icons.save}
                  size={buttonSizes.small}
                  style={artworkPortraitStyle}
                  testID="saveButton"
                  onPress={() => {
                    if (!currentArtRating[RatingEnum.save]) {
                      rateArtwork(RatingEnum.save);
                    }
                  }}
                />
                <GlobalText
                  style={[
                    globalTextStyles.centeredText,
                    galleryInteractionStyles.textLabelsStyle,
                    {justifyContent: 'flex-end'},
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
                  icon={icons.dislike}
                  size={buttonSizes.small}
                  style={artworkPortraitStyle}
                  testID="dislikeButton"
                  onPress={() => {
                    if (!currentArtRating[RatingEnum.dislike]) {
                      rateArtwork(RatingEnum.dislike);
                    }
                  }}
                />
                <GlobalText
                  style={[
                    globalTextStyles.centeredText,
                    galleryInteractionStyles.textLabelsStyle,
                    {justifyContent: 'flex-end'},
                  ]}>
                  dislike
                  {currentArtRating[RatingEnum.dislike] && 'd'}
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
                  icon={icons.dislike}
                  size={buttonSizes.small}
                  style={artworkPortraitStyle}
                  testID="enquire button"
                  // onPress={() => {
                  //   if (!currentArtRating[RatingEnum.dislike]) {
                  //     rateArtwork(RatingEnum.dislike);
                  //   }
                  // }}
                />
                <GlobalText
                  style={[
                    globalTextStyles.centeredText,
                    galleryInteractionStyles.textLabelsStyle,
                    {justifyContent: 'flex-end'},
                  ]}>
                  enquire
                  {currentArtRating[RatingEnum.dislike] && 'd'}
                </GlobalText>
              </View>
              </>
    )
}