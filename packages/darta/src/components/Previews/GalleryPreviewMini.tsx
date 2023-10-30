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
import { ETypes, StoreContext } from '../../state/Store';
import { UserRoutesEnum } from '../../typing/routes';



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

  const {dispatch} = React.useContext(StoreContext)

  const showGallery = () => {
    dispatch({
      type: ETypes.setGalleryHeader,
      galleryHeader: galleryName?.value ?? ""
    })
    navigation.navigate(UserRoutesEnum.UserGallery, {galleryId: galleryId})
  }

  const galleryPreviewMiniStyles = StyleSheet.create({
    container: {
      height: hp('10%'),
      width: wp('90%'),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.PRIMARY_50,
      borderColor: Colors.PRIMARY_800,
      borderWidth: 0.5,
      borderTopLeftRadius: hp('1%'),
      borderBottomLeftRadius: hp('2%'),
      borderTopRightRadius: hp('2%'),
      borderBottomRightRadius: 5,
      marginTop: 1, 
    },
    imageContainer: {
      borderTopLeftRadius: hp('1%'),
      borderBottomLeftRadius: hp('2%'),
      width: wp('30%'),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',    
      flex: 0.5,
    },
    image: {
      resizeMode: 'contain',
      height: '100%',
      width:  wp('20%'),
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
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingLeft: wp('2%'),
      width: wp('60%'),
    }
  }) 
  
  return (
    <TouchableOpacity
    onPress={() => showGallery()}
    >
      <View style={galleryPreviewMiniStyles.container}>
        <View style={galleryPreviewMiniStyles.imageContainer}> 
          <Image
            source={{uri: galleryLogo?.value ?? ""}}
            style={galleryPreviewMiniStyles.image}
          />
        </View>
        <View style={galleryPreviewMiniStyles.prettyBlueLine}></View>
        <View style={galleryPreviewMiniStyles.textContainer}>
          <TextElement style={[globalTextStyles.titleText, {color: Colors.PRIMARY_DARK_GREY}]}>{galleryName.value}</TextElement>
        </View>
      </View>
    </TouchableOpacity>
  );
}
