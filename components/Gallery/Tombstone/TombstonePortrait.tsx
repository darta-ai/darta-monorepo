import React from 'react';
import {Image, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {DataT} from '../../../types';
import {GlobalText} from '../../GlobalElements';
import {icons} from '../../globalVariables';
import {globalTextStyles} from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';

export function TombstonePortrait({
  artOnDisplay,
  inquireAlert
}: {
  artOnDisplay: DataT;
  inquireAlert: () => void
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
  return (
    <>
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
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
            }}
            >
            <Image
              source={{uri: artOnDisplay?.image}}
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
        <ScrollView 
        scrollEventThrottle={7}
        >
          <View
            style={{
              width: maxDimension,
              height: 'auto',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <GlobalText
              style={[
                globalTextStyles.boldTitleText,
                {
                  marginTop: hp('3%'),
                  fontSize: 20,
                  textAlign: 'center',
                },
              ]}>
              {artOnDisplay?.artist}
            </GlobalText>
            <GlobalText
              style={[
                {fontSize: 18, textAlign: 'center'},
                globalTextStyles.italicTitleText,
              ]}
              numberOfLines={5}>
              {artOnDisplay?.title}
              {', '}
              <GlobalText>{artOnDisplay?.date}</GlobalText>
            </GlobalText>
            <GlobalText
              style={[
                {fontSize: 15, textAlign: 'center'},
                globalTextStyles.italicTitleText,
              ]}
              numberOfLines={1}>
              {artOnDisplay?.medium}
            </GlobalText>
            <GlobalText
              style={[{fontSize: 12}, globalTextStyles.centeredText]}
              numberOfLines={5}>
              {artOnDisplay?.dimensionsInches.text}
              {'\n'}
            </GlobalText>
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                {
                  textAlign: 'center',
                  fontSize: 15,
                },
              ]}>
              {artOnDisplay?.category}
              {'\n'}
            </GlobalText>
            <GlobalText
              style={[
                globalTextStyles.italicTitleText,
                {
                  textAlign: 'center',
                  fontSize: 15,
                },
              ]}>
              {artOnDisplay?.price}
            </GlobalText>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems:'center',
                marginTop: hp('2%')
              }}>
                <View>
                <Button 
                icon={icons.inquire} 
                dark 
                buttonColor='black'
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
