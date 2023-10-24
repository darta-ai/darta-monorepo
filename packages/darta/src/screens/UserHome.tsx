import React, {useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
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
import { ETypes, StoreContext } from '../state/Store';
import { listGalleryRelationshipsAPI, listUserArtworkAPI } from '../utils/apiCalls';
import { GalleryPreview, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';

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


export function UserHome({navigation}: {navigation: any}) {
  const {dispatch} = React.useContext(StoreContext);
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

  const [refreshing, setRefreshing] = React.useState(false);


  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const [galleryFollows, savedArtwork, inquiredArtwork] = await Promise.all([
        listGalleryRelationshipsAPI(),
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 100 }),
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 100 }),
      ])

      const processArtworkData = (data: any, dispatchType: ETypes) => {
        if (data && Object.values(data).length > 0) {
          let artworkIds: { [key: string]: boolean } = {};
          artworkIds = Object.values(data).reduce((acc: any, el: any) => ({ ...acc, [el?._id]: true }), {}) as { [key: string]: boolean };
          dispatch({
            type: dispatchType,
            artworkIds
          });
        }
        return data;
      };

      processArtworkData(savedArtwork, ETypes.setUserSavedArtworkMulti);
      processArtworkData(inquiredArtwork, ETypes.setUserInquiredArtworkMulti);

      if (galleryFollows?.length) {
        const galleryPreviews: {[key: string] : GalleryPreview} = galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: el }), {})
        dispatch({
          type: ETypes.setGalleryPreviewMulti,
          galleryPreviews
        });
        dispatch({
          type: ETypes.setUserFollowGalleriesMulti,
          galleryFollowIds: galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: true }), {})
        });
      }
      } catch {
        setRefreshing(false);
    }
        setTimeout(() => {
            setRefreshing(false);
        }, 500)  }, []);
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
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />} onScroll={handleScroll} scrollEventThrottle={16} style={{height: hp('60%'), marginTop: hp('5%')}}>
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
