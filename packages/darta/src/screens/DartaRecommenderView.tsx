import React from 'react';
import {Animated, StyleSheet, View } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Colors from '@darta-styles'
import * as Haptics from 'expo-haptics';
import { Snackbar, Surface } from 'react-native-paper';

import {
  IUserArtworkRated,
  RatingEnum,
} from '../typing/types';
import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtOnWall } from '../components/Artwork/ArtOnWall';
import {
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../utils/constants';
import {
  RecommenderRoutesEnum,
} from '../typing/routes';
import { createArtworkRelationshipAPI, deleteArtworkRelationshipAPI, listArtworksToRateStatelessRandomSamplingAPI } from '../utils/apiCalls';
import { TextElement } from '../components/Elements/TextElement';
import * as SVGs from '../assets/SVGs';
import analytics from '@react-native-firebase/analytics';
import { UIStoreContext, UiETypes, StoreContext, ViewStoreContext, ViewETypes } from '../state';
import { UserETypes, UserStoreContext } from '../state/UserStore';


const SSDartaGalleryView = StyleSheet.create({
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
    top: hp('65%'),
    left: 76,
    display:'flex', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  touchableContainer: {
    borderRadius: 50, width: 72, height: 72, justifyContent: 'center', alignItems: 'center',
  },
});

export function DartaRecommenderView({
  navigation,
}: {
  navigation: any;
}) {
  const {state} = React.useContext(StoreContext);
  const {viewState, viewDispatch} = React.useContext(ViewStoreContext);
  const {userState, userDispatch} = React.useContext(UserStoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);

  const [artOnDisplay, setArtOnDisplay] = React.useState<Artwork | undefined>();
  const [currentZoomScale, setCurrentZoomScale] = React.useState<number>(1);
  const fadeAnimNav = React.useRef(new Animated.Value(0)).current;
  const fadeAnimRating = React.useRef(new Animated.Value(0)).current;
  const fadeAnimOptions = React.useRef(new Animated.Value(0)).current;


  const backgroundContainerDimensionsPixels = state.isPortrait
    ? {...galleryDimensionsPortrait}
    : {...galleryDimensionsLandscape};

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
    const currentIndex = viewState.artworkRatingIndex ?? 0;

    if (viewState.artworksToRate && viewState.artworksToRate[currentIndex + 1]) {
        const artwork = viewState.artworksToRate[currentIndex + 1];
        const nextArtwork = viewState.artworksToRate[currentIndex + 2];

        fadeOutAndIn(async () => {
          try {
            const artworkRatingIndex = currentIndex + 1;
              // FastImage.preload([{uri : artwork.artworkImage?.value!}])
              viewDispatch({
                type: ViewETypes.setRatingIndex,
                artworkRatingIndex,
              });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
              setArtOnDisplay(artwork)
          } catch (error) {
            viewDispatch({
                type: ViewETypes.setRatingIndex,
                artworkRatingIndex: currentIndex + 2,
              });
              Haptics.NotificationFeedbackType.Error
              setArtOnDisplay(nextArtwork)
          }
        });
    } else if (viewState.artworksToRate) {
        const numberOfArtworks = Object.values(viewState.artworksToRate).length;
        const artworkIds = findArtworkIds({artworks: Object.values(viewState.artworksToRate)})
        try{
          const artworksToRate = await listArtworksToRateStatelessRandomSamplingAPI({
            startNumber: numberOfArtworks,
            endNumber: numberOfArtworks + 10,
            artworkIds
        });

        const artwork = artworksToRate[currentIndex + 1];
        if (artworksToRate && Object.keys(artworksToRate).length > 0) {
          viewDispatch({
            type: ViewETypes.setArtworksToRate,
            artworksToRate,
          });
          viewDispatch({
            type: ViewETypes.setRatingIndex,
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
    const currentIndex = viewState.artworkRatingIndex ?? 0;
    if (!currentIndex) {
      return 
    } else if (viewState.artworksToRate && viewState.artworksToRate[currentIndex - 1]) {
      const artwork = viewState.artworksToRate[currentIndex - 1];
      fadeOutAndIn(async () => {
        try{ 
          viewDispatch({
            type: ViewETypes.setRatingIndex,
            artworkRatingIndex: currentIndex - 1,
          });
        setArtOnDisplay(artwork)
      } catch(error){
        if (viewState.artworksToRate && viewState.artworksToRate[currentIndex - 2]){
          viewDispatch({
            type: ViewETypes.setRatingIndex,
            artworkRatingIndex: currentIndex - 2,
          });
          setArtOnDisplay(viewState.artworksToRate[currentIndex - 2])
        } else {
          onToggleSnackBar()
        }
      }
      });
    } else {
      viewDispatch({
        type: ViewETypes.setRatingIndex,
        artworkRatingIndex: currentIndex - 1,
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  };

  const toggleArtTombstone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    uiDispatch({
      type: UiETypes.setTombstoneHeader,
      currentArtworkHeader: artOnDisplay?.artworkTitle?.value!,
    });
    if (artOnDisplay){
      navigation.navigate(RecommenderRoutesEnum.TopTabExhibition, {artOnDisplay, galleryId: artOnDisplay?.galleryId, exhibitionId: artOnDisplay?.exhibitionId, artworkTitle: artOnDisplay?.artworkTitle?.value!});
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
          userDispatch({
            type: UserETypes.setUserLikedArtwork,
            artworkId: artOnDisplay?._id!,
          })
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          analytics().logEvent('like_artwork')
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE):
          userDispatch({
            type: UserETypes.setUserDislikedArtwork,
            artworkId: artOnDisplay?._id!,
          })
          analytics().logEvent('dislike_artwork')
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED):
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.SAVE):
          userDispatch({
            type: UserETypes.setUserSavedArtwork,
            artworkId: artOnDisplay?._id!,
          })
          userDispatch({
            type: UserETypes.saveArtwork,
            artworkData: artOnDisplay!,
          });
          analytics().logEvent('save_artwork')
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE):
          userDispatch({
            type: UserETypes.setUserInquiredArtwork,
            artworkId: artOnDisplay?._id!,
          })
          userDispatch({
            type: UserETypes.saveArtwork,
            artworkData: artOnDisplay!,
          });
          analytics().logEvent('inquire_artwork')
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

  const SSDartaGalleryViewDynamic = StyleSheet.create({
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
    likeContainer: {
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: 50,
      width: 72,
      height: 72,
      backgroundColor: Colors.PRIMARY_50,
      top: hp('65%'),
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
      top: hp('65%') + 12,
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
  });


  const [currentArtRating, setCurrentArtRating] = React.useState<IUserArtworkRated>({});

  React.useEffect(() => {
    modifyDisplayRating()
  }, [artOnDisplay, userState.userLikedArtwork, userState.userDislikedArtwork, userState.userSavedArtwork])

  const handleArtworkRating = React.useCallback(async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    const currentIndexOfArtwork = viewState.artworkRatingIndex ?? 0;
    const artOnDisplay = viewState.artworksToRate?.[currentIndexOfArtwork]
    if (!artOnDisplay) return rating

    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = userState?.userLikedArtwork;
    const dislikedArtworks = userState?.userDislikedArtwork;
    const savedArtworks = userState?.userSavedArtwork;
    const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
    const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
    const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false
    const userRated = userLiked || userSaved || userDisliked

    if (userLiked && rating === USER_ARTWORK_EDGE_RELATIONSHIP.LIKE){
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
      userDispatch({
        type: UserETypes.removeUserLikedArtwork,
        artworkId: artOnDisplay._id,
      })
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userSaved && rating === USER_ARTWORK_EDGE_RELATIONSHIP.SAVE){
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
      userDispatch({
        type: UserETypes.removeUserSavedArtwork,
        artworkId: artOnDisplay._id,
      })
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userDisliked && rating === USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE){
      userDispatch({
        type: UserETypes.removeUserDislikedArtwork,
        artworkId: artOnDisplay._id,
      })
      await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
      return USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED
    } else if (userRated){
      if (userLiked){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
        userDispatch({
          type: UserETypes.removeUserLikedArtwork,
          artworkId: artOnDisplay._id,
        })
      } else if (userSaved){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
        userDispatch({
          type: UserETypes.removeUserSavedArtwork,
          artworkId: artOnDisplay._id,
        })
      } else if (userDisliked){
        await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
        userDispatch({
          type: UserETypes.removeUserDislikedArtwork,
          artworkId: artOnDisplay._id,
        })
      }
      return rating
    } else {
      return rating
    }
  }, [viewState.artworkRatingIndex, viewState.artworksToRate, userState?.userLikedArtwork, userState?.userDislikedArtwork, userState?.userSavedArtwork, /* other dependencies */]);


  const modifyDisplayRating = () => {
    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = userState?.userLikedArtwork;
    const dislikedArtworks = userState?.userDislikedArtwork;
    const savedArtworks = userState?.userSavedArtwork;
    
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
    if (viewState.artworksToRate && viewState.artworksToRate[0]){
      setArtOnDisplay(viewState.artworksToRate[0])
    }
    fadeAnimNav.addListener(() => {return})
    fadeAnimRating.addListener(() => {return})
    fadeAnimOptions.addListener(() => {return})

    wiggleAnim.addListener(() => {return})
    thumbsUpAnim.addListener(() => {return})
    thumbsDownAnim.addListener(() => {return})
  }, [])

  
  const handleSavePress = async () => {
    // Start the first part of the wiggle animation
    Animated.timing(wiggleAnim, {
      toValue: 1,  // Rotate slightly right
      duration: 50,
      useNativeDriver: true,
    }).start(async () => {
      // Network call in the middle of the wiggle

      navigation.navigate(RecommenderRoutesEnum.recommenderLists, {artwork: artOnDisplay})

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
          // await toggleArtForward()
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
      <View style={SSDartaGalleryViewDynamic.container}>
        <View
          style={[
            backgroundContainerDimensionsPixels,
            SSDartaGalleryViewDynamic.artOnDisplayContainer,
          ]}>
          <ArtOnWall
            artImage={artOnDisplay?.artworkImage?.value!}
            backgroundImageDimensionsPixels={
              backgroundContainerDimensionsPixels
            }
            artOnDisplay={artOnDisplay!}
            currentZoomScale={currentZoomScale}
            artworkDimensions={artOnDisplay?.artworkDimensions}
            isPortrait={state.isPortrait}
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
          <Surface key={"dislikeButton"} style={SSDartaGalleryView.dislikeContainer} elevation={2}>
            <TouchableOpacity onPress={handleThumbsDownPress} style={SSDartaGalleryView.touchableContainer}>
              <Animated.View style={{ transform: [{ translateY: thumbsDownAnim }] }}>
                {currentArtRating[RatingEnum.dislike] ?  <SVGs.ThumbsDownLargeFillIcon /> : <SVGs.ThumbsDownLargeIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          <Surface key={"saveButton"} style={SSDartaGalleryViewDynamic.saveContainer} elevation={2}>
            <TouchableOpacity onPress={handleSavePress}>
              <Animated.View style={{ transform: [{ rotate }] }}>
                {currentArtRating[RatingEnum.save]  ?  <SVGs.SavedActiveIconLarge /> : <SVGs.SavedInactiveIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          <Surface key={"likeButton"} style={SSDartaGalleryViewDynamic.likeContainer} elevation={2}>
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
