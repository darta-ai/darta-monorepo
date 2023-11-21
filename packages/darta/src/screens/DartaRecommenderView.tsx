import React from 'react';
import {Animated, ImageSourcePropType, StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Colors from '@darta-styles'
import * as Haptics from 'expo-haptics';
import { Snackbar, Surface } from 'react-native-paper';


import {
  IUserArtworkRated,
  OpenStateEnum,
  OrientationsEnum,
  RatingEnum,
} from '../typing/types';
import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtOnWall } from '../components/Artwork/ArtOnWall';
import {
  DEFAULT_GALLERY_IMAGE,
  duration,
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../utils/constants';
import {
  RecommenderRoutesEnum,
} from '../typing/routes';
import {ETypes, StoreContext} from '../state/Store';
import { createArtworkRelationshipAPI, deleteArtworkRelationshipAPI, listArtworksToRateStatelessRandomSamplingAPI } from '../utils/apiCalls';
import { TextElement } from '../components/Elements/TextElement';
import * as SVGs from '../assets/SVGs';

const galleryWallRaw = DEFAULT_GALLERY_IMAGE;

export function DartaRecommenderView({
  navigation,
}: {
  navigation: any;
}) {
  const {state, dispatch} = React.useContext(StoreContext);
  const [artOnDisplay, setArtOnDisplay] = React.useState<Artwork | undefined>();

  React.useEffect(() => {
    if (state.artworksToRate && state.artworksToRate[0]){
      setArtOnDisplay(state.artworksToRate[0])
    }
  }, [])

  // const [backgroundImage] = React.useState<ImageSourcePropType>(galleryWallRaw);
  const [currentZoomScale, setCurrentZoomScale] = React.useState<number>(1);


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


  const [visibleError, setVisibleError] = React.useState(false);

  const onToggleSnackBarError = () => setVisibleError(!visibleError);

  const onDismissSnackBarError = () => setVisibleError(false);

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
        const artworkIds = findArtworkIds({artworks: Object.values(state.artworksToRate)})
        try{
          const artworksToRate = await listArtworksToRateStatelessRandomSamplingAPI({
            startNumber: numberOfArtworks,
            endNumber: numberOfArtworks + 10,
            artworkIds
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
        } catch(error: any) {
          onToggleSnackBarError();
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    dispatch({
      type: ETypes.setTombstoneHeader,
      currentArtworkHeader: artOnDisplay?.artworkTitle?.value!,
    });
    if (artOnDisplay){
      navigation.navigate(RecommenderRoutesEnum.TopTabExhibition, {artOnDisplay, galleryId: artOnDisplay?.galleryId, exhibitionId: artOnDisplay?.exhibitionId});
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

  const findArtworkIds = ({artworks} : {artworks : Artwork[]}) => {
    const artworkIds: string[] = []
    artworks.forEach(artwork => {
      artworkIds.push(artwork._id!)
    })
    return artworkIds
  }

  const SSDartaGalleryView = StyleSheet.create({
    container: {
      backgroundColor: Colors.PRIMARY_50,
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
    dislikeContainer: {
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: 50,
      width: 72,
      height: 72,
      backgroundColor: Colors.PRIMARY_50,
      top: 500,
      left: 76,
      display:'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    touchableContainer: {
      borderRadius: 50, width: 72, height: 72, justifyContent: 'center', alignItems: 'center'
    },
    likeContainer: {
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: 50,
      width: 72,
      height: 72,
      backgroundColor: Colors.PRIMARY_50,
      top: 500,
      right: 76,
      display:'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center', 
      transform: state.isPortrait ? [{rotate: '180deg'}] : [{rotate: '90deg'}],
    },
    saveContainer: {
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: 50,
      width: 48,
      height: 48,
      backgroundColor: Colors.PRIMARY_50,
      top: 500 + 12,
      left: wp('50%') - 24,
      display:'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    },
    secondaryButton: {
      backgroundColor: Colors.PRIMARY_50,
      color: 'black',
      opacity: 0.9,
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],
    },
    textElement: {
      fontFamily: 'DMSans_400',
      color: wallHeight === 96 ? Colors.PRIMARY_500 : Colors.PRIMARY_900,
      textAlign: 'center',
      maxWidth: '100%', // Or another value you want
      lineHeight: 20,   // Adjust based on your design
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],

    }
  });


  const [currentArtRating, setCurrentArtRating] = React.useState<IUserArtworkRated>({});

  React.useEffect(() => {
    modifyDisplayRating()
  }, [artOnDisplay, state.userLikedArtwork, state.userDislikedArtwork, state.userSavedArtwork])

  const handleArtworkRating = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    if (!artOnDisplay) return rating

    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = state?.userLikedArtwork;
    const dislikedArtworks = state?.userDislikedArtwork;
    const savedArtworks = state?.userSavedArtwork;
    const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
    const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
    const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false
    const userRated = userLiked || userSaved || userDisliked

    if (userLiked && rating === USER_ARTWORK_EDGE_RELATIONSHIP.LIKE){
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
      dispatch({
        type: ETypes.removeUserLikedArtwork,
        artworkId: artOnDisplay._id,
      })
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userSaved && rating === USER_ARTWORK_EDGE_RELATIONSHIP.SAVE){
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
      dispatch({
        type: ETypes.removeUserSavedArtwork,
        artworkId: artOnDisplay._id,
      })
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userDisliked && rating === USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE){
      dispatch({
        type: ETypes.removeUserDislikedArtwork,
        artworkId: artOnDisplay._id,
      })
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userRated){
      if (userLiked){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
        dispatch({
          type: ETypes.removeUserLikedArtwork,
          artworkId: artOnDisplay._id,
        })
      } else if (userSaved){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
        dispatch({
          type: ETypes.removeUserSavedArtwork,
          artworkId: artOnDisplay._id,
        })
      } else if (userDisliked){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
        dispatch({
          type: ETypes.removeUserDislikedArtwork,
          artworkId: artOnDisplay._id,
        })
      }
      return rating
    } else {
      return rating
    }
  }

  const modifyDisplayRating = () => {
    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = state?.userLikedArtwork;
    const dislikedArtworks = state?.userDislikedArtwork;
    const savedArtworks = state?.userSavedArtwork;
    
    const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
    const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
    const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false


     if (userSaved){
      setCurrentArtRating({[RatingEnum.save]: true})
    } else if (userLiked){
      setCurrentArtRating({[RatingEnum.like]: true})
    } else if (userDisliked){
      setCurrentArtRating({[RatingEnum.dislike]: true})
    } else {
      setCurrentArtRating({})
    }
  };

  const wiggleAnim = React.useRef(new Animated.Value(0)).current; 
  const thumbsUpAnim = React.useRef(new Animated.Value(1)).current; 
  const thumbsDownAnim = React.useRef(new Animated.Value(1)).current; 

  React.useEffect(() => {
    wiggleAnim.addListener(() => {})
    thumbsUpAnim.addListener(() => {})
    thumbsDownAnim.addListener(() => {})
  }, [])


  
  const handleSavePress = async () => {
    // Start the first part of the wiggle animation
    Animated.timing(wiggleAnim, {
      toValue: 1,  // Rotate slightly right
      duration: 50,
      useNativeDriver: true,
    }).start(async () => {
      // Network call in the middle of the wiggle
      await rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.SAVE));
  
      // Complete the wiggle animation
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: -1,  // Rotate slightly left
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,  // Return to original position
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        if(!currentArtRating[RatingEnum.save]) {
          await toggleArtForward()
        }
        Animated.sequence([
          Animated.timing(wiggleAnim, {
            toValue: -1,  // Rotate slightly left
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: 0,  // Rotate slightly left
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start()
      });
    });
  };

  const handleThumbsUpPress = async () => {
    // Start the rising animation
    Animated.timing(thumbsUpAnim, {
      toValue: -5,  // Move up (negative value for upward movement)
      duration: 50,
      useNativeDriver: true,
    }).start(async () => {
      // After the animation, make the network call
      await rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.LIKE));
  
      Animated.sequence([
        Animated.timing(thumbsUpAnim, {
          toValue: 5,  // Rotate slightly left
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(thumbsUpAnim, {
          toValue: 0,  // Return to original position
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        if(!currentArtRating[RatingEnum.like]) {
          await toggleArtForward()
        }
         Animated.sequence([
          Animated.timing(thumbsUpAnim, {
            toValue: 0,  // Rotate slightly left
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(thumbsUpAnim, {
            toValue: 5,  // Return to original position
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(thumbsUpAnim, {
            toValue: 0,  // Rotate slightly left
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start()
      });
    });
  };

  const handleThumbsDownPress = async () => {
    // Start the rising animation
    Animated.timing(thumbsDownAnim, {
      toValue: -5,  // Move up (negative value for upward movement)
      duration: 50,
      useNativeDriver: true,
    }).start(async () => {
      // After the animation, make the network call
      await rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE));
  
      Animated.sequence([
        Animated.timing(thumbsDownAnim, {
          toValue: 5,  // Rotate slightly left
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(thumbsDownAnim, {
          toValue: 0,  // Return to original position
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        if(!currentArtRating[RatingEnum.dislike]) {
          await toggleArtForward()
        }
        Animated.sequence([
          Animated.timing(thumbsDownAnim, {
            toValue: 0,  // Rotate slightly left
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(thumbsDownAnim, {
            toValue: 5,  // Return to original position
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(thumbsDownAnim, {
            toValue: 0,  // Rotate slightly left
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start()
      });
    });
  };


  
  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-25deg', '25deg'],  // Small rotation range for wiggle
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
            backgroundImage={galleryWallRaw}
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
            toggleArtTombstone={toggleArtTombstone}
          />
        </View>
          {state.isPortrait && (
            <>
          <Surface style={SSDartaGalleryView.dislikeContainer}>
            <TouchableOpacity onPress={handleThumbsDownPress} style={SSDartaGalleryView.touchableContainer}>
              <Animated.View style={{ transform: [{ translateY: thumbsDownAnim }] }}>
                {currentArtRating[RatingEnum.dislike] ?  <SVGs.ThumbsDownLargeFillIcon /> : <SVGs.ThumbsDownLargeIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          <Surface style={SSDartaGalleryView.saveContainer}>
            <TouchableOpacity onPress={handleSavePress}>
              <Animated.View style={{ transform: [{ rotate }] }}>
                {currentArtRating[RatingEnum.save]  ?  <SVGs.SavedActiveIconLarge /> : <SVGs.SavedInactiveIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          <Surface style={SSDartaGalleryView.likeContainer}>
            <TouchableOpacity onPress={handleThumbsUpPress} style={SSDartaGalleryView.touchableContainer}>
              <Animated.View style={{ transform: [{ translateY: thumbsUpAnim }] }}>
                {currentArtRating[RatingEnum.like]  ?  <SVGs.ThumbsDownLargeFillIcon /> : <SVGs.ThumbsDownLargeIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
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
      <Snackbar
        visible={visibleError}
        onDismiss={onDismissSnackBarError}
        style={{backgroundColor: Colors.PRIMARY_600}}
        action={{
          label: 'Ok',
          textColor: Colors.PRIMARY_950,
          onPress: () => {
            onDismissSnackBarError()
          }
        }}>
        <TextElement style={{color: Colors.PRIMARY_50}}>Something went wrong fetching more artwork.</TextElement>
        <TextElement style={{color: Colors.PRIMARY_50}}>Please check back later!</TextElement>
      </Snackbar>
    </GestureHandlerRootView>
  );
}
