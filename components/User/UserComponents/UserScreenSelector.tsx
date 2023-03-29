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
import {GallerySelectorComponent} from './GallerySelectorComponent';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
      <ScrollView>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <GallerySelectorComponent
            headline={'d a r t a'}
            subHeadline={'curated from your tastes'}
            image={'fake headline'}
            showBadge={true}
            notificationNumber={20}
            localButtonSizes={localButtonSizes}
          />
          <GallerySelectorComponent
            headline={'a r t i s t s'}
            subHeadline={'new work from your favorite artists'}
            image={'fake headline'}
            showBadge={true}
            notificationNumber={15}
            localButtonSizes={localButtonSizes}
          />
          <GallerySelectorComponent
            headline={'g a l l e r i e s'}
            subHeadline={'new shows from your favorite galleries'}
            image={'fake headline'}
            showBadge={false}
            localButtonSizes={localButtonSizes}
          />
          <GallerySelectorComponent
            headline={'c u r a t e d'}
            subHeadline={'new shows from your curators'}
            image={'fake headline'}
            showBadge={false}
            localButtonSizes={localButtonSizes}
          />
        </View>
      </ScrollView>
    </View>
  );
}
