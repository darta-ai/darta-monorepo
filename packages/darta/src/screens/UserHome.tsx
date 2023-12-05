import React, {useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import * as Colors from '@darta-styles';
import {GalleriesFollowing} from '../components/Gallery/GalleriesFollowing';
import {UserSpecificComponent} from '../components/User/UserSpecificComponent';
import {UserProfile} from '../components/User/UserProfile';
import { ETypes, StoreContext } from '../state/Store';
import { listGalleryRelationshipsAPI, listUserArtworkAPI } from '../utils/apiCalls';
import { GalleryPreview, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { TextElement } from '../components/Elements/TextElement';
import { globalTextStyles } from '../styles/styles';
import { DartaIconButtonWithText } from '../components/Darta/DartaIconButtonWithText';
import * as SVGs from '../assets/SVGs';


const HEADER_MAX_WIDTH = 100;
const HEADER_MIN_WIDTH = wp('15%');
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const HEADER_SCROLL_WIDTH_DISTANCE = HEADER_MAX_WIDTH - HEADER_MIN_WIDTH;

export const userHomeStyles = StyleSheet.create({
  userHomeContainer: {
    backgroundColor: Colors.PRIMARY_50,
    flex: 1,
    minHeight: '100%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
    padding: 24, 
    gap: 60
  },
  galleryContactButtonsContainer: {
    width: wp('100%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 16,
  },
  marginBottom24: {
    marginBottom: 24
  }
});


export function UserHome({navigation}: {navigation: any}) {
  const {dispatch} = React.useContext(StoreContext);
  const scrollY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    scrollY.addListener(() => {})
  },[])

  const imageWidthInterpolate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_WIDTH_DISTANCE],
    // outputRange: [hp('17.5%'), hp('5%')],
    outputRange: [HEADER_MAX_WIDTH, HEADER_MIN_WIDTH],
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
        }, 100)  }, []);

    
  const sendToInstagram = () => {
    Linking.canOpenURL('instagram://app').then((supported) => {
    if (supported) {
        Linking.openURL(`instagram://user?username=darta.art`);
    } else {
        Linking.openURL(`https://www.instagram.com/darta.art/`);
    }
  });
  }

  const sendEmail = () => {
    const url = `mailto:collaborate@darta.art`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle URL: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const visitWebsite = () => {

    const url = `https://www.darta.art`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle URL: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };  
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />} onScroll={handleScroll} scrollEventThrottle={16} >
      <View style={userHomeStyles.userHomeContainer}>
        <View>
          <UserProfile
            navigation={navigation}
            imageWidthInterpolate={imageWidthInterpolate}
            imageHeightInterpolate={imageWidthInterpolate}
          />
        </View>
          <View> 
            <View style={userHomeStyles.marginBottom24}>
              <TextElement style={globalTextStyles.sectionHeaderTitle}>You</TextElement>
            </View>
            <View>
              <UserSpecificComponent
              navigation={navigation}
              />
            </View>
          </View>
          <View>
            <View style={userHomeStyles.marginBottom24}>
              <TextElement style={globalTextStyles.sectionHeaderTitle}>Following</TextElement>
            </View>
              <View>
                <GalleriesFollowing
                  navigation={navigation}
                />
              </View>
          </View>
          <View>
            <View style={userHomeStyles.marginBottom24}>
              <TextElement style={globalTextStyles.sectionHeaderTitle}>Contact Us</TextElement>
            </View>
              <View style={userHomeStyles.galleryContactButtonsContainer}>
                <DartaIconButtonWithText 
                text={"collaborate@darta.art"}
                iconComponent={SVGs.EmailIcon}
                onPress={() => sendEmail()}
                />
                <DartaIconButtonWithText 
                text={"darta.art"}
                iconComponent={SVGs.WebIcon}
                onPress={() => visitWebsite()}
                />
                <DartaIconButtonWithText 
                text={"@darta.art"}
                iconComponent={SVGs.InstagramIcon}
                onPress={() => sendToInstagram()}
                />
              </View>
          </View>
      </View>
    </ScrollView>
  );
}
