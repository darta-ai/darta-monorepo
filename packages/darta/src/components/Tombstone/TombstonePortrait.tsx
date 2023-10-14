import React from 'react';
import {Image, StyleSheet, View, Animated} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import * as Colors from '@darta-styles'
import {TextElement} from '../Elements/_index';
import {icons} from '../../utils/constants';
import {globalTextStyles} from '../../styles/styles';
import { ETypes, StoreContext } from '../../state/Store';
import { deleteArtworkRelationship } from '../../utils/apiCalls';


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
  if(artwork?.artworkDimensions.text.value){
    displayDimensionsString = artwork.artworkDimensions.text.value
    .replace(/[\r\n]+/g, '')
    .replace(/ /g, '')
    .replace(/x/g, ' x ')
    .replace(/;/g, '; ')
  }
  let displayPrice = "";

  if (artwork?.artworkPrice?.value){
    displayPrice = "$" + parseInt(artwork?.artworkPrice?.value, 10)?.toLocaleString()
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
      width: wp('90%'),
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
  const opacitySetOne = React.useRef(new Animated.Value(1)).current; 
  const opacitySetTwo = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  const toggleButtons = () => {
    Animated.parallel([
      Animated.timing(opacitySetOne, {
        toValue: isSetOneVisible ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacitySetTwo, {
        toValue: isSetOneVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isSetOneVisible ? 100 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSetOneVisible(!isSetOneVisible);
    });
  };
  const [artworkStatus, setArtworkStatus] = React.useState<USER_ARTWORK_EDGE_RELATIONSHIP | null>(null);
  const [buttonColor, setButtonColor] = React.useState<string>(Colors.PRIMARY_300);
  const [buttonIcon, setButtonIcon] = React.useState<string>(icons.like);

  React.useEffect(() => {
    const artworkId = artwork?._id!;
    if (state.userLikedArtwork?.[artworkId]){
      setArtworkStatus(USER_ARTWORK_EDGE_RELATIONSHIP.LIKE)
      setButtonColor(Colors.PRIMARY_300)
      setButtonIcon(icons.like)
      toggleButtons()
    }
    else if (state.userSavedArtwork?.[artworkId]){
      setArtworkStatus(USER_ARTWORK_EDGE_RELATIONSHIP.SAVE)
      setButtonColor(Colors.PRIMARY_600)
      setButtonIcon(icons.save)
      toggleButtons()
    }
    else if (state.userInquiredArtwork?.[artworkId]){
      setArtworkStatus(USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE)
      setButtonColor(Colors.PRIMARY_800)
      setButtonIcon(icons.inquire)
      toggleButtons()
    }
    
  }, [state.userInquiredArtwork, state.userSavedArtwork, state.userLikedArtwork]);

  const removeRating = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    try {
      await deleteArtworkRelationship({artworkId: artwork._id!, action: rating})

      switch(rating){
        case USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE:
          dispatch({
            type: ETypes.removeUserInquiredArtwork,
            artworkId: artwork._id!,
          })
          break;
        case USER_ARTWORK_EDGE_RELATIONSHIP.SAVE:
          dispatch({
            type: ETypes.removeUserSavedArtwork,
            artworkId: artwork._id!,
          })
          break;
        case USER_ARTWORK_EDGE_RELATIONSHIP.LIKE:
          dispatch({
            type: ETypes.removeUserLikedArtwork,
            artworkId: artwork._id!,
          })
          break;
      }
      toggleButtons()
    } catch(error){
      console.log(error)
    } finally {
      
    }
  }

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
              <Image
                source={{uri: artwork?.artworkImage?.value!}}
                style={SSTombstonePortrait.image}
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
        <Animated.View style={{...SSTombstonePortrait.inquireButton, opacity: opacitySetOne, transform: [{ translateY: translateY }] }}>
          {isSetOneVisible && (
            <>
              <View>
                <Button
                  icon={icons.like}
                  dark
                  buttonColor={Colors.PRIMARY_300}
                  loading={likeLoading}
                  mode="contained"
                  onPress={() => likeArtwork({artworkId: artwork._id!})}>
                  Like
                </Button>
              </View>
              <View>
                <Button
                  icon={icons.save}
                  dark
                  loading={saveLoading}
                  buttonColor={Colors.PRIMARY_600}
                  mode="contained"
                  onPress={() => saveArtwork({artworkId: artwork._id!})}>
                  Save
                </Button>
              </View>
              {artwork?.canInquire?.value !== "No" && (
              <View>
                <Button
                  icon={icons.inquire}
                  dark
                  buttonColor={Colors.PRIMARY_800}
                  mode="contained"
                  onPress={() => inquireAlert({artworkId: artwork._id!})}>
                  Inquire
                </Button>
              </View>
              )}
            </>
          )}
        </Animated.View>
        <Animated.View style={{...SSTombstonePortrait.inquireButton, opacity: opacitySetTwo, transform: [{ translateY: Animated.subtract(100, translateY) }]}}>
        {!isSetOneVisible && (
          <View style={{width: '50%'}}>
            <Button
              icon={buttonIcon}
              dark
              buttonColor={buttonColor}
              loading={likeLoading}
              mode="contained"
              onPress={() => artworkStatus && removeRating(artworkStatus)}>
              remove {artworkStatus?.toLowerCase()}
            </Button>
          </View>
        )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
