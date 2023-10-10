import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Artwork} from '@darta-types';
import {MILK, PRIMARY_300, PRIMARY_950, PRIMARY_600, PRIMARY_800} from '@darta-styles'
import {TextElement} from '../Elements/_index';
import {icons} from '../../utils/constants';
import {globalTextStyles} from '../../styles/styles';




export function TombstonePortrait({
  artwork,
  inquireAlert,
  likeArtwork, 
  saveArtwork,
}: {
  artwork: Artwork,
  likeArtwork: () => void,
  saveArtwork: () => void,
  inquireAlert: () => void
}) {


  let inputHeight = artwork?.artworkDimensions?.heightIn?.value ?? "1"
  let inputWidth = artwork?.artworkDimensions?.widthIn?.value ?? "1"

  const height = parseInt(inputHeight, 10)
  const width = parseInt(inputWidth, 10)


  let displayDimensionsString = "";
  if(artwork?.artworkDimensions.text.value){
    displayDimensionsString = artwork.artworkDimensions.text.value
    .replaceAll(/[\r\n]+/g, '')
    .replaceAll(' ', '')
    .replaceAll('x', ' x ')
    .replace(';', '; ')
  }
  let displayPrice = "";

  if (artwork?.artworkPrice?.value){
    displayPrice = "$" + parseInt(artwork?.artworkPrice?.value, 10)?.toLocaleString()
  }

  
  const maxDimension = Math.floor(wp('100%') * 0.7);

  let artHeight: number | undefined;
  let artWidth : number | undefined;
  if (height && width && height >= width) {
    artHeight = maxDimension;
    artWidth = Math.floor((width / height) * artHeight);
  }
  if (height && width && height < width) {
    artWidth = maxDimension;
    artHeight = Math.floor((height / width) * artWidth);
  }
  const SSTombstonePortrait = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      gap: 10,
      marginTop: hp('5%'),
    },
    imageContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: wp('100%'),
      height: hp('40%'),
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    textContainer: {
      width: wp('90%'),
      height: hp('20%'),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',

      alignSelf: 'center',
      alignItems: 'center',
    },
    artistName: {
      marginTop: hp('3%'),
      fontSize: 20,
      textAlign: 'center',
    },
    artTitle: {fontSize: 17, textAlign: 'center', color: PRIMARY_950},
    artMedium: {fontSize: 15, textAlign: 'center', color: PRIMARY_950},
    artDimensions: {fontSize: 12, color: PRIMARY_950},
    artPrice: {
      textAlign: 'center',
      fontSize: 14,
      color: PRIMARY_950
    },
    inquireButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: hp('2%'),
    },
  });
  return (
    <View style={{backgroundColor: MILK, height: hp('100%')}}>
        <View style={SSTombstonePortrait.container}>
          <ScrollView
            scrollEventThrottle={7}
            maximumZoomScale={6}
            minimumZoomScale={1}
            scrollToOverflowEnabled={false}
            centerContent>
            <View style={SSTombstonePortrait.imageContainer}>
              <Image
                source={{uri: artwork?.artworkImage?.value!}}
                style={SSTombstonePortrait.image}
              />
            </View>
          </ScrollView>
        </View>
      <ScrollView scrollEventThrottle={7}>
        <View style={SSTombstonePortrait.textContainer}>
          <TextElement
            style={[
              globalTextStyles.boldTitleText,
              SSTombstonePortrait.artistName,
            ]}>
            {artwork?.artistName?.value}
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artTitle,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={5}>
            {artwork?.artworkTitle?.value}
            {', '}
            <TextElement>{artwork?.artworkCreatedYear?.value}</TextElement>
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artMedium,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={1}>
            {artwork?.artworkMedium?.value}
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artDimensions,
              globalTextStyles.centeredText,
            ]}
            >
            {displayDimensionsString}
            {'\n'}
          </TextElement>
          <TextElement
            style={[
              globalTextStyles.italicTitleText,
              SSTombstonePortrait.artPrice,
            ]}>
            {displayPrice}
          </TextElement>
        </View>
        <View style={SSTombstonePortrait.inquireButton}>
          <View>
            <Button
              icon={icons.like}
              dark
              buttonColor={PRIMARY_300}
              mode="contained"
              onPress={() => inquireAlert()}>
              Like
            </Button>
          </View>
          <View>
            <Button
              icon={icons.save}
              dark
              buttonColor={PRIMARY_600}
              mode="contained"
              onPress={() => inquireAlert()}>
              Save
            </Button>
          </View>
          {artwork?.canInquire?.value !== "No" && (
          <View>
            <Button
              icon={icons.inquire}
              dark
              buttonColor={PRIMARY_800}
              mode="contained"
              onPress={() => inquireAlert()}>
              Inquire
            </Button>
          </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
