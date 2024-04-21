import React from 'react';
import {StyleSheet, View} from 'react-native';

import { GalleryPreview } from '@darta-types';
import { GalleryPreviewMini } from '../Previews/GalleryPreviewMini';
import { UserStoreContext } from '../../state/UserStore';
import { GalleryStoreContext } from '../../state';
import { TextElement } from '../Elements/TextElement';
import * as SVGs from '../../assets/SVGs';
import { dartaLogo } from '../User/UserInquiredArtwork';

export function GalleriesFollowing({
  navigation,
}: {
  navigation: any;
}) {
  const {userState} = React.useContext(UserStoreContext);
  const {galleryState} = React.useContext(GalleryStoreContext);

  const GalleriesFollowingStyles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignContent: 'center',
      alignSelf: 'center',
      gap: 12,
    }
  })

  const [galleriesFollowing, setGalleriesFollowing] = React.useState<GalleryPreview[]>([] as any);

  React.useEffect(() => {
    if (userState.userGalleryFollowed && galleryState.galleryPreviews) {
      const {userGalleryFollowed } = userState;
      const {galleryPreviews} = galleryState;
      const result: GalleryPreview[] = [];

      for (const key in userGalleryFollowed) {
        if (userGalleryFollowed[key] === true && galleryPreviews[key]) {
          result.push(galleryPreviews[key]);
        } else if (userGalleryFollowed[key] === true && !galleryPreviews[key]){
          
        }
      }
      result.sort((a, b) => {
        if (!a.galleryName.value || !b.galleryName.value) return 0;
        if (a.galleryName.value < b.galleryName.value) return -1;
        if (a.galleryName.value > b.galleryName.value) return 1;
        return 0
      });
      setGalleriesFollowing(result)
    }
  },[userState.userGalleryFollowed, galleryState.galleryPreviews])

  return (
    <View
      style={GalleriesFollowingStyles.container}>
      {galleriesFollowing.length > 0 && galleriesFollowing.map((galleryPreview: GalleryPreview) => 
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
        {galleriesFollowing.length === 0 && (
          <View>
              <View style={{flexDirection: 'row'}}>
                  <TextElement style={dartaLogo.text}>Follow a gallery by pressing </TextElement>
                  <SVGs.HeartFillSmall />
                  <TextElement style={dartaLogo.text}> on a gallery's page</TextElement>
              </View>
          </View>
        )}
      </View>
  );
}
