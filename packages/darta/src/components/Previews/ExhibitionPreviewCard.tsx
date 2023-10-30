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
import {globalTextStyles} from '../../styles/styles';
import { ExhibitionPreview } from '@darta-types';
import { PRIMARY_700, PRIMARY_900, PRIMARY_100, PRIMARY_950, PRIMARY_50, PRIMARY_400 } from '@darta-styles';
import { customLocalDateString, simplifyAddress } from '../../utils/functions';
import { GalleryIcon } from '../Elements/_index';
import { Divider } from 'react-native-paper';
import { ExhibitionCarousel } from '../../components/Exhibitions/ExhibitionCarousel';

const exhibitionPreviewStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf : 'center',
    height: hp('65%'),
    width: wp('100%'),
    marginBottom: hp('0.5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderRadius: 5,
    borderColor: PRIMARY_400,
    backgroundColor: PRIMARY_100,
    borderBottomWidth: 0.5,
    // borderStyle: 'dashed',
  },
  galleryIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',           
    height: "10%",
    width: '90%',
  },
  galleryNameComponent: {
    fontSize: 18,
    color: "black",
    fontFamily: "AvenirNext-Regular",
    marginLeft: 10,
    textAlign: 'left',
  },
  imagePreviewContainer: {
    width: wp('90%'),
    height: hp("40%"),
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer:{
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'space-around',
    textAlign: 'left',
    alignContent: 'flex-start',
    height: hp("12.5%"),
    width: '100%',
    marginLeft: 5,
    gap: 5,
  },
  heroImageContainer: {
    height: '70%',
    marginTop: 10,
    width: '80%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('1%'),
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  seeMoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',           
    height: "5%",
    width: '100%',
    backgroundColor: PRIMARY_950,
    
  },

})

export function ExhibitionPreviewCard({
    exhibitionPreview,
    onPressExhibition,
    onPressGallery,
}: {
    exhibitionPreview: ExhibitionPreview
    onPressExhibition: ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => void,
    onPressGallery: ({galleryId} : {galleryId: string}) => void,
}) {

  const [images, setImages] = React.useState<{imageUrl: string, title?: string}[]>([])

  React.useEffect(() => {
    if (exhibitionPreview?.artworkPreviews){
      const images = Object.values(exhibitionPreview.artworkPreviews).map((image) => {
        return {imageUrl: image.artworkImage?.value, title: image.artworkTitle?.value}
      })
      const primaryImage = {imageUrl: exhibitionPreview.exhibitionPrimaryImage?.value}
      setImages([primaryImage, ...images])
    } 
  }, [])

  return (
    <>
      <View
        style={exhibitionPreviewStyle.container}>
          <TouchableOpacity style={exhibitionPreviewStyle.galleryIconContainer} onPress={() => onPressGallery({galleryId: exhibitionPreview.galleryId})}>
              <GalleryIcon galleryLogo={exhibitionPreview?.galleryLogo?.value!}/>
              <TextElement style={exhibitionPreviewStyle.galleryNameComponent}>{exhibitionPreview?.galleryName.value}</TextElement>
          </TouchableOpacity>
          <View style={exhibitionPreviewStyle.imagePreviewContainer}>
            <ExhibitionCarousel images={images} />
          </View>
          
          <View style={exhibitionPreviewStyle.textContainer}>
            <TouchableOpacity onPress={() => onPressExhibition({exhibitionId: exhibitionPreview?.exhibitionId, galleryId: exhibitionPreview?.galleryId})}>
              <View>
                <TextElement
                  style={{...globalTextStyles.baseText, fontWeight: 'bold', color: PRIMARY_900, fontSize: 20}}>
                  {' '}
                  {exhibitionPreview.exhibitionTitle.value} 
                </TextElement>
                <TextElement
                  style={{...globalTextStyles.baseText, fontStyle: 'italic', color: PRIMARY_900, fontSize: 16}}>
                  {' '}
                  {exhibitionPreview?.exhibitionArtist?.value ? exhibitionPreview?.exhibitionArtist?.value : "Group Show"}
                </TextElement>
              </View>
              <View>
              {exhibitionPreview?.closingDate?.value &&  
              exhibitionPreview?.openingDate?.value && 
              (
                <TextElement
                  style={{...globalTextStyles.baseText, color: PRIMARY_900, fontSize: 12}}>
                  {' '}
                  {exhibitionPreview.openingDate?.value ? customLocalDateString(new Date(exhibitionPreview.openingDate?.value)) : "Opening unavailable"}
                  {" - "}
                  {exhibitionPreview.closingDate?.value ? customLocalDateString(new Date(exhibitionPreview.closingDate?.value)) : "Closing unavailable"}
                </TextElement>
              )}
              <TextElement
                style={{...globalTextStyles.baseText, color: PRIMARY_900, fontSize: 12}}>
                {' '}
                {simplifyAddress(exhibitionPreview?.exhibitionLocation?.exhibitionLocationString.value)}
              </TextElement>
              </View>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity style={exhibitionPreviewStyle.seeMoreContainer} >
              <TextElement style={{color: PRIMARY_50}}>See More</TextElement>
          </TouchableOpacity> */}
      </View>
    </>
  );
}
