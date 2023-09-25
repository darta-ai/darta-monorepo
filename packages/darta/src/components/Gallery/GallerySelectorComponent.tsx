import {DARK_GRAY, MILK, PRIMARY_BLUE, PRIMARY_DARK_GREY} from '@darta-styles';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Badge, Text} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {globalTextStyles} from '../../styles/styles';
import {TextElement} from '../Elements/_index';

const SSGallerySelectorComponent = StyleSheet.create({
  componentContainer: {
    margin: hp('0.2%'),
    borderTopLeftRadius: hp('1%'),
    borderBottomLeftRadius: hp('2%'),
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: MILK,
    borderTopRightRadius: hp('2%'),
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    height: hp('8%'),
    width: wp('90%'),
    borderWidth: 0.5,
    borderColor: PRIMARY_DARK_GREY,
  },
  badgeContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  badge: {
    backgroundColor: MILK,
    margin: hp('1%'),
  },
  badgeText: {
    color: DARK_GRAY,
    fontSize: 15,
    textAlign: 'center',
  },
  prettyBlueLine: {
    flex: 0.05,
    borderLeftColor: PRIMARY_BLUE,
    borderLeftWidth: 3,
    borderTopLeftRadius: hp('0.5%'),
    borderBottomLeftRadius: hp('10%'),
    height: '100%',
  },
  textContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
});

export function GallerySelectorComponent({
  headline,
  subHeadline,
  localButtonSizes,
  showBadge,
  showActivityIndicator,
  notificationNumber,
}: {
  headline: string;
  subHeadline: string;
  showBadge: boolean;
  notificationNumber: number;
  showActivityIndicator: boolean;
  localButtonSizes: {
    small: number;
    medium: number;
    large: number;
  };
}) {
  return (
    <TouchableOpacity style={SSGallerySelectorComponent.componentContainer}>
      <View style={SSGallerySelectorComponent.badgeContainer}>
        {showActivityIndicator ? (
          <ActivityIndicator size="small" color={PRIMARY_DARK_GREY} />
        ) : (
          <Badge
            visible={showBadge}
            size={localButtonSizes.medium}
            style={SSGallerySelectorComponent.badge}
            // eslint-disable-next-line react/no-children-prop
            children={
              (
                <Text style={SSGallerySelectorComponent.badgeText}>
                  {notificationNumber}
                </Text>
              ) as any
            }
          />
        )}
      </View>
      <View style={SSGallerySelectorComponent.prettyBlueLine} />
      <View style={SSGallerySelectorComponent.textContainer}>
        <TextElement
          style={[globalTextStyles.titleText, {color: PRIMARY_DARK_GREY}]}>
          {headline}
        </TextElement>
        <TextElement
          style={[
            globalTextStyles.italicTitleText,
            {color: PRIMARY_DARK_GREY},
          ]}>
          {subHeadline}
        </TextElement>
      </View>
    </TouchableOpacity>
  );
}
