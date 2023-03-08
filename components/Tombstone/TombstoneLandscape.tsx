import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
} from 'react-native';
import { Button, IconButton, Snackbar } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import {
  DataT,
  OpenStateEnum,
  RatingEnum,
} from '../../types';
import { galleryInteractionStyles } from '../Gallery/galleryStyles';
import { GlobalText } from '../GlobalElements';
import { buttonSizes, icons } from '../globalVariables';
import { globalTextStyles } from '../styles';

const artworkPortraitStyle = {

};

export function TombstoneLandscape({
  artOnDisplay,
  artOnDisplayId,
  openIdentifier,
  snackBarText,
  userArtworkRatings,
  visibleSnack,
  rateArtwork,
  setVisibleSnack,
  toggleArtTombstone,
}:
  {
    artOnDisplay:DataT | undefined
    artOnDisplayId: string | undefined
    openIdentifier: OpenStateEnum
    snackBarText: string
    userArtworkRatings: any
    visibleSnack: boolean
    // eslint-disable-next-line
    rateArtwork: (rating: RatingEnum, openIdentifier: OpenStateEnum, artOnDisplayId: string) => void
    // eslint-disable-next-line
    setVisibleSnack: (arg0: boolean) => void
    toggleArtTombstone: () => void
  }) {
  const [artToDisplay] = useState<DataT | undefined>(artOnDisplay);
  const [currentArtRating, setCurrentArtRating] = useState(userArtworkRatings[artOnDisplayId ?? '']);

  useEffect(() => {
    if (artOnDisplayId) {
      setCurrentArtRating(userArtworkRatings[artOnDisplayId]);
    }
  }, [userArtworkRatings, artOnDisplayId]);
  const dimensionsInches = artToDisplay?.dimensionsInches;

  const height = dimensionsInches?.height;
  const width = dimensionsInches?.width;

  let artHeight;
  let artWidth;
  const maxDimension = Math.floor(wp('95%') * 0.9);
  if (height && width && height >= width) {
    artHeight = maxDimension;
    artWidth = Math.floor((width / height) * artHeight);
  }
  if (height && width && height < width) {
    artWidth = maxDimension;
    artHeight = Math.floor((height / width) * artWidth);
  }

  // const larger = Math.max([artWidth, artHeight]);

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      padding: 10,
    }}
    >
      <View style={{
        flex: 0.3,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        transform: [{ rotate: '90deg' }],
      }}
      >
        <Button
          icon={icons.back}
          style={artworkPortraitStyle}
          accessibilityLabel="Navigate To Gallery"
          testID="tombstoneBack"
          onPress={() => toggleArtTombstone()}
            // TECH DEBT
            // eslint-disable-next-line react/no-children-prop
          children={undefined}
        />
      </View>
      <View
        style={{
          flex: 2,
          width: wp('95%'),
          height: wp('95%'),
          alignSelf: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <Image
          source={{ uri: artOnDisplay?.image }}
          style={{
            overflow: 'hidden',
            margin: 20,
            height: artHeight,
            width: artWidth,
            alignSelf: 'center',
            transform: [{ rotate: '90deg' }],
          }}
        />
      </View>
      <View
        style={{
          padding: 10,
          width: maxDimension,
          flex: 2,
          flexDirection: 'column',
          alignSelf: 'center',
          justifyContent: 'space-between',
          transform: [{ rotate: '90deg' }],
        }}
      >
        <View>
          <GlobalText style={[
            globalTextStyles.boldTitleText,
            {
              fontSize: 23,
              textAlign: 'center',
            },
          ]}
          >
            {artToDisplay?.artist}
          </GlobalText>
          <GlobalText
            style={[{ fontSize: 20, textAlign: 'center' },
              globalTextStyles.italicTitleText,
            ]}
          >
            {artToDisplay?.title}
            {', '}
            <GlobalText style={[globalTextStyles.baseText, { fontSize: 20 }]}>
              {artToDisplay?.date}
            </GlobalText>
          </GlobalText>
          <GlobalText
            style={[{ fontSize: 15, textAlign: 'center' },
              globalTextStyles.italicTitleText]}
            numberOfLines={1}
          >
            {artToDisplay?.medium}
          </GlobalText>
          <GlobalText
            style={[{ fontSize: 15 },
              globalTextStyles.centeredText]}
          >
            {artToDisplay?.dimensionsInches.text}
            {'\n'}
          </GlobalText>
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              {
                textAlign: 'center', fontSize: 18,
              },
            ]}
          >
            {artToDisplay?.category}
            {'\n'}
          </GlobalText>
          <GlobalText
            style={[
              globalTextStyles.italicTitleText,
              {
                textAlign: 'center',
                fontSize: 15,
              },
            ]}
          >
            {artToDisplay?.price}
          </GlobalText>
        </View>
        <View style={{
          alignSelf: 'center',
        }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View>
              <IconButton
                accessibilityLabel="Like Artwork"
                animated
                mode={currentArtRating[RatingEnum.like] ? 'contained' : 'outlined'}
                icon={icons.like}
                size={buttonSizes.medium}
                style={artworkPortraitStyle}
                testID="likeButton"
                onPress={() => {
                  if (!currentArtRating[RatingEnum.like]) {
                    rateArtwork(RatingEnum.like, openIdentifier, artOnDisplayId ?? '');
                  }
                }}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                  { justifyContent: 'flex-end' },
                ]}
              >
                like
                {currentArtRating[RatingEnum.like] && 'd'}
              </GlobalText>
            </View>
            <View>
              <IconButton
                accessibilityLabel="Save Artwork"
                animated
                mode={currentArtRating[RatingEnum.save] ? 'contained' : 'outlined'}
                icon={icons.save}
                size={buttonSizes.medium}
                style={artworkPortraitStyle}
                testID="saveButton"
                onPress={() => {
                  if (!currentArtRating[RatingEnum.save]) {
                    rateArtwork(RatingEnum.save, openIdentifier, artOnDisplayId ?? '');
                  }
                }}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                  { justifyContent: 'flex-end' },
                ]}
              >
                save
                {currentArtRating[RatingEnum.save] && 'd'}
              </GlobalText>
            </View>
            <View>
              <IconButton
                accessibilityLabel="Dislike Artwork"
                animated
                mode={currentArtRating[RatingEnum.dislike] ? 'contained' : 'outlined'}
                icon={icons.dislike}
                size={buttonSizes.medium}
                style={artworkPortraitStyle}
                testID="dislikeButton"
                onPress={() => {
                  if (!currentArtRating[RatingEnum.dislike]) {
                    rateArtwork(RatingEnum.dislike, openIdentifier, artOnDisplayId ?? '');
                  }
                }}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                  { justifyContent: 'flex-end' },
                ]}
              >
                dislike
                {currentArtRating[RatingEnum.dislike] && 'd'}
              </GlobalText>
            </View>
          </View>
        </View>
      </View>
      <Snackbar
        visible={visibleSnack}
        style={{
          alignContent: 'center',
          width: '20%',
          top: '0%',
          transform: [{ rotate: '90deg' }],
        }}
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
    </View>
  );
}
