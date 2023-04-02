import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {GlobalText} from '../../GlobalElements';
import {globalTextStyles} from '../../styles';
import {ExploreCarouselCards} from './Carousel/ExploreCarouselCards';
import {GallerySelectorComponent} from './GallerySelectorComponent';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export function ExploreArtworks({
  headline,
  exploreData,
}: {
  headline: string;
  localButtonSizes: any;
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
