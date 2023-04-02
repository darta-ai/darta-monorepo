import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GlobalText} from '../../GlobalElements';
import {globalTextStyles} from '../../styles';
import {GallerySelectorComponent} from './GallerySelectorComponent';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// people need to download the app and they're just dropped on the screen with the art ratings
// it's very simple - gets right to the point

export function UserScreenSelector({
  headline,
  localButtonSizes,
}: {
  headline: string;
  localButtonSizes: any;
}) {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        alignSelf: 'center',
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
        <GallerySelectorComponent
          headline={'d a r t a'}
          subHeadline={'daily work for your tastes'}
          showBadge={true}
          notificationNumber={20}
          localButtonSizes={localButtonSizes}
        />
        <GallerySelectorComponent
          headline={'a r t i s t s'}
          subHeadline={'new work from your favorite artists'}
          showBadge={true}
          notificationNumber={15}
          localButtonSizes={localButtonSizes}
        />
        <GallerySelectorComponent
          headline={'g a l l e r i e s'}
          subHeadline={'new shows from your favorite galleries'}
          showBadge={false}
          localButtonSizes={localButtonSizes}
        />
        <GallerySelectorComponent
          headline={'c u r a t e d'}
          subHeadline={'new shows from curators and galleries'}
          showBadge={false}
          localButtonSizes={localButtonSizes}
        />
      </View>
    </View>
  );
}
