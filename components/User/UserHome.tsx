import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, View, ScrollView, Image} from 'react-native';
import {UserScreenSelector} from './UserComponents/UserScreenSelector';
import {UserProfile} from './UserComponents/UserProfile';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getButtonSizes} from '../../functions/galleryFunctions';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

function UserHome() {
  const insets = useSafeAreaInsets();
  const localButtonSizes = getButtonSizes(hp('100%'));
  return (
    <View
      style={{
        backgroundColor: '#EEEEEE',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
      }}>
      <SafeAreaView style={{flexDirection: 'column'}}>
        <View>
          <View>
            <UserProfile localButtonSizes={localButtonSizes} />
          </View>
          <View>
            <UserScreenSelector
              headline={'| a r o u n d'}
              localButtonSizes={localButtonSizes}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default UserHome;
