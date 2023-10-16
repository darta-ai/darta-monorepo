import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {globalTextStyles} from '../../styles/styles';
import {ExploreCarouselCards} from '../Explore/Carousel/ExploreCarouselCards';
import { StoreContext } from '../../state/Store';
import { GalleryPreview } from '@darta-types/dist';

export function GalleriesFollowing({
  headline,
}: {
  headline: string;
}) {
  const {state, dispatch} = React.useContext(StoreContext);

  const [galleriesFollowing, setGalleriesFollowing] = React.useState<{[key: string]: GalleryPreview}>([] as any);

  React.useEffect(() => {
    if (state.userGalleryFollowed && state.galleryPreviews) {
      const {userGalleryFollowed, galleryPreviews} = state;

    }
  },[])

  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        alignSelf: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
        width: wp('90%'),
      }}>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: hp('1%'),
        }}>
        <TextElement
          style={[globalTextStyles.boldTitleText, {marginBottom: hp('1%`')}]}>
          {headline}
        </TextElement>
      </View>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
      </View>
    </View>
  );
}
