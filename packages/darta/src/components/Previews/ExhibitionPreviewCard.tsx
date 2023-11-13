/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import { ExhibitionPreview } from '@darta-types';
import * as Colors from '@darta-styles';
import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddress, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import { GalleryIcon } from '../Elements/_index';
import { ExhibitionCarousel } from '../../components/Exhibitions/ExhibitionCarousel';
import { Button } from 'react-native-paper';

const exhibitionPreviewStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    padding: 24,
    alignSelf : 'center',
    // height: 'hp('70%')',
    width: wp('100%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.PRIMARY_400,
    backgroundColor: Colors.PRIMARY_50,
  },
  galleryIconContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',           
    height: "auto",
    width: '100%'
  },
  imagePreviewContainer: {
    width: '100%',
    height: hp("40%"),
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableContainer: {
    width: '100%',
    margin: 16,
    textAlign: 'left',
  },
  textContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',

    alignContent: 'flex-start',
  },
  infoButtonContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',           
    height: "100%",
    width: '10%',
  },
  heroImageContainer: {
    height: '70%',
    marginTop: 10,
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('1%'),
  },
  heroImage: {

    height: '100%',
    resizeMode: 'contain',
  },
  seeMoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',           
    height: "5%",

    backgroundColor: Colors.PRIMARY_950,
  },
  buttonStyles: {
    width: wp('90%'),
    backgroundColor: Colors.PRIMARY_950,
    alignSelf: "center",
  },
  buttonContentStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: wp('90%'),
    padding: 0, // Or any other desired padding
  },
  buttonTextColor: {
    color: Colors.PRIMARY_50,
    fontFamily: "DMSans_700Bold",
  }
})

const ExhibitionPreviewCard = ({
    exhibitionPreview,
    onPressExhibition,
    onPressGallery,
}: {
    exhibitionPreview: ExhibitionPreview
    onPressExhibition: ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => void,
    onPressGallery: ({galleryId} : {galleryId: string}) => void,
}) => {

  const [images, setImages] = React.useState<{imageUrl: string, title?: string}[]>([])

  React.useEffect(() => {
    if (exhibitionPreview?.artworkPreviews){
      const images = Object.values(exhibitionPreview.artworkPreviews).map((image) => {
        return {imageUrl: image.artworkImage?.value, title: image.artworkTitle?.value}
      })
      const primaryImage = {imageUrl: exhibitionPreview.exhibitionPrimaryImage?.value}
      setImages([primaryImage, ...images])
    } 
  }, [exhibitionPreview])

  return (
    <>
      <View
        style={exhibitionPreviewStyle.container}>
          <TouchableOpacity style={exhibitionPreviewStyle.galleryIconContainer} onPress={() => onPressExhibition({exhibitionId: exhibitionPreview?.exhibitionId, galleryId: exhibitionPreview?.galleryId}) }>
            <TextElement
              style={{fontFamily:"DMSans_700Bold", color: Colors.PRIMARY_950, fontSize: 22, width: '100%'}}>
              {' '}
              {exhibitionPreview.exhibitionTitle.value} 
            </TextElement>
            {exhibitionPreview?.closingDate?.value &&  
              exhibitionPreview?.openingDate?.value && 
              (
                <TextElement
                  style={{fontFamily:"DMSans_700Bold",  marginTop: 2, color: Colors.PRIMARY_950, fontSize: 15}}>
                  {' '}
                  {exhibitionPreview.openingDate?.value ? customLocalDateStringStart({date: new Date(exhibitionPreview.openingDate?.value), isUpperCase: true}) : "Opening unavailable"}
                  {" - "}
                  {exhibitionPreview.closingDate?.value ? customLocalDateStringEnd({date: new Date(exhibitionPreview.closingDate?.value), isUpperCase: true}) : "Closing unavailable"}
                </TextElement>
              )}
              <TextElement
                style={{marginTop: 8, color: Colors.PRIMARY_900, fontSize: 15, fontFamily: "DMSans_400Regular"}}>
                  {' '}
                  {exhibitionPreview?.exhibitionArtist?.value ? exhibitionPreview?.exhibitionArtist?.value : "Group Show"}
                </TextElement>
             
          </TouchableOpacity>
          <View style={exhibitionPreviewStyle.imagePreviewContainer}>
            <ExhibitionCarousel images={images} />
          </View>
            <TouchableOpacity style={exhibitionPreviewStyle.touchableContainer} onPress={() => onPressGallery({galleryId: exhibitionPreview.galleryId})}>
              <View>
                  <TextElement style={{fontFamily: "DMSans_400Regular", color: Colors.PRIMARY_950, fontSize: 15}}>{exhibitionPreview?.galleryName.value?.trim()}</TextElement>
                </View>
                <View>
                  <TextElement
                    style={{ fontFamily: "DMSans_400Regular", color: Colors.PRIMARY_400, fontSize: 14}}>
                    {' '}
                    {simplifyAddressMailing(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString.value)}
                  </TextElement>
                  <TextElement
                    style={{fontFamily: "DMSans_400Regular" ,color: Colors.PRIMARY_400, fontSize: 14}}>
                    {' '}
                    {simplifyAddressCity(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString.value)}
                  </TextElement>
                </View>
            </TouchableOpacity>
            <Button 
             onPress={() => onPressExhibition({exhibitionId: exhibitionPreview?.exhibitionId, galleryId: exhibitionPreview?.galleryId})}
             style={exhibitionPreviewStyle.buttonStyles}
             contentStyle={exhibitionPreviewStyle.buttonContentStyle}
             >
              <TextElement style={exhibitionPreviewStyle.buttonTextColor}>View Details</TextElement>
            </Button>
      </View>
    </>
  );
}

export default React.memo(ExhibitionPreviewCard, (prevProps, nextProps) => {
  /*
    This is an optional comparison function that you can provide to React.memo for custom comparison logic.
    If you omit this function, it will do a shallow comparison of props by default.
    If you need to compare deeply nested properties, you can do so here.
  */
  return (
    prevProps.exhibitionPreview === nextProps.exhibitionPreview &&
    prevProps.onPressExhibition === nextProps.onPressExhibition &&
    prevProps.onPressGallery === nextProps.onPressGallery 
  );
});

