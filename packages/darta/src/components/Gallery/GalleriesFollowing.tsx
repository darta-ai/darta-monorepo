import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {globalTextStyles} from '../../styles/styles';
import { StoreContext } from '../../state/Store';
import { GalleryPreview } from '@darta-types';
import { GalleryPreviewMini } from '../Previews/GalleryPreviewMini';

export function GalleriesFollowing({
  headline,
  navigation,
}: {
  headline: string;
  navigation: any;
}) {
  const {state} = React.useContext(StoreContext);

  const GalleriesFollowingStyles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignContent: 'center',
      alignSelf: 'center',
      marginTop: hp('2%'),
      marginBottom: hp('2%'),
      width: wp('90%'),
      gap: hp('2%'),
    }
  })

  const [galleriesFollowing, setGalleriesFollowing] = React.useState<GalleryPreview[]>([] as any);

  React.useEffect(() => {
    if (state.userGalleryFollowed && state.galleryPreviews) {
      const {userGalleryFollowed, galleryPreviews} = state;
      const result: GalleryPreview[] = [];

      for (const key in userGalleryFollowed) {
        if (userGalleryFollowed[key] === true && galleryPreviews[key]) {
          result.push(galleryPreviews[key]);
        }
      }
      result.sort((a, b) => {
        // Assuming galleryName is a string
        if (!a.galleryName.value || !b.galleryName.value) return 0;
        if (a.galleryName.value < b.galleryName.value) return -1;
        if (a.galleryName.value > b.galleryName.value) return 1;
        return 0
      });
      setGalleriesFollowing(result)
    }
  },[state.userGalleryFollowed,state.galleryPreviews])

  return (
    <View
      style={GalleriesFollowingStyles.container}>
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
      {galleriesFollowing.map((galleryPreview: GalleryPreview) => 
      <View
        key={galleryPreview._id}
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
          <View>
              <GalleryPreviewMini
              galleryId={galleryPreview._id}
              galleryName={galleryPreview.galleryName ?? {}}
              galleryLogo={galleryPreview.galleryLogo ?? {}}
              navigation={navigation}
              />
              </View>
            </View>
          )}
      </View>
  );
}
