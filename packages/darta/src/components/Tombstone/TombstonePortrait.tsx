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
import {MILK} from '@darta-styles'
import {TextElement} from '../Elements/_index';
import {icons} from '../../utils/constants';
import {globalTextStyles} from '../../styles/styles';




export function TombstonePortrait({route}: {route: any}) {

  const {artOnDisplay, inquireAlert} = route.params;

  let inputHeight = artOnDisplay?.artworkDimensions?.heightIn?.value ?? "1"
  let inputWidth = artOnDisplay?.artworkDimensions?.widthIn?.value ?? "1"

  const height = parseInt(inputHeight, 10)
  const width = parseInt(inputWidth, 10)
  
  const maxDimension = Math.floor(wp('100%') * 0.6);

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
    },
    imageContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: wp('100%'),
      height: maxDimension,
    },
    image: {
      height: artHeight,
      width: artWidth,
      alignSelf: 'center',
    },
    textContainer: {
      width: wp('90%'),
      height: 'auto',
      alignSelf: 'center',
      alignItems: 'center',
    },
    artistName: {
      marginTop: hp('3%'),
      fontSize: 20,
      textAlign: 'center',
    },
    artTitle: {fontSize: 17, textAlign: 'center'},
    artMedium: {fontSize: 15, textAlign: 'center'},
    artDimensions: {fontSize: 12},
    artPrice: {
      textAlign: 'center',
      fontSize: 14,
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
      <SafeAreaView>
        <View style={SSTombstonePortrait.container}>
          <ScrollView
            scrollEventThrottle={7}
            maximumZoomScale={6}
            minimumZoomScale={1}
            scrollToOverflowEnabled={false}
            centerContent>
            <View style={SSTombstonePortrait.imageContainer}>
              <Image
                source={{uri: artOnDisplay?.artworkImage?.value!}}
                style={SSTombstonePortrait.image}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <ScrollView scrollEventThrottle={7}>
        <View style={SSTombstonePortrait.textContainer}>
          <TextElement
            style={[
              globalTextStyles.boldTitleText,
              SSTombstonePortrait.artistName,
            ]}>
            {artOnDisplay?.artistName?.value}
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artTitle,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={5}>
            {artOnDisplay?.artworkTitle?.value}
            {', '}
            <TextElement>{artOnDisplay?.artworkCreatedYear?.value}</TextElement>
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artMedium,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={1}>
            {artOnDisplay?.artworkMedium?.value}
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artDimensions,
              globalTextStyles.centeredText,
            ]}
            numberOfLines={5}>
            {artOnDisplay?.artworkDimensions?.text}
            {'\n'}
          </TextElement>
          <TextElement style={[globalTextStyles.centeredText]}>
            {artOnDisplay?.artworkMedium?.value}
            {'\n'}
          </TextElement>
          <TextElement
            style={[
              globalTextStyles.italicTitleText,
              SSTombstonePortrait.artPrice,
            ]}>
            {artOnDisplay?.artworkPrice?.value}
          </TextElement>
        </View>
        <View style={SSTombstonePortrait.inquireButton}>
          <View>
            <Button
              icon={icons.inquire}
              dark
              buttonColor="black"
              mode="contained"
              onPress={() => inquireAlert()}>
              Inquire
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
