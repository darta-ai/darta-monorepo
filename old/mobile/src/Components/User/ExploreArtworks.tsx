import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalText} from '../../GlobalElements';
import {globalTextStyles} from '../../styles';
import {ExploreCarouselCards} from './Carousel/ExploreCarouselCards';

export function ExploreArtworks({
  headline,
  exploreData,
}: {
  headline: string;
  exploreData: {
    [key: string]: {
      id: string;
      name: string;
      preview: string;
      type: string;
      logo?: string;
    };
  };
}) {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        alignSelf: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
        width: wp('90%'),
      }}>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: hp('1%'),
        }}>
        <GlobalText
          style={[globalTextStyles.boldTitleText, {marginBottom: hp('1%`')}]}>
          {headline}
        </GlobalText>
      </View>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <ExploreCarouselCards data={exploreData} />
      </View>
    </View>
  );
}
