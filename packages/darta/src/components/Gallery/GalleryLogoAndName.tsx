import React from 'react';
import {StyleSheet, View} from 'react-native';

import { StoreContext } from '../../state/Store';
import { GalleryPreview } from '@darta-types';
import { GalleryPreviewMini } from '../Previews/GalleryPreviewMini';
import { UserStoreContext } from '../../state/UserStore';
import { GalleryStoreContext } from '../../state';
import FastImage from 'react-native-fast-image';
import { TextElement } from '../Elements/TextElement';
import { globalTextStyles } from '../../styles/styles';
import * as Colors from '@darta-styles';

const GalleriesFollowingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: Colors.PRIMARY_900,
    backgroundColor: "white",
  }
})

export function GalleryLogoAndName({
  galleryName,
  galleryLogo,
  galleryId,
  navigation,
}: {
  galleryName: string | null;
  galleryLogo: string | null;
  galleryId: string | null;
  navigation: any;
}) {

  return (
    <View
      style={GalleriesFollowingStyles.container}>
        <View>
          <FastImage
            style={GalleriesFollowingStyles.imageContainer}
            source={{
              uri: galleryLogo ?? undefined,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          </View>
          <View>
            <TextElement style={{...globalTextStyles.sectionHeaderTitle, fontSize: 22}}>{galleryName}</TextElement>
        </View>
     
      </View>
  );
}
