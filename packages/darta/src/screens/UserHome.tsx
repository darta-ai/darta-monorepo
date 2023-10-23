import React, {useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import * as Colors from '@darta-styles';
import {getButtonSizes} from '../utils/functions';
import {GalleriesFollowing} from '../components/Gallery/GalleriesFollowing';
import {UserPersonalWorkSelector} from '../components/User/UserPersonalWorkSelector';
import {UserProfile} from '../components/User/UserProfile';

const HEADER_MAX_HEIGHT = hp('20%');
const HEADER_MIN_HEIGHT = hp('10%');
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export const userHomeStyles = StyleSheet.create({
  userHomeContainer: {
    backgroundColor: Colors.PRIMARY_100,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
    paddingTop: hp('3%'),
  },
  header: {
    backgroundColor: Colors.PRIMARY_100,
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: wp('5%'),
  },
});

const exploreData = {
  '0': {
    name: 'Liliane Tomasko',
    details: 'los angeles based artist',
    id: '506b34324466170002001bef',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/dYP6Mb47wE9tutjWMK4xgA/larger.jpg',
    type: 'artist',
  },
  '1': {
    name: 'All Street',
    details: 'LES gallery',
    id: '5a74ae26c9dc246d3cec9b16',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/8_wVaGb1c3Il5x_cpbzZRw/larger.jpg',
    type: 'gallery',
    logo: 'https://images.squarespace-cdn.com/content/v1/62337b61c3a3126b7627f968/b811248e-cf21-4c2c-a1e8-80252fc99a6a/favicon.ico?format=100w',
  },
  '2': {
    name: 'Deathly Still',
    details: 'curated works by amy curation',
    id: '60b26fc611c5550012ddfec9',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/V3-CQH0rCzu-K_BY1RDUyw/larger.jpg',
    type: 'curator',
    logo: 'https://s3.amazonaws.com/files.collageplatform.com.prod/image_cache/favicon/application/599f12405a4091c6048b4568/17a4320352e109937d45258c89ac8a91.png',
  },
  '3': {
    name: 'Simon Ko',
    details: 'new york based artist',
    id: '60b8ed5ce542ef000f5f55e8',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/LL1Rsz2uFtNduINKDxeEMA/larger.jpg',
    type: 'artist',
  },
};

export function UserHome({navigation}: {navigation: any}) {
  const localButtonSizes = getButtonSizes(hp('100%'));
  const scrollY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    scrollY.addListener(() => {})
  },[])

  const headerHeightInterpolate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageWidthInterpolate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [hp('17.5%'), hp('5%')],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
      listener: ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = nativeEvent.contentOffset.y;
        scrollY.setValue(offsetY);
      },
    },
  );
  return (
    <View style={userHomeStyles.userHomeContainer}>
      <Animated.View
        style={[userHomeStyles.header, {height: headerHeightInterpolate}]}>
        <UserProfile
          navigation={navigation}
          imageWidthInterpolate={imageWidthInterpolate}
          localButtonSizes={localButtonSizes}
        />
      </Animated.View>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{height: hp('60%'), marginTop: hp('5%')}}>
        <View> 
            <View>
              <UserPersonalWorkSelector
                navigation={navigation}
                headline="| y o u"
                localButtonSizes={localButtonSizes}
              />
            </View>
            <View>
              <GalleriesFollowing
                headline="| f o l l o w i n g"
                navigation={navigation}
              />
            </View>
        </View>
      </ScrollView>
    </View>
  );
}
