import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {globalTextStyles} from '../../styles/styles';
import {ExploreCarouselCards} from '../Explore/Carousel/ExploreCarouselCards';

export function ArtworksCarousel({
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
        <TextElement
          style={[globalTextStyles.boldTitleText, {marginBottom: hp('1%`')}]}>
          {headline}
        </TextElement>
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
