/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import { Images, PublicFields } from '@darta-types';
import * as Colors from '@darta-styles'
import { globalTextStyles } from '../../styles/styles';
import { UserRoutesEnum } from '../../typing/routes';
// import FastImage from 'react-native-fast-image';
import { ExhibitionStoreContext, UIStoreContext, UiETypes } from '../../state';
import { DartaImageComponent } from '../Images/DartaImageComponent';
import * as SVGs from '../../assets/SVGs';
import { Image } from 'expo-image';




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
      padding: 18,
      borderRadius: 19,
      gap: 19
    },
    infoContainer: {
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    badgeContainer: {
      width: '10%',
      height: 72,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
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
      marginLeft: 18,
    }
  }) 
  
  return (
    <TouchableOpacity
    onPress={() => showGallery()}
    >
      <View style={galleryPreviewMiniStyles.container}>
        <View style={galleryPreviewMiniStyles.infoContainer}>
          <View style={galleryPreviewMiniStyles.imageContainer}> 
            <Image
              source={galleryLogo.smallImage?.value ?? galleryLogo?.value ?? ""}
              style={galleryPreviewMiniStyles.image}
              contentFit={"contain"}
              priority={"normal"}
            />
          </View>
          <View style={galleryPreviewMiniStyles.textContainer}>
            <TextElement style={globalTextStyles.boldTitleText}>{galleryName.value}</TextElement>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
