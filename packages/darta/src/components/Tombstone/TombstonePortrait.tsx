import React from 'react';
import {Image, StyleSheet, View, Animated} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import * as Colors from '@darta-styles'
import {TextElement} from '../Elements/_index';
import {icons} from '../../utils/constants';
import {globalTextStyles} from '../../styles/styles';
import { ETypes, StoreContext } from '../../state/Store';
import { deleteArtworkRelationshipAPI } from '../../utils/apiCalls';

export const currencyConverter = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};



export function TombstonePortrait({
  artwork,
  saveLoading,
  likeLoading,
  inquireAlert,
  likeArtwork, 
  saveArtwork,
}: {
  artwork: Artwork,
  saveLoading: boolean,
  likeLoading: boolean,
  likeArtwork: ({artworkId} : {artworkId: string}) => void,
  saveArtwork: ({artworkId} : {artworkId: string}) => void,
  inquireAlert: ({artworkId} : {artworkId: string}) => void,
}) {

  const {state, dispatch} = React.useContext(StoreContext);

  let inputHeight = artwork?.artworkDimensions?.heightIn?.value ?? "1"
  let inputWidth = artwork?.artworkDimensions?.widthIn?.value ?? "1"

  const height = parseInt(inputHeight, 10)
  const width = parseInt(inputWidth, 10)


  let displayDimensionsString = "";
  if(artwork?.artworkDimensions?.text?.value){
    displayDimensionsString = artwork.artworkDimensions.text.value
    .replace(/[\r\n]+/g, '')
    .replace(/ /g, '')
    .replace(/x/g, ' x ')
    .replace(/;/g, '; ')
  }
  let displayPrice = "";

  if (artwork?.artworkPrice?.value){
    const currency = artwork?.artworkCurrency?.value ?? "USD"
    const displayCurrency = currencyConverter[currency]
    displayPrice = displayCurrency + parseInt(artwork?.artworkPrice?.value, 10)?.toLocaleString()
  } else {
    displayPrice = "Price Upon Request"
  }

  
  const maxDimension = Math.floor(wp('100%') * 0.7);

  let artHeight: number | undefined;
  let artWidth : number | undefined;
  if (height && width && height >= width) {
    artHeight = maxDimension;
    artWidth = Math.floor((width / height) * artHeight);
  }
  if (height && width && height < width) {
    artWidth = maxDimension;
    artHeight = Math.floor((height / width) * artWidth);
  }
  const SSTombstonePortrait = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      gap: 10,
      marginTop: hp('2%'),
    },
    imageContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: wp('99%'),
      height: hp('40%'),
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    textContainer: {
      width: wp('90%'),
      height: hp('20%'),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',

      alignSelf: 'center',
      alignItems: 'center',
    },
    artistName: {
      marginTop: hp('3%'),
      fontSize: 20,
      textAlign: 'center',
    },
    artTitle: {fontSize: 17, textAlign: 'center', color: Colors.PRIMARY_950},
    artMedium: {fontSize: 15, textAlign: 'center', color: Colors.PRIMARY_950},
    artDimensions: {fontSize: 12, color: Colors.PRIMARY_950},
    artPrice: {
      textAlign: 'center',
      fontSize: 14,
      color: Colors.PRIMARY_950
    },
    inquireButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: hp('2%'),
    },
  });


  const [isSetOneVisible, setIsSetOneVisible] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isInquired, setIsInquired] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const opacitySetOne = React.useRef(new Animated.Value(1)).current; 
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    opacitySetOne.addListener(() => {})
    translateY.addListener(() => {})
  }, [])

  const toggleButtons = ({callback} : {callback?: () => void}) => {
    // Animate Out
    Animated.parallel([
      Animated.timing(opacitySetOne, {
        toValue: 0,  // Fade out
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 100,  // Move down
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      setIsSetOneVisible(!isSetOneVisible);  // Toggle the state
      
      // Run the callback after animating out
      if (callback) {
        await callback();
      }
      
      // Animate In
      Animated.parallel([
        Animated.timing(opacitySetOne, {
          toValue: 1,  // Fade in
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,  // Move up
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
};


  
  const [buttonColor, setButtonColor] = React.useState<string>(Colors.PRIMARY_300);

  React.useEffect(() => {
    const artworkId = artwork?._id!;
    if (state.userInquiredArtwork?.[artworkId]){
      setButtonColor(Colors.PRIMARY_800)
      setIsInquired(true)
    }
    if (state.userSavedArtwork?.[artworkId]){
      setIsSaved(true)
      setButtonColor(Colors.PRIMARY_600)
    }
    if (state.userLikedArtwork?.[artworkId]){
      setButtonColor(Colors.PRIMARY_300)
      setIsLiked(true)
    }
    
  }, [state.userInquiredArtwork, state.userSavedArtwork, state.userLikedArtwork]);

  const removeSavedRating = async () => {
    dispatch({
      type: ETypes.removeUserSavedArtwork,
      artworkId: artwork._id!,
    })
    setIsSaved(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
  }

  const removeInquiredRating = async () => {
    dispatch({
      type: ETypes.removeUserInquiredArtwork,
      artworkId: artwork._id!,
    })
    setIsInquired(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
  }

  const removeLikeRating = async () => {
    dispatch({
      type: ETypes.removeUserLikedArtwork,
      artworkId: artwork._id!,
    })
    setIsLiked(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
  }

  const SaveButton = () => (
      <View>
        <Button
          icon={icons.save}
          dark
          loading={saveLoading}
          buttonColor={Colors.PRIMARY_600}
          mode="contained"
          onPress={() => toggleButtons({callback: () => saveArtwork({artworkId: artwork._id!})})}>
          Save
        </Button>
    </View>
  )

  const InquireButton = () => (
    <View>
      <Button
        icon={icons.inquire}
        dark
        buttonColor={Colors.PRIMARY_800}
        mode="contained"
        onPress={() => toggleButtons({callback: () => inquireAlert({artworkId: artwork._id!})})}>

        Inquire
      </Button>
    </View>
  )

  const LikeButton = () => (
    <View>
      <Button
        icon={icons.like}
        dark
        buttonColor={Colors.PRIMARY_300}
        loading={likeLoading}
        mode="contained"
        onPress={() => toggleButtons({callback: () => likeArtwork({artworkId: artwork._id!})})}>

        Like
      </Button>
    </View>
  )

  const RemoveInquire = () => (
    <View>
      <Button
        icon={icons.removeRating}
        dark
        buttonColor={Colors.PRIMARY_800}
        loading={likeLoading}
        mode="contained"
        onPress={() => toggleButtons({callback: () => removeInquiredRating()})}>
        remove inquire
      </Button>
    </View>
  )


  const RemoveSave = () => (
    <View>
      <Button
        icon={icons.removeRating}
        dark
        buttonColor={Colors.PRIMARY_600}
        loading={likeLoading}
        mode="contained"
        onPress={() => toggleButtons({callback: () => removeSavedRating()})}>
        remove save
      </Button>
    </View>
  )

  const RemoveLike = () => (
    <View style={{width: '50%'}}>
      <Button
        icon={icons.removeRating}
        dark
        buttonColor={buttonColor}
        loading={likeLoading}
        mode="contained"
        onPress={() => toggleButtons({callback: () => removeLikeRating()})}>
        remove like
      </Button>
    </View>
  )


  return (
    <View style={{backgroundColor: Colors.PRIMARY_50, height: hp('100%')}}>
        <View style={SSTombstonePortrait.container}>
          <ScrollView
            scrollEventThrottle={7}
            maximumZoomScale={6}
            minimumZoomScale={1}
            scrollToOverflowEnabled={false}
            centerContent>
            <View style={SSTombstonePortrait.imageContainer}>
              <FastImage
                source={{uri: artwork?.artworkImage?.value!}}
                style={SSTombstonePortrait.image}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </ScrollView>
        </View>
      <ScrollView scrollEventThrottle={7}>
        <View style={SSTombstonePortrait.textContainer}>
          <TextElement
            style={[
              globalTextStyles.boldTitleText,
              SSTombstonePortrait.artistName,
            ]}>
            {artwork?.artistName?.value}
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artTitle,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={5}>
            {artwork?.artworkTitle?.value}
            {', '}
            <TextElement>{artwork?.artworkCreatedYear?.value}</TextElement>
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artMedium,
              globalTextStyles.italicTitleText,
            ]}
            numberOfLines={1}>
            {artwork?.artworkMedium?.value}
          </TextElement>
          <TextElement
            style={[
              SSTombstonePortrait.artDimensions,
              globalTextStyles.centeredText,
            ]}
            >
            {displayDimensionsString}
            {'\n'}
          </TextElement>
          <TextElement
            style={[
              globalTextStyles.baseText,
              SSTombstonePortrait.artPrice,
            ]}>
            {displayPrice}
          </TextElement>
        </View>
        <Animated.View 
          style={{
            ...SSTombstonePortrait.inquireButton,
            opacity: opacitySetOne,
            transform: [{ translateY: translateY }]
          }}>
          {!isLiked && !isSaved && !isInquired && (
            <>
              <LikeButton />
              <SaveButton />
            </>
          )}
          {isLiked && !isSaved && (
            <RemoveLike />
          )}
          {isSaved && (
            <RemoveSave />
          )}
          {!isInquired && !isLiked && artwork?.canInquire?.value !== "No" && (
            <InquireButton />
          )}
          {isInquired && (
            <RemoveInquire />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
