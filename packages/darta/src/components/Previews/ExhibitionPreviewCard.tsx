/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import { ExhibitionPreview } from '@darta-types';
import * as Colors from '@darta-styles';
import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import { ExhibitionCarousel } from '../../components/Exhibitions/ExhibitionCarousel';
import { Button } from 'react-native-paper';

const exhibitionPreviewStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf : 'center',
    width: wp('100%'),
    alignItems: 'center',
    borderColor: Colors.PRIMARY_400,
    backgroundColor: Colors.PRIMARY_50,
    padding: 24,
    height: 590,
    gap: 16,
  },
  galleryIconContainer: {   
    width: '100%',
  },
  imagePreviewContainer: {
    height: "55%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableContainer: {
    width: '100%',
    textAlign: 'left',
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
  }, 
  headerText: {
    fontFamily:"DMSans_700Bold", 
    color: Colors.PRIMARY_950, 
    fontSize: 24
  },
  datesText: {
    fontFamily:"DMSans_700Bold",  
    marginTop: 2, 
    color: Colors.PRIMARY_950, 
    fontSize: 16
  }, 
  artistText: {
    marginTop: 8, 
    color: Colors.PRIMARY_900, 
    fontSize: 16, 
    fontFamily: "DMSans_400Regular"
  },
  galleryText: {
    fontFamily: "DMSans_400Regular", 
    color: Colors.PRIMARY_950,
    fontSize: 16
  }, 
  addressText: {
    fontFamily: "DMSans_400Regular", 
    color: Colors.PRIMARY_400, 
    fontSize: 16
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
          <View style={exhibitionPreviewStyle.galleryIconContainer} >
            <Pressable style={exhibitionPreviewStyle.galleryIconContainer} onPress={() => onPressExhibition({exhibitionId: exhibitionPreview?.exhibitionId, galleryId: exhibitionPreview?.galleryId}) }>
              <TextElement
                style={ exhibitionPreviewStyle.headerText}>
                {exhibitionPreview?.exhibitionTitle?.value ? exhibitionPreview.exhibitionTitle.value.trim() : exhibitionPreview?.galleryName}
              </TextElement>
            </Pressable>
            {exhibitionPreview?.closingDate?.value &&  
              exhibitionPreview?.openingDate?.value && 
              (
                <TextElement
                  style={ exhibitionPreviewStyle.datesText }>
                  {exhibitionPreview.openingDate?.value ? customLocalDateStringStart({date: new Date(exhibitionPreview.openingDate?.value), isUpperCase: true}).trimStart() : "Opening unavailable"}
                  {" - "}
                  {exhibitionPreview.closingDate?.value ? customLocalDateStringEnd({date: new Date(exhibitionPreview.closingDate?.value), isUpperCase: true}) : "Closing unavailable"}
                </TextElement>
              )}
              <TextElement
                style={exhibitionPreviewStyle.artistText}>
                  {exhibitionPreview?.exhibitionArtist?.value ? exhibitionPreview.exhibitionArtist.value?.trim() : "Group Show"}
                </TextElement>
          
          </View>
          <View style={exhibitionPreviewStyle.imagePreviewContainer}>
            <ExhibitionCarousel images={images} />
          </View>
            <View style={exhibitionPreviewStyle.touchableContainer}>
              <Pressable onPress={() => onPressGallery({galleryId: exhibitionPreview.galleryId})}>
                  <TextElement style={exhibitionPreviewStyle.galleryText}>{exhibitionPreview?.galleryName.value?.trim()}</TextElement>
                </Pressable>
                <View>
                  <TextElement
                    style={exhibitionPreviewStyle.addressText}>
                    {simplifyAddressMailing(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString.value)}
                  </TextElement>
                  <TextElement
                    style={exhibitionPreviewStyle.addressText}>
                    {simplifyAddressCity(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString.value)}
                  </TextElement>
                </View>
            </View>
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

