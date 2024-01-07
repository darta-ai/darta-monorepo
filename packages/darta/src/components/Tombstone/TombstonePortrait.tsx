import React from 'react';
import {Image, StyleSheet, View, Animated, Pressable} from 'react-native';
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
import * as SVGs from '../../assets/SVGs/index';
import { UserETypes, UserStoreContext } from '../../state/UserStore';
import { DartaImageComponent } from '../Images/DartaImageComponent';

export const currencyConverter = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
type ButtonGeneratorProps = {
  displayText: string, 
  iconComponent: React.ElementType; // Use a more descriptive prop name
  onPress: any,
  textColor: string,
  buttonColor: string,
};


const ButtonGenerator: React.FC<ButtonGeneratorProps> = ({displayText, iconComponent: Icon, onPress, textColor, buttonColor}) => {
  const buttonStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      // width: 100,
      borderRadius: 19,
      paddingTop: 8, 
      paddingBottom: 8, 
      paddingLeft: 16,
      paddingRight: 16,
      gap: 8,
    }
  })
  return(
    <Pressable onPress={onPress} style={{...buttonStyle.container, backgroundColor: buttonColor}}>
      <Icon />
      <TextElement style={{color: textColor, fontSize: 16, fontFamily: 'DMSans_400Regular' }}>
        {displayText}
      </TextElement>
    </Pressable>
  )
}


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

  const {userState, userDispatch} = React.useContext(UserStoreContext);

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
    },
    imageContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: '100%',
      height: hp('40%'),
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    textContainer: {
      width: "100%",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
      gap: 12,
      marginTop: 24,
    },
    textRow: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    priceRow: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'flex-end',
    },
    artTitle: {fontSize: 16, fontFamily: 'DMSans_400Regular_Italic', color: Colors.PRIMARY_950},
    artYear: {fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950},
    artPrice: {fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950},
    artDimensions: {fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_400},
    artMedium: {
      fontSize: 16,
      fontFamily: 'DMSans_400Regular',
      color: Colors.PRIMARY_400,
    },
    inquireButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24,
      gap: 8,
    },
  });


  const [isSaved, setIsSaved] = React.useState(false);
  const [isInquired, setIsInquired] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const [canInquire, setCanInquire] = React.useState(true);
  const opacityLikedButton = React.useRef(new Animated.Value(1)).current; 
  const opacitySavedButton = React.useRef(new Animated.Value(1)).current; 
  const opacityInquiredButton = React.useRef(new Animated.Value(1)).current; 

  React.useEffect(() => {
    opacityLikedButton.addListener(() => {})
    opacitySavedButton.addListener(() => {})
    opacityInquiredButton.addListener(() => {})
  }, [])

  const toggleButtons = ({buttonRef, callback} : {buttonRef: any, callback?: () => void}) => {
    // Animate Out
    Animated.parallel([
      Animated.timing(buttonRef, {
        toValue: 0,  // Fade out
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      if (callback) {
        await callback();
      }
      // Animate In
      Animated.parallel([
        Animated.timing(buttonRef, {
          toValue: 1,  // Fade in
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
};


  React.useEffect(() => {
    const artworkId = artwork?._id!;
    if (userState.userInquiredArtwork?.[artworkId]){
      setIsInquired(true)
    }
    if (userState.userSavedArtwork?.[artworkId]){
      setIsSaved(true)
    }
    if (userState.userLikedArtwork?.[artworkId]){
      setIsLiked(true)
    }

    if(artwork?.canInquire?.value === "No"){
      setCanInquire(false)
    }
    
  }, [artwork, userState.userInquiredArtwork, userState.userSavedArtwork, userState.userLikedArtwork]);

  const removeSavedRating = async () => {
    userDispatch({
      type: UserETypes.removeUserSavedArtwork,
      artworkId: artwork._id!,
    })
    setIsSaved(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
  }

  const removeInquiredRating = async () => {
    userDispatch({
      type: UserETypes.removeUserInquiredArtwork,
      artworkId: artwork._id!,
    })
    setIsInquired(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
  }

  const removeLikeRating = async () => {
    userDispatch({
      type: UserETypes.removeUserLikedArtwork,
      artworkId: artwork._id!,
    })
    setIsLiked(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
  }

  return (
    <View style={{backgroundColor: Colors.PRIMARY_50, padding: 24, height: hp('100%')}}>
        <View style={SSTombstonePortrait.container}>
          <ScrollView
            scrollEventThrottle={7}
            maximumZoomScale={6}
            minimumZoomScale={1}
            scrollToOverflowEnabled={false}
            centerContent>
            <View style={SSTombstonePortrait.imageContainer}>
              <DartaImageComponent
                uri={artwork?.artworkImage?.value!}
                priority={FastImage.priority.normal}
                style={SSTombstonePortrait.image}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </ScrollView>
        </View>
      <ScrollView scrollEventThrottle={7}>
        <View style={SSTombstonePortrait.textContainer}>
          <TextElement
            style={globalTextStyles.sectionHeaderTitle}>
            {artwork?.artistName?.value}
          </TextElement>
          <View style={SSTombstonePortrait.textRow}>
            <View style={{maxWidth: '65%'}}>
              <TextElement
                style={SSTombstonePortrait.artTitle}
                numberOfLines={5}>
                {artwork?.artworkTitle?.value}          
              </TextElement>
            </View>
            <TextElement style={SSTombstonePortrait.artYear}>{artwork?.artworkCreatedYear?.value}</TextElement>
          </View>
          <View>
            <TextElement style={SSTombstonePortrait.artMedium} numberOfLines={1}>{artwork?.artworkMedium?.value}</TextElement>
            <TextElement style={SSTombstonePortrait.artDimensions}>{displayDimensionsString}</TextElement>
          </View>
          <View style={{width: '100%'}}>
            <TextElement style={SSTombstonePortrait.artPrice}>{displayPrice}</TextElement>
          </View>
        </View>
          <View style={SSTombstonePortrait.inquireButton}>
            {canInquire && (
              <Animated.View style={{opacity: opacityInquiredButton, flex: 1}}>
                {isInquired && ( 
                <ButtonGenerator 
                  displayText="Inquired"
                  iconComponent={SVGs.EmailWhiteFillIcon}
                  onPress={() => toggleButtons({buttonRef: opacityInquiredButton, callback: () => removeInquiredRating()})}
                  textColor={Colors.PRIMARY_50}
                  buttonColor={Colors.PRIMARY_950}
                />
              )} 
              {!isInquired && canInquire && (
                <ButtonGenerator 
                displayText="Inquire"
                iconComponent={SVGs.EmailIcon}
                onPress={() => toggleButtons({buttonRef: opacityInquiredButton, callback: () => inquireAlert({artworkId: artwork._id!})})}
                textColor={Colors.PRIMARY_950}
                buttonColor={"#B0B0B019"}
              />
              )} 
              </Animated.View>
            )}
            <Animated.View style={{opacity: opacitySavedButton, flex: 1}}>
              {isSaved ? ( 
              <ButtonGenerator 
                displayText="Saved"
                iconComponent={SVGs.SavedWhiteFillIcon}
                onPress={() => toggleButtons({buttonRef: opacitySavedButton, callback: () => removeSavedRating()})}
                textColor={Colors.PRIMARY_50}
                buttonColor={Colors.PRIMARY_950}
              />
            ) : (
              <ButtonGenerator 
                displayText="Save"
                iconComponent={SVGs.SavedInactiveIconSmall}
                onPress={() => toggleButtons({buttonRef: opacitySavedButton, callback: () => saveArtwork({artworkId: artwork._id!})})}
                textColor={Colors.PRIMARY_950}
                buttonColor={"#B0B0B019"}
              />
            )}
            </Animated.View>
            <Animated.View style={{opacity: opacityLikedButton, flex: 1}}>
              {isLiked ? ( 
              <ButtonGenerator 
                displayText="Liked"
                iconComponent={SVGs.ThumbsUpActiveIcon}
                onPress={() => toggleButtons({buttonRef: opacityLikedButton, callback: () => removeLikeRating()})}
                textColor={Colors.PRIMARY_950}
                buttonColor={"#B0B0B019"}
              />
            ) : (
              <ButtonGenerator 
                displayText="Like"
                iconComponent={SVGs.ThumbsUpInactiveIcon}
                onPress={() => toggleButtons({buttonRef: opacityLikedButton, callback: () => likeArtwork({artworkId: artwork._id!})})}
                textColor={Colors.PRIMARY_950}
                buttonColor={"#B0B0B019"}
              />
            )}
            </Animated.View>
          </View>
      </ScrollView>
    </View>
  );
}
