import React, { useState } from 'react';
import {
  View, Image, Alert,
} from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { DataT } from '../../types';
import { globalTextStyles } from '../styles';
import { icons, buttonSizes } from '../globalVariables';
import { GlobalText } from '../GlobalElements';
import { galleryInteractionStyles } from '../Gallery/galleryStyles';

const artworkPortraitStyle = {
  backgroundColor: '#FFF',
};

export function TombstoneLandscape({ artOnDisplay, toggleArtDetails }:
  {artOnDisplay:DataT | undefined, toggleArtDetails: () => void}) {
  const [artToDisplay] = useState<DataT | undefined>(artOnDisplay);

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
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        width: hp('10%'),
        transform: [{ rotate: '90deg' }],
      }}
      >
        <Button
          icon={icons.back}
          style={artworkPortraitStyle}
          accessibilityLabel="Like Artwork"
          testID="likeButton"
          onPress={() => toggleArtDetails()}
        >
          {/* <GlobalText
            style={[
              globalTextStyles.centeredText,
              galleryInteractionStyles.textLabelsStyle,
              { justifyContent: 'flex-start' },
            ]}
          >
            back
          </GlobalText> */}
        </Button>
      </View>
      <View
        style={{
          height: wp('80%'),
          width: hp('40%'),
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
            transform: [{ rotate: '90deg' }],
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          transform: [{ rotate: '90deg' }],
          height: wp('80%'),
          width: hp('40%'),
        }}
      >
        <ScrollView style={{

        }}
        >
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
            numberOfLines={3}
          >
            {artToDisplay?.medium}
          </GlobalText>
          <GlobalText
            style={[{ fontSize: 15 },
              globalTextStyles.centeredText]}
            numberOfLines={1}
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
                mode="outlined"
                animated
                icon={icons.like}
                size={buttonSizes.medium}
                style={artworkPortraitStyle}
                accessibilityLabel="Like Artwork"
                testID="likeButton"
                onPress={() => Alert.alert('liked')}
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
            </View>
            <View>

              <IconButton
                mode="outlined"
                animated
                icon={icons.save}
                size={buttonSizes.medium}
                style={artworkPortraitStyle}
                accessibilityLabel="Save Artwork"
                testID="saveButton"
                onPress={() => Alert.alert('saved')}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                  { justifyContent: 'flex-end' },
                ]}
              >
                save
              </GlobalText>
            </View>
            <View>

              <IconButton
                mode="outlined"
                animated
                icon={icons.dislike}
                size={buttonSizes.medium}
                style={artworkPortraitStyle}
                accessibilityLabel="Dislike Artwork"
                testID="dislikeButton"
                onPress={() => Alert.alert('disliked')}
              />
              <GlobalText
                style={[
                  globalTextStyles.centeredText,
                  galleryInteractionStyles.textLabelsStyle,
                  { justifyContent: 'flex-end' },
                ]}
              >
                dislike
              </GlobalText>

            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
