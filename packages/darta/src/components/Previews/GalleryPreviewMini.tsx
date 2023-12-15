/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import { Images, PublicFields } from '@darta-types';
import * as Colors from '@darta-styles'
import { globalTextStyles } from '../../styles/styles';
import { UserRoutesEnum } from '../../typing/routes';
import FastImage from 'react-native-fast-image';
import { UIStoreContext, UiETypes } from '../../state';




export function GalleryPreviewMini({
  galleryId,
  galleryName,
  galleryLogo,
  navigation,
}: {
  galleryId: string;
  galleryName: PublicFields;
  galleryLogo: Images;
  navigation: any
}) {

  const {uiDispatch} = React.useContext(UIStoreContext);


  const showGallery = () => {
    uiDispatch({
      type: UiETypes.setGalleryHeader,
      galleryHeader: galleryName?.value ?? ""
    })
    navigation.navigate(UserRoutesEnum.UserGallery, {galleryId: galleryId})
  }

  const galleryPreviewMiniStyles = StyleSheet.create({
    container: {
      height: 72,
      width: 345,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: "#B0B0B019",
      padding: 12,
      borderRadius: 19,
      gap: 19
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',    
      height: 72, 
      width: 72, 
      borderRadius: 50,
    },
    image: {
      resizeMode: 'contain',
      height: '100%',
      width: '100%'
    },
    prettyBlueLine: {
      flex: 0.05,
      borderLeftColor: Colors.PRIMARY_600,
      borderLeftWidth: 3,
      borderTopLeftRadius: hp('0.5%'),
      borderBottomLeftRadius: hp('10%'),
      height: '100%',
    },
    textContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    }
  }) 
  
  return (
    <TouchableOpacity
    onPress={() => showGallery()}
    >
      <View style={galleryPreviewMiniStyles.container}>
        <View style={galleryPreviewMiniStyles.imageContainer}> 
          <FastImage
            source={{uri: galleryLogo?.value ?? ""}}
            style={galleryPreviewMiniStyles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={galleryPreviewMiniStyles.textContainer}>
          <TextElement style={globalTextStyles.boldTitleText}>{galleryName.value}</TextElement>
        </View>
      </View>
    </TouchableOpacity>
  );
}
