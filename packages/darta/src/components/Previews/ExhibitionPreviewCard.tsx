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
import { ExhibitionPreview, Images } from '@darta-types';
import * as Colors from '@darta-styles';
import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import { ExhibitionCarousel } from '../../components/Exhibitions/ExhibitionCarousel';
import { Button } from 'react-native-paper';
import * as SVGs from '../../assets/SVGs';
// import { NadaLogo } from '../../assets/SVGs';

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
    height: 580,
    gap: 16,
  },
  topInformationContainer: {
    width: '100%',
    gap: 2,
  },
  headlineContainer: {   
    width: '100%',
    // height: 28,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  exhibitionTitle: {
    width: '85%',
  },
  notificationContainer: {
    width: '15%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imagePreviewContainer: {
    height: 280,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableContainer: {
    width: '100%',
    textAlign: 'left',
    gap: 2,
    marginTop: 8,
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
  artistText: {
    fontFamily:"DMSans_700Bold",  
    marginTop: 4, 
    color: Colors.PRIMARY_950, 
    fontSize: 18
  }, 
  datesText: {
    marginBottom: 8, 
    color: Colors.PRIMARY_600, 
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

// headline big text: artist name
// headline small text: exhibition titles 

// if a group show, then exhibitionTitle
// if a solo show, then artist name

const ExhibitionPreviewCard = ({
    exhibitionPreview,
    onPressExhibition,
    onPressGallery,
    userViewed,
}: {
    exhibitionPreview: ExhibitionPreview
    onPressExhibition: ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => void,
    onPressGallery: ({galleryId} : {galleryId: string}) => void,
    userViewed: boolean
}) => {

  const [images, setImages] = React.useState<{imageData: Images}[]>([])

  React.useEffect(() => {
    if (exhibitionPreview?.artworkPreviews){
      const images = Object.values(exhibitionPreview.artworkPreviews).map((image) => {
        return {imageData: image.artworkImage}
      })
      const primaryImage = {imageData: exhibitionPreview.exhibitionPrimaryImage}
      setImages([primaryImage, ...images])
    } 
  }, [exhibitionPreview])
  
  const primaryText = exhibitionPreview?.exhibitionArtist?.value ? exhibitionPreview.exhibitionArtist.value : exhibitionPreview?.exhibitionTitle.value
  const secondaryText = exhibitionPreview?.exhibitionArtist?.value ? exhibitionPreview.exhibitionTitle.value : "Group Show"

  return (
    <>
      <View
        style={exhibitionPreviewStyle.container}>
          <View style={exhibitionPreviewStyle.topInformationContainer} >
            <Pressable style={exhibitionPreviewStyle.headlineContainer} onPress={() => onPressExhibition({exhibitionId: exhibitionPreview?.exhibitionId, galleryId: exhibitionPreview?.galleryId}) }>
              <View style={exhibitionPreviewStyle.exhibitionTitle}>
              <TextElement
                style={ exhibitionPreviewStyle.headerText}>
                {primaryText?.trim()}
              </TextElement>
              </View>
              <View style={exhibitionPreviewStyle.notificationContainer}>
                {!userViewed && <SVGs.NewBellComponent />}
              </View>
            </Pressable>
            <TextElement style={exhibitionPreviewStyle.artistText}>
              {secondaryText?.trim()}
            </TextElement>
          </View>
          <View style={exhibitionPreviewStyle.imagePreviewContainer}>
            <ExhibitionCarousel images={images} />
          </View>
            <View style={exhibitionPreviewStyle.touchableContainer}>
            {exhibitionPreview?.closingDate?.value && exhibitionPreview?.openingDate?.value && 
                (
                  <TextElement
                    style={ exhibitionPreviewStyle.datesText }>
                    {exhibitionPreview.openingDate?.value ? customLocalDateStringStart({date: new Date(exhibitionPreview.openingDate?.value), isUpperCase: true}).trimStart() : "Opening unavailable"}
                    {" - "}
                    {exhibitionPreview.closingDate?.value ? customLocalDateStringEnd({date: new Date(exhibitionPreview.closingDate?.value), isUpperCase: true}) : "Closing unavailable"}
                  </TextElement>
                )}
              <Pressable onPress={() => onPressGallery({galleryId: exhibitionPreview.galleryId})}>
                  <TextElement style={exhibitionPreviewStyle.galleryText}>{exhibitionPreview?.galleryName?.value?.trim()}</TextElement>
                </Pressable>
                <View>
                  <TextElement
                    style={exhibitionPreviewStyle.addressText}>
                    {simplifyAddressMailing(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString?.value)}
                  </TextElement>
                  <TextElement
                    style={exhibitionPreviewStyle.addressText}>
                    {simplifyAddressCity(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString?.value)}
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
    prevProps.onPressGallery === nextProps.onPressGallery &&
    prevProps.userViewed === nextProps.userViewed
  );
});

