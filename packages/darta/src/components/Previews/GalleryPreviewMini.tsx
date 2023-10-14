/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import { Images, PublicFields } from '@darta-types';

export function GalleryPreviewMini({
  galleryId,
  galleryName,
  galleryImage,
  showGallery,
}: {
  galleryId: string;
  galleryName: PublicFields;
  galleryImage: Images;
  showGallery: (galleryId: string) => void;
}) {
  
  return (
    <TouchableOpacity
    onPress={() => showGallery(galleryId)}
    style={{
    display: 'flex',
    flexDirection: 'row',
    height: hp('25%'),
    marginTop: hp('1%'),
    justifyContent: 'space-around',
    }}
    >
        <Image
        source={{uri: galleryImage?.value ?? ""}}
        style={{
            height: hp('10%'),
            width:  wp('10%'),
            position: 'relative'
        }}
        />
        <TextElement>{galleryName.value}</TextElement>
    </TouchableOpacity>
  );
}
