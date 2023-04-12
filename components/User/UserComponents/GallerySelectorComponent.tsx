import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GlobalText} from '../../GlobalElements';
import {
  DARK_GRAY,
  MILK,
  PRIMARY_BLUE,
  PRIMARY_DARK_GREY,
  PRIMARY_GREY,
  PRIMARY_LIGHTBLUE,
} from '../../../assets/styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Badge} from 'react-native-paper';
import {Text} from 'react-native-paper';
import {globalTextStyles} from '../../styles';

export function GallerySelectorComponent({
  headline,
  subHeadline,
  localButtonSizes,
  showBadge,
  notificationNumber,
}: {
  headline: string;
  subHeadline: string;
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
          height: hp('8%'),
          width: wp('90%'),
          borderWidth: 0.5,
          borderColor: PRIMARY_DARK_GREY,
        },
      ]}>
      <View style={{flex: 0.15, justifyContent: 'center', alignSelf: 'center'}}>
        <Badge
          visible={showBadge}
          size={localButtonSizes.medium}
          style={styles.badgeContainer}
          children={
            (<Text style={styles.badgeText}>{notificationNumber}</Text>) as any
          }
        />
      </View>
      <View
        style={{
          flex: 0.05,
          borderLeftColor: PRIMARY_BLUE,
          borderLeftWidth: 3,
          borderTopLeftRadius: hp('0.5%'),
          borderBottomLeftRadius: hp('10%'),
          height: '100%',
        }}
      />
      <View style={{flex: 0.8, justifyContent: 'center'}}>
        <GlobalText
          style={[globalTextStyles.titleText, {color: PRIMARY_DARK_GREY}]}>
          {headline}
        </GlobalText>
        <GlobalText
          style={[
            globalTextStyles.italicTitleText,
            {color: PRIMARY_DARK_GREY},
          ]}>
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
    backgroundColor: MILK,
    borderTopRightRadius: hp('2%'),
    borderBottomRightRadius: 5,
    justifyContent: 'center',
  },
  badgeContainer: {
    backgroundColor: MILK,
    margin: hp('1%'),
  },
  badgeText: {
    color: DARK_GRAY,
    fontSize: 15,
    textAlign: 'center',
  },
});
