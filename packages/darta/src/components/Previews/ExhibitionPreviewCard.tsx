/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {globalTextStyles} from '../../styles/styles';
import {Artwork, Exhibition, ExhibitionDates, ExhibitionPreview, IGalleryProfileData} from '@darta-types';
import { PRIMARY_700, PRIMARY_900, PRIMARY_100, PRIMARY_950, PRIMARY_50 } from '@darta-styles';
import { customLocalDateString } from '../../utils/functions';
import { StoreContext } from '../../state/Store';
import { GalleryIcon } from '../Elements/_index';
import { ExhibitionCarousel } from '../../components/Exhibitions/ExhibitionCarousel';

const exhibitionPreviewStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf : 'center',
    height: hp('65%'),
    width: wp('90%'),
    margin: hp('1%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: PRIMARY_700,
    backgroundColor: PRIMARY_100,
    borderWidth: 1,
  },
  galleryIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',           
    height: "10%",
    width: '95%',
    marginLeft: 5,
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
    height: "50%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  textContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    textAlign: 'left',
    alignContent: 'flex-start',
    height: "35%",
    width: '100%',
    marginLeft: 5,
    gap: 5,
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
}: {
    exhibitionPreview: ExhibitionPreview
    onPressExhibition: ({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) => void,
}) {

  const {state} = React.useContext(StoreContext);

  let images = [] as any[];
  let exhibition = {} as Exhibition;
  if (state.exhibitionData && state.exhibitionData[exhibitionPreview.exhibitionId]){
    exhibition = state.exhibitionData[exhibitionPreview.exhibitionId]
    images.push({imageUrl: exhibition.exhibitionPrimaryImage?.value!, title: ""})
  } 
  let gallery = {} as IGalleryProfileData;
  if (state.galleryData && state.galleryData[exhibitionPreview.galleryId]){
    gallery = state.galleryData[exhibitionPreview.galleryId]
  }
  if (exhibitionPreview.artworkIds){
    exhibitionPreview.artworkIds.forEach((artworkId) => {
      if (state.artworkData && state.artworkData[artworkId]){
        images.push({imageUrl: state.artworkData[artworkId].artworkImage?.value!, title: state.artworkData[artworkId].artworkTitle?.value!})
      }
    })
  }

  return (
    <>
      <View
        style={exhibitionPreviewStyle.container}>
          <View style={exhibitionPreviewStyle.galleryIconContainer}>
              <GalleryIcon galleryLogo={gallery.galleryLogo?.value!}/>
              <TextElement style={exhibitionPreviewStyle.galleryNameComponent}>{gallery.galleryName?.value!}</TextElement>
          </View>
          <View style={exhibitionPreviewStyle.imagePreviewContainer}>
            < ExhibitionCarousel images={images} />
          </View>

        <View style={exhibitionPreviewStyle.textContainer}>
          <View>
            <TextElement
              style={{...globalTextStyles.baseText, fontWeight: 'bold', color: PRIMARY_900, fontSize: 20}}>
              {' '}
              {exhibition.exhibitionTitle.value} 
            </TextElement>
            <TextElement
              style={{...globalTextStyles.baseText, fontStyle: 'italic', color: PRIMARY_900, fontSize: 16}}>
              {' '}
              {exhibition.exhibitionArtist?.value ? exhibition.exhibitionArtist.value : "Group Show"}
            </TextElement>
          </View>
          <View>
          {exhibition.exhibitionDates.exhibitionDuration &&  
          exhibition.exhibitionDates.exhibitionDuration.value === "Temporary" 
          && exhibition.exhibitionDates?.exhibitionStartDate.value 
          && exhibition.exhibitionDates?.exhibitionEndDate.value &&
          (
            <TextElement
              style={{...globalTextStyles.baseText, color: PRIMARY_900,  fontSize: 16}}>
              {' '}
              {exhibition.exhibitionDates?.exhibitionStartDate.value ? customLocalDateString(new Date(exhibition.exhibitionDates?.exhibitionStartDate.value)) : "Dates TBD"}
              {" - "}
              {exhibition.exhibitionDates?.exhibitionEndDate.value ? customLocalDateString(new Date(exhibition.exhibitionDates?.exhibitionEndDate.value)) : "Dates TBD"}
            </TextElement>
          )}
          {exhibition.exhibitionDates.exhibitionDuration && 
          exhibition.exhibitionDates.exhibitionDuration.value !== "Temporary" && (
            <TextElement style={{...globalTextStyles.baseText, color: PRIMARY_900}}>
              {' '}
              {exhibition.exhibitionDates.exhibitionDuration.value}
          </TextElement>
          )}
          <TextElement
            style={{...globalTextStyles.baseText, color: PRIMARY_900,}}>
            {' '}
            {exhibition.exhibitionLocation.locationString?.value}
          </TextElement>
          </View>
        </View>
          <TouchableOpacity style={exhibitionPreviewStyle.seeMoreContainer} onPress={() => onPressExhibition({exhibitionId: exhibition.exhibitionId, galleryId: gallery._id!})}>
              <TextElement style={{color: PRIMARY_50}}>See More</TextElement>
          </TouchableOpacity>
      </View>
    </>
  );
}
