import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  View,
  StatusBar,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GlobalText} from '../../GlobalElements';
import {DARK_BLUE, DARK_GRAY, LIGHT_GREY} from '../../../assets/styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Badge} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from 'react-native-paper';
import {globalTextStyles} from '../../styles';
import {buttonSizes} from '../../globalVariables';
import {getButtonSizes} from '../../../functions/galleryFunctions';

export function GallerySelectorComponent({
  headline,
  subHeadline,
  localButtonSizes,
  image,
  showBadge,
  notificationNumber,
}: {
  headline: string;
  subHeadline: string;
  image: string;
  showBadge: boolean;
  notificationNumber?: number;
  localButtonSizes: {
    small: number;
    medium: number;
    large: number;
  };
}) {
  return (
    <TouchableOpacity
      style={[
        styles.componentContainer,
        {
          height: hp('7%'),
          width: wp('90%'),
        },
      ]}>
      <View style={{flex: 0.15, justifyContent: 'center', alignSelf: 'center'}}>
        <Badge
          visible={showBadge}
          size={localButtonSizes.medium}
          style={styles.badgeContainer}
          children={<Text style={styles.badgeText}>{notificationNumber}</Text>}
        />
      </View>
      <View
        style={{
          flex: 0.05,
          borderLeftColor: LIGHT_GREY,
          borderLeftWidth: 3,
          borderTopLeftRadius: hp('0.3%'),
          borderBottomLeftRadius: hp('2%'),
        }}></View>
      <View style={{flex: 0.8, justifyContent: 'center'}}>
        <GlobalText style={[globalTextStyles.titleText, {color: LIGHT_GREY}]}>
          {headline}
        </GlobalText>
        <GlobalText
          style={[globalTextStyles.italicTitleText, {color: LIGHT_GREY}]}>
          {subHeadline}
        </GlobalText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    margin: hp('0.2%'),
    borderTopLeftRadius: hp('1%'),
    borderBottomLeftRadius: hp('2%'),
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: DARK_GRAY,
    borderTopRightRadius: hp('2%'),
    borderBottomRightRadius: 5,
    justifyContent: 'center',
  },
  badgeContainer: {
    backgroundColor: LIGHT_GREY,
    margin: hp('1%'),
  },
  badgeText: {
    color: DARK_BLUE,
    fontSize: 15,
    textAlign: 'center',
  },
});
