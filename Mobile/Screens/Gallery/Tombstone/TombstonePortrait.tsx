import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';

import {DataT} from '../../../../types';
import {GlobalText} from '../../../GlobalElements';
import {icons} from '../../../globalVariables';
import {globalTextStyles} from '../../../styles';

export function TombstonePortrait({
  artOnDisplay,
  inquireAlert,
}: {
  artOnDisplay: DataT;
  inquireAlert: () => void;
}) {
  const dimensionsInches = artOnDisplay?.dimensionsInches;

  const height = dimensionsInches?.height;
  const width = dimensionsInches?.width;

  let artHeight;
  let artWidth;
  const maxDimension = Math.floor(wp('100%') * 0.6);
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
    <>
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
                source={{uri: artOnDisplay?.image}}
                style={SSTombstonePortrait.image}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <ScrollView scrollEventThrottle={7}>
        <View style={SSTombstonePortrait.textContainer}>
          <GlobalText
            style={[
              globalTextStyles.boldTitleText,
              SSTombstonePortrait.artistName,
            ]}>
            {artOnDisplay?.artist}
          </GlobalText>
          <GlobalText
            style={[
              SSTombstonePortrait.artTitle,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={5}>
            {artOnDisplay?.title}
            {', '}
            <GlobalText>{artOnDisplay?.date}</GlobalText>
          </GlobalText>
          <GlobalText
            style={[
              SSTombstonePortrait.artMedium,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={1}>
            {artOnDisplay?.medium}
          </GlobalText>
          <GlobalText
            style={[
              SSTombstonePortrait.artDimensions,
              globalTextStyles.centeredText,
            ]}
            numberOfLines={5}>
            {artOnDisplay?.dimensionsInches.text}
            {'\n'}
          </GlobalText>
          <GlobalText style={[globalTextStyles.centeredText]}>
            {artOnDisplay?.category}
            {'\n'}
          </GlobalText>
          <GlobalText
            style={[
              globalTextStyles.italicTitleText,
              SSTombstonePortrait.artPrice,
            ]}>
            {artOnDisplay?.price}
          </GlobalText>
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
    </>
  );
}
