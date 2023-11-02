import React from 'react';
import {Animated, ImageSourcePropType, StyleSheet, View, Image, } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Colors from '@darta-styles'
import * as Haptics from 'expo-haptics';
import { Snackbar } from 'react-native-paper';


import {getButtonSizes} from '../utils/functions';
import {
  OpenStateEnum,
  OrientationsEnum,
} from '../typing/types';
import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import {
  CombinedInteractionButtons,
} from '../components/Darta/_index';
import { ArtOnWall } from '../components/Artwork/ArtOnWall';
import {
  DEFAULT_GALLERY_IMAGE,
  DEFAULT_Gallery_Image,
  duration,
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
  icons,
} from '../utils/constants';
import {
  RecommenderRoutesEnum,
} from '../typing/routes';
import {ETypes, StoreContext} from '../state/Store';
import { createArtworkRelationshipAPI, listArtworksToRateAPI } from '../utils/apiCalls';
import { IconButton } from 'react-native-paper';
import { TextElement } from '../components/Elements/TextElement';
import FastImage from 'react-native-fast-image';

const galleryWallRaw = DEFAULT_GALLERY_IMAGE;

export function DartaRecommenderView({
  navigation,
}: {
  navigation: any;
}) {
  const {state, dispatch} = React.useContext(StoreContext);
  const [artOnDisplay, setArtOnDisplay] = React.useState<Artwork | undefined>((state.artworksToRate && state.artworksToRate[0]) ? state.artworksToRate[0] : undefined);

  React.useEffect(() => {
    if (state.artworksToRate && state.artworksToRate[0]){
      setArtOnDisplay(state.artworksToRate[0])
    }
  }, [])


  const [backgroundImage] = React.useState<ImageSourcePropType>(galleryWallRaw);
  const [currentZoomScale, setCurrentZoomScale] = React.useState<number>(1);

  const localButtonSizes = getButtonSizes(hp('100%'));

  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [openRatings, setOpenRatings] = React.useState<boolean>(false);
  const [openOptions, setOpenOptions] = React.useState<boolean>(false);

  const fadeAnimNav = React.useRef(new Animated.Value(0)).current;
  const fadeAnimRating = React.useRef(new Animated.Value(0)).current;
  const fadeAnimOptions = React.useRef(new Animated.Value(0)).current;


  React.useEffect(() => {
    fadeAnimNav.addListener(() => {})
    fadeAnimRating.addListener(() => {})
    fadeAnimOptions.addListener(() => {})
  }, [])


  const openOrCloseContainer = (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => {
    switch (openIdentifier) {
      case OpenStateEnum.openNav:
        setOpenNav(instructions || !openNav);
        break;
      case OpenStateEnum.openRatings:
        setOpenRatings(instructions || !openRatings);
        break;
      case OpenStateEnum.openOptions:
        setOpenOptions(instructions || !openOptions);
        break;
      default:
        break;
    }
  };

  const whichFadeAnim = (
    openIdentifier: OpenStateEnum,
  ): {fadeAnim: Animated.Value; currentState: boolean} | null => {
    switch (openIdentifier) {
      case OpenStateEnum.openNav:
        return {fadeAnim: fadeAnimNav, currentState: openNav};
      case OpenStateEnum.openRatings:
        return {fadeAnim: fadeAnimRating, currentState: openRatings};
      case OpenStateEnum.openOptions:
        return {fadeAnim: fadeAnimOptions, currentState: openOptions};
      default:
        return null;
    }
  };

  const fadeButtons = (
    openIdentifier: OpenStateEnum,
    fadeAnim: Animated.Value,
    currentState: boolean,
    instructions?: boolean,
  ) => {
    openOrCloseContainer(openIdentifier, instructions);
    let toValue;
    if (instructions) {
      toValue = instructions ? 1 : 0;
    } else {
      toValue = currentState ? 0 : 1;
    }

    Animated.timing(fadeAnim, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const toggleButtonView = (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => {
    const details = whichFadeAnim(openIdentifier);

    if (details) {
      const {fadeAnim, currentState} = details;
      return fadeButtons(openIdentifier, fadeAnim, currentState, instructions);
    }
  };

  const screenRotation = (orientation: string) => {
    if (
      (state.isPortrait &&
        (orientation === OrientationsEnum.landscapeLeft ||
          orientation === OrientationsEnum.landscapeRight)) ||
      (!state.isPortrait &&
        (orientation === OrientationsEnum.portrait ||
          orientation === OrientationsEnum.portraitUp))
    ) {
      setCurrentZoomScale(1);
      dispatch({
        type: ETypes.setPortrait,
      });
    }
  };

  React.useEffect(() => {
    // Function that gets called whenever the orientation changes
    function handleOrientationChange(event: any) {
      screenRotation(event.orientationInfo.orientation);
      // You can handle the orientation change event here
    }
    const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientationChange);
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const backgroundContainerDimensionsPixels = state.isPortrait
    ? {...galleryDimensionsPortrait}
    : {...galleryDimensionsLandscape};

  const [wallHeight, setWallHeight] = React.useState<number>(96);


  const checkAndSetWallHeight = ({artwork} : {artwork: Artwork}) => {
    const artworkHeight = artwork.artworkDimensions?.heightIn;
    let height = 80;

    if(artwork.artworkDimensions.heightIn){
      height = Number(artwork.artworkDimensions.heightIn.value)
    }
    
    const tooTall = artworkHeight && height > 66;

    if (tooTall){
      setWallHeight((Math.ceil(height / 12) * 12) + 36)
    } else{
      setWallHeight(96)
    }
  }

  React.useEffect(() => {
    if (state.artworksToRate && state.artworkRatingIndex && state.artworksToRate[state.artworkRatingIndex]){
      checkAndSetWallHeight({artwork: state.artworksToRate[state.artworkRatingIndex]})
    }
  }, [state.artworkRatingIndex])


  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const opacity = new Animated.Value(1); 

  const fadeOutAndIn = async (callback: () => Promise<void>) => {
    Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
    }).start(async () => {
        await callback();
        Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    });
  };

  const toggleArtForward = async () => {
    const currentIndex = state.artworkRatingIndex ?? 0;

    if (state.artworksToRate && state.artworksToRate[currentIndex + 1]) {
        const artwork = state.artworksToRate[currentIndex + 1];
        const nextArtwork = state.artworksToRate[currentIndex + 2];

        fadeOutAndIn(async () => {
            try {
                // FastImage.preload([{uri : artwork.artworkImage?.value!}])
                dispatch({
                    type: ETypes.setRatingIndex,
                    artworkRatingIndex: currentIndex + 1,
                });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                setArtOnDisplay(artwork)
            } catch (error) {
                dispatch({
                    type: ETypes.setRatingIndex,
                    artworkRatingIndex: currentIndex + 2,
                });
                Haptics.NotificationFeedbackType.Error
                setArtOnDisplay(nextArtwork)
            }
        });
    } else if (state.artworksToRate) {
        const numberOfArtworks = Object.values(state.artworksToRate).length;
        const artworksToRate = await listArtworksToRateAPI({
            startNumber: numberOfArtworks,
            endNumber: numberOfArtworks + 10,
        });

        const artwork = artworksToRate[currentIndex + 1];
        if (artworksToRate && Object.keys(artworksToRate).length > 0) {
            dispatch({
                type: ETypes.setArtworksToRate,
                artworksToRate,
            });
            dispatch({
                type: ETypes.setRatingIndex,
                artworkRatingIndex: currentIndex + 1,
            });
            setArtOnDisplay(artwork)
        } else {
            onToggleSnackBar();
        }
    }
};


  const toggleArtBackward = async () => {
    const currentIndex = state.artworkRatingIndex ?? 0;
    if (!currentIndex) {
      return 
    } else if (state.artworksToRate && state.artworksToRate[currentIndex - 1]) {
      const artwork = state.artworksToRate[currentIndex - 1];
      fadeOutAndIn(async () => {
        try{ 
        // FastImage.preload([{uri : artwork.artworkImage?.value!}])
        dispatch({
          type: ETypes.setRatingIndex,
          artworkRatingIndex: currentIndex - 1,
        });
        setArtOnDisplay(artwork)
      } catch(error){
        dispatch({
          type: ETypes.setRatingIndex,
          artworkRatingIndex: currentIndex - 2,
        });
        if (state.artworksToRate && state.artworksToRate[currentIndex - 2]){
          setArtOnDisplay(state.artworksToRate[currentIndex - 2])
        } else {
          onToggleSnackBar()
        }
      }
      });
    } else {
      dispatch({
        type: ETypes.setRatingIndex,
        artworkRatingIndex: currentIndex - 1,
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  };

  const toggleArtTombstone = () => {
    dispatch({
      type: ETypes.setTombstoneHeader,
      currentArtworkHeader: artOnDisplay?.artworkTitle?.value!,
    });
    if (artOnDisplay){
      navigation.navigate(RecommenderRoutesEnum.TopTabExhibition, {artOnDisplay, galleryId: artOnDisplay?.galleryId});
    }
  };

  const rateArtwork = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    if (!rating) {
      return;
    }
    try{ 
      await createArtworkRelationshipAPI({artworkId: artOnDisplay?.artworkId!, action: rating})
      switch(rating){
        case (USER_ARTWORK_EDGE_RELATIONSHIP.LIKE):
          dispatch({
            type: ETypes.setUserLikedArtwork,
            artworkId: artOnDisplay?._id!,
          })
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE):
          dispatch({
            type: ETypes.setUserDislikedArtwork,
            artworkId: artOnDisplay?._id!,
          })
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED):
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.SAVE):
          dispatch({
            type: ETypes.setUserSavedArtwork,
            artworkId: artOnDisplay?._id!,
          })
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE):
          dispatch({
            type: ETypes.setUserInquiredArtwork,
            artworkId: artOnDisplay?._id!,
          })
          break;
        }
    } catch(error){
      //TO-DO: update error handling
    }
   

  };


  const SSDartaGalleryView = StyleSheet.create({
    container: {
      backgroundColor: Colors.PRIMARY_200,
      justifyContent: state.isPortrait ? 'flex-start': 'center',
      alignSelf: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    artOnDisplayContainer: {
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],
      backgroundColor: 'black',
    },
    interactionButtonsContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    galleryViewContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    progressBarContainer: {
      alignSelf: 'center',
    },
    interactionContainerPortrait: {
      position: 'absolute',
      alignSelf: 'center',
      width: wp('100%'),
      height: hp('6%'),
      bottom: hp('0%'),
      left: hp('0%'),
    },
    interactionContainerLandscape: {
      position: 'absolute',
      alignSelf: 'center',
      height: wp('20%'),
      bottom: hp('0%'),
      width: wp('90%'),
      left: hp('0%')
    },
    tombstoneTriggerContainer: {
      position: 'absolute',
      alignSelf: 'center',
      width: wp('10%'),
      height: hp('10%'),
      top: hp('0%'),
      right: wp('5%'),
    },
    secondaryButton: {
      backgroundColor: Colors.PRIMARY_50,
      color: 'black',
      opacity: 0.9,
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],
    },
    textElement: {
      fontFamily: 'Avenir Next',
      color: wallHeight === 96 ? Colors.PRIMARY_500 : Colors.PRIMARY_900,
      textAlign: 'center',
      maxWidth: '100%', // Or another value you want
      lineHeight: 20,   // Adjust based on your design
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],

    }
  });

  const interactionContainer = state.isPortrait
  ? SSDartaGalleryView.interactionContainerPortrait
  : SSDartaGalleryView.interactionContainerLandscape;

  const inverseFadeAnim = fadeAnimRating.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
});

  return (
    <GestureHandlerRootView>
      <View style={SSDartaGalleryView.container}>
        <View
          style={[
            backgroundContainerDimensionsPixels,
            SSDartaGalleryView.artOnDisplayContainer,
          ]}>
          <ArtOnWall
            artImage={artOnDisplay?.artworkImage?.value!}
            backgroundImage={backgroundImage}
            backgroundImageDimensionsPixels={
              backgroundContainerDimensionsPixels
            }
            artOnDisplay={artOnDisplay!}
            currentZoomScale={currentZoomScale}
            artworkDimensions={artOnDisplay?.artworkDimensions}
            isPortrait={state.isPortrait}
            wallHeight={wallHeight}
            opacityAnimatedValue={opacity}
            rateArtwork={rateArtwork}
            setCurrentZoomScale={setCurrentZoomScale}
            toggleArtForward={toggleArtForward}
            toggleArtBackward={toggleArtBackward}
          />
        </View>
          {state.isPortrait && (
            <>
          <Animated.Text style={[SSDartaGalleryView.textElement, {opacity: inverseFadeAnim, fontWeight: wallHeight === 96 ? "normal" : "bold"}]}>{`as displayed on a ${wallHeight / 12} foot tall wall`}</Animated.Text>
          <View style={interactionContainer}>
            <View style={SSDartaGalleryView.interactionButtonsContainer}>
              <CombinedInteractionButtons
                artOnDisplay={artOnDisplay!}
                localButtonSizes={localButtonSizes}
                fadeAnimRating={fadeAnimRating}
                isPortrait={state.isPortrait}
                openRatings={openRatings}
                rateArtwork={rateArtwork}
                toggleButtonView={toggleButtonView}
              />
            </View>
          </View>
          <View style={SSDartaGalleryView.tombstoneTriggerContainer}>
            <IconButton
              icon={icons.learnMore}
              mode="outlined"
              size={localButtonSizes.medium}
              iconColor={Colors.PRIMARY_900}
              style={SSDartaGalleryView.secondaryButton}
              accessibilityLabel="view tombstone"
              testID="tombstone"
              onPress={() => toggleArtTombstone()}
            />
          </View>
          </>
          )}
        </View>
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{backgroundColor: Colors.PRIMARY_600}}
        action={{
          label: 'Ok',
          textColor: Colors.PRIMARY_950,
          onPress: () => {
            onDismissSnackBar()
          },
          
        }}>
        <TextElement style={{color: Colors.PRIMARY_50}}>No more artwork to rate right now.</TextElement>
        <TextElement style={{color: Colors.PRIMARY_50}}>Please check back later!</TextElement>
      </Snackbar>
    </GestureHandlerRootView>
  );
}
