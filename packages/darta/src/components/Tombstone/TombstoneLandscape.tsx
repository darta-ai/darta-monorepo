import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Artwork} from '@darta-types';
import {TextElement} from '../Elements/_index';
import {icons} from '../../utils/constants';
import {globalTextStyles} from '../../styles/styles';


export function TombstoneLandscape({
  artOnDisplay,
  inquireAlert,
}: {
  artOnDisplay: Artwork | undefined;
  inquireAlert: () => void;
}) {
  let inputHeight = artOnDisplay?.artworkDimensions?.heightIn?.value ?? "1"
  let inputWidth = artOnDisplay?.artworkDimensions?.widthIn?.value ?? "1"

  const height = parseInt(inputHeight, 10)
  const width = parseInt(inputWidth, 10)

  let artHeight: number | undefined;
  let artWidth : number | undefined;
  const maxDimension = Math.floor(wp('95%') * 0.7);
  if (height && width && height >= width) {
    artHeight = maxDimension;
    artWidth = Math.floor((width / height) * artHeight);
  }
  if (height && width && height < width) {
    artWidth = maxDimension;
    artHeight = Math.floor((height / width) * artWidth);
  }

  return (
    <>
      <SafeAreaView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            transform: [{rotate: '90deg'}],
          }}>
          <ScrollView
            scrollEventThrottle={7}
            maximumZoomScale={6}
            minimumZoomScale={1}
            scrollToOverflowEnabled={false}
            contentContainerStyle={{
              alignSelf: 'center',
            }}
            centerContent>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                width: wp('100%'),
                height: maxDimension,
              }}>
              <Image
                source={{uri: artOnDisplay?.artworkImage?.value!}}
                style={{
                  height: artHeight,
                  width: artWidth,
                  alignSelf: 'center',
                }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <ScrollView scrollEventThrottle={7}>
        <View
          style={{
            width: maxDimension,
            height: 'auto',
            borderWidth: 1,
            borderColor: 'transparent',
            alignSelf: 'center',
            alignItems: 'center',
            transform: [{rotate: '90deg'}],
          }}>
          <TextElement
            style={[
              globalTextStyles.boldTitleText,
              {
                marginTop: hp('3%'),
                fontSize: 20,
                textAlign: 'center',
              },
            ]}>
            {artOnDisplay?.artistName?.value}
          </TextElement>
          <TextElement
            style={[
              {fontSize: 18, textAlign: 'center'},
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={5}>
            {artOnDisplay?.artworkTitle?.value}
            {', '}
            <TextElement>{artOnDisplay?.artworkCreatedYear?.value}</TextElement>
          </TextElement>
          <TextElement
            style={[
              {fontSize: 15, textAlign: 'center'},
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={1}>
            {artOnDisplay?.artworkMedium?.value}
          </TextElement>
          <TextElement
            style={[{fontSize: 12}, globalTextStyles.centeredText]}
            numberOfLines={5}>
            {artOnDisplay?.artworkDimensions?.text}
            {'\n'}
          </TextElement>
          <TextElement
            style={[
              globalTextStyles.centeredText,
              {
                textAlign: 'center',
                fontSize: 15,
              },
            ]}>
            {artOnDisplay?.artworkMedium?.value}
            {'\n'}
          </TextElement>
          <TextElement
            style={[
              globalTextStyles.italicTitleText,
              {
                textAlign: 'center',
                fontSize: 15,
              },
            ]}>
            {artOnDisplay?.artworkPrice?.value}
          </TextElement>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
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
        </View>
      </ScrollView>
    </>
  );
}

export const tombstoneStyles = StyleSheet.create({
  tombstoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  artworkContainer: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
});
