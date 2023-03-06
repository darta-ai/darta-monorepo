import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
} from 'react-native';
import { IconButton, Button, Snackbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import {
  DataT,
  OpenStateEnum,
  RatingEnum,
} from '../../types';
import { globalTextStyles } from '../styles';
import { icons, buttonSizes } from '../globalVariables';
import { GlobalText } from '../GlobalElements';
import { galleryInteractionStyles } from '../Gallery/galleryStyles';

const artworkPortraitStyle = {
  backgroundColor: '#FFF',
};

export function TombstonePortrait({
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
    artOnDisplay:DataT | undefined,
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
  if (height && width && height >= width) {
    artHeight = 95;
    artWidth = `${(width / height) * artHeight}`;
  }
  if (height && width && height < width) {
    artWidth = 95;
    artHeight = `${(height / width) * artWidth}`;
  }
  return (
    <>
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#FFF',
        padding: 10,
      }}
      >
        <View style={{
          alignSelf: 'flex-start',
          justifyContent: 'flex-start',
        }}
        >
          <Button
            icon={icons.back}
            style={artworkPortraitStyle}
            accessibilityLabel="Navigate To Gallery"
            testID="tombstoneBack"
            onPress={() => toggleArtTombstone()}
          >
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                galleryInteractionStyles.textLabelsStyle,
                { justifyContent: 'flex-start' },
              ]}
            >
              back
            </GlobalText>
          </Button>
        </View>
        <View
          style={{
            height: hp('40%'),
            width: wp('95%'),
            backgroundColor: '#FFF',
            alignSelf: 'center',
            justifyContent: 'center',

          }}
        >
          <Image
            source={{ uri: artOnDisplay?.image }}
            style={{
              height: `${artHeight}%`,
              width: `${artWidth}%`,
              alignSelf: 'center',
            }}
          />
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
          }}
        >
          <ScrollView style={{ width: wp('95%'), marginTop: 20, borderTopWidth: 1 }}>
            <GlobalText style={[
              globalTextStyles.boldTitleText,
              {
                fontSize: 25,
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
              numberOfLines={5}
            >
              {artToDisplay?.title}
              {', '}
              <GlobalText>
                {artToDisplay?.date}
              </GlobalText>
            </GlobalText>
            <GlobalText
              style={[{ fontSize: 17, textAlign: 'center' },
                globalTextStyles.italicTitleText]}
              numberOfLines={1}
            >
              {artToDisplay?.medium}
            </GlobalText>
            <GlobalText
              style={[{ fontSize: 15 },
                globalTextStyles.centeredText]}
              numberOfLines={5}
            >
              {artToDisplay?.dimensionsInches.text}
              {'\n'}
            </GlobalText>
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                {
                  textAlign: 'center', fontSize: 17,
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
                  fontSize: 17,
                },
              ]}
            >
              {artToDisplay?.price}
            </GlobalText>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
            }}
            >
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
          </ScrollView>
        </View>
      </View>
      <Snackbar
        visible={visibleSnack}
        style={{ alignContent: 'center', top: '0%', width: '100%' }}
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
