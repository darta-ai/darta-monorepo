import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, SafeAreaView, View, StatusBar} from 'react-native';
import {Divider} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {getImages, imagePrefetch} from '../../functions/galleryFunctions';
import {DataT} from '../../types';
import {GlobalText} from '../GlobalElements/index';
import {globalTextStyles} from '../styles';
import {GalleryPreview} from './GalleryComponents';
import {
  GalleryRootStackParamList,
  GalleryNavigatorEnum,
} from './galleryRoutes.d';
import {ETypes, StoreContext} from './galleryStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function UserHome() {
  return <View>Hey</View>;
}

export default UserHome;
