import React from 'react';
import {FlatList, StyleSheet, Animated, TouchableOpacity, View, ScrollViewComponent } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Colors from '@darta-styles'
import * as Haptics from 'expo-haptics';
import { Snackbar, Surface } from 'react-native-paper';
import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import {
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../utils/constants';
import {ViewETypes, ViewStoreContext, StoreContext } from '../state';
import { createArtworkRelationshipAPI, deleteArtworkRelationshipAPI, listArtworksToRateStatelessRandomSamplingAPI } from '../utils/apiCalls';
import { TextElement } from '../components/Elements/TextElement';
import { ArtOnWallMemo} from '../components/Artwork/ArtOnWallFlatlist';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import {runOnJS} from 'react-native-reanimated';
import { Onboard } from '../components/Darta/Onboard';
import analytics from '@react-native-firebase/analytics';
import { IUserArtworkRated, RatingEnum } from '../typing/types';
import * as SVGs from '../assets/SVGs';
import { RecommenderRoutesEnum } from '../typing/routes';
import { UserETypes, UserStoreContext } from '../state/UserStore';
import { RecyclerListView, DataProvider, LayoutProvider, RecyclerListViewProps } from 'recyclerlistview';




export const SSDartaGalleryView = StyleSheet.create({
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
  container: {
    backgroundColor: Colors.PRIMARY_50,
    alignSelf: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  artOnDisplayContainer: {
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
    transform: [{rotate: '180deg'}],
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
});

function DartaRecommenderViewFlatList({
  navigation,
}: {
  navigation: any;
}) {
  const {state} = React.useContext(StoreContext);
  const {viewState, viewDispatch} = React.useContext(ViewStoreContext);
  const {userState, userDispatch} = React.useContext(UserStoreContext);
  const [isPanActionEnabled, setIsPanActionEnabled] = React.useState(false);

  const [backgroundContainerDimensionsPixels, setBackgroundImageDimensionsPixels] = React.useState(galleryDimensionsPortrait);
  
  const scrollViewRef = React.useRef<RecyclerListView<RecyclerListViewProps, any>>(null);

  React.useEffect(() => {
    if (state.isPortrait) {
      setBackgroundImageDimensionsPixels(galleryDimensionsPortrait);
    } else {
      setBackgroundImageDimensionsPixels(galleryDimensionsLandscape);
    }
  }, [state.isPortrait])

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);


  const [visibleError, setVisibleError] = React.useState(false);

  const onToggleSnackBarError = () => setVisibleError(!visibleError);

  const onDismissSnackBarError = () => setVisibleError(false);



  const [wallHeight, setWallHeight] = React.useState<number>(96)
  const [longestPainting, setLongestPainting] = React.useState<number>(0)

  const findTallestArtwork = React.useCallback((artworks: Artwork[]) => {   
    let tallestArtworkLength = 0
    artworks.forEach(artwork => {
      if (Number(artwork.artworkDimensions?.heightIn.value!) > tallestArtworkLength!){
        tallestArtworkLength = Number(artwork.artworkDimensions?.heightIn.value!)
      }
    })
    return Math.max(tallestArtworkLength, 96)
    // return largestArtWidthPixels
  }, [])


  const findLongestArtwork = React.useCallback((artworks: Artwork[]) => {
    const backgroundWidthInches = 96 * (backgroundContainerDimensionsPixels.width / backgroundContainerDimensionsPixels.height);
    const pixelsPerInchWidth = backgroundContainerDimensionsPixels.width / backgroundWidthInches;
   
    let longestArtworkLength = 0
    artworks.forEach(artwork => {
      if (Number(artwork.artworkDimensions?.widthIn.value!) > longestArtworkLength!){
        longestArtworkLength = Number(artwork.artworkDimensions?.widthIn.value!)
      }
    })
    const largestArtWidthPixels = longestArtworkLength * pixelsPerInchWidth;
    return Math.max(largestArtWidthPixels, wp('100%'))
  }, [backgroundContainerDimensionsPixels.width, backgroundContainerDimensionsPixels.height]);

  React.useEffect(() => {
    if (viewState.artworksToRate && Object.values(viewState.artworksToRate).length > 0) {
      setLongestPainting(findLongestArtwork(Object.values(viewState.artworksToRate)))
      setWallHeight(findTallestArtwork(Object.values(viewState.artworksToRate)))
    }
  }, [viewState.artworksToRate])

  const toggleArtForward = React.useCallback(async () => {
    const currentIndex = viewState.artworkRatingIndex ?? 0;
    console.log({viewState})

    if (viewState.artworksToRate && viewState.artworksToRate[currentIndex + 1]) {
        try {
            const artworkRatingIndex = currentIndex + 1;
            scrollViewRef.current?.scrollToIndex(artworkRatingIndex, true)
            viewDispatch({
                type: ViewETypes.setRatingIndex,
                artworkRatingIndex,
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        } catch (error) {
          viewDispatch({
                type: ViewETypes.setRatingIndex,
                artworkRatingIndex: currentIndex + 2,
            });
            scrollViewRef.current?.scrollToIndex(currentIndex + 1, true)
            Haptics.NotificationFeedbackType.Error
        }
    } else if (viewState.artworksToRate) {
        const numberOfArtworks = Object.values(viewState.artworksToRate).length;
        const artworkIds = findArtworkIds({artworks: Object.values(viewState.artworksToRate)})
        try{
          const artworksToRate = await listArtworksToRateStatelessRandomSamplingAPI({
            startNumber: numberOfArtworks,
            endNumber: numberOfArtworks + 10,
            artworkIds
        });
        if (artworksToRate && Object.keys(artworksToRate).length > 0) {
            viewDispatch({
                type: ViewETypes.setArtworksToRate,
                artworksToRate,
            });
            viewDispatch({
                type: ViewETypes.setRatingIndex,
                artworkRatingIndex: currentIndex + 1,
            });
        } else {
            onToggleSnackBar();
        }
        } catch(error: any) {
          onToggleSnackBarError();
        }
    }
  }, [viewState.artworkRatingIndex, viewState.artworksToRate])


  const toggleArtBackward = React.useCallback(async () => {
    const currentIndex = viewState.artworkRatingIndex ?? 0;
    if (!currentIndex) {
      return 
    } else if (viewState.artworksToRate && viewState.artworksToRate[currentIndex - 1]) {
        try{ 
          viewDispatch({
          type: ViewETypes.setRatingIndex,
          artworkRatingIndex: currentIndex - 1,
        });
        scrollViewRef.current?.scrollToIndex(currentIndex - 1, true)
      } catch(error){
        if (viewState.artworksToRate && viewState.artworksToRate[currentIndex - 2]){
          viewDispatch({
            type: ViewETypes.setRatingIndex,
            artworkRatingIndex: currentIndex - 2,
          });
          scrollViewRef.current?.scrollToIndex(currentIndex - 2, true)
        } else {
          onToggleSnackBar()
        }
      }
    } else {
      viewDispatch({
        type: ViewETypes.setRatingIndex,
        artworkRatingIndex: currentIndex - 1,
      });
      scrollViewRef.current?.scrollToIndex(currentIndex - 1, true)
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  }, [viewState.artworkRatingIndex, viewState.artworksToRate]);

  const findArtworkIds = React.useCallback(({artworks} : {artworks : Artwork[]}) => {
    const artworkIds: string[] = []
    artworks.forEach(artwork => {
      artworkIds.push(artwork._id!)
    })
    return artworkIds
  }, [viewState.artworkRatingIndex, viewState.artworksToRate])

  const onEndReached = async () => {
    const numberOfArtworks = Object.values(viewState?.artworksToRate ?? {}).length > 0 ? Object.values(viewState.artworksToRate!).length : 0
    const artworkIds = findArtworkIds({artworks: Object.values(viewState.artworksToRate ?? {})})
        try{
          const artworksToRate = await listArtworksToRateStatelessRandomSamplingAPI({
            startNumber: numberOfArtworks,
            endNumber: numberOfArtworks + 10,
            artworkIds
        });
        if (artworksToRate) {
            viewDispatch({
                type: ViewETypes.setArtworksToRate,
                artworksToRate,
            });
      }
    } catch (error){
      console.log(error)
    }
  }

  const onPanResponderEnd = (event, gestureState, zoomableViewEventObject)  => {

    try{
      const offsetX = gestureState.dx;
      const threshold = wp('40%');
      if (offsetX > threshold) {
        toggleArtBackward();
      } else if (offsetX < -threshold) {
        toggleArtForward();
      }
  
    } catch(error){
      console.log(error)
    }
  }

  const renderItem = React.useCallback(({ item }) => {
  return (
    <View key={item._id} style={{flex: 1}}>
      <ArtOnWallMemo
        artImage={item?.artworkImage?.value!}
        artOnDisplay={item!}
        artworkDimensions={item?.artworkDimensions}
        navigation={navigation}
        wallHeight={wallHeight}
        onPanResponderEnd={onPanResponderEnd}
        toggleArtForward={toggleArtForward}
        toggleArtBackward={toggleArtBackward}
      />
    </View>
  )}, [backgroundContainerDimensionsPixels, viewState.artworksToRate, wallHeight])


  const handleToggleArtBackwards = () => {
    toggleArtBackward();
  }

  const panGestureRight = Gesture.Pan()
    .activeOffsetX(wp('20%'))
    .onStart(() => {
      console.log('triggered pan gesture right')
      if (!isPanActionEnabled) {
        return;
      }
      state.isPortrait && runOnJS(handleToggleArtBackwards)()
        // : runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeUp);
    });

  const panGestureLeft = Gesture.Pan()
    .activeOffsetX(-wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }

      state.isPortrait && runOnJS(toggleArtForward)()
        // : runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeDown);
    });

  const panGestureUp = Gesture.Pan()
    .activeOffsetY(wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }

      if (!state.isPortrait){
        runOnJS(handleToggleArtBackwards)();
      } else {
        return
      }
    });

  const panGestureDown = Gesture.Pan()
    .activeOffsetY(-wp('20%'))
    .onStart(async () => {
      if (!isPanActionEnabled) {
        return;
      }

      if (!state.isPortrait){
        runOnJS(toggleArtForward)();
      } else {
        return
      }
    });


  const layoutProvider = new LayoutProvider(
    index => {
      return 1; // Assuming all items are of the same type
    },
    (type, dim) => {
      dim.width = wp('100%');
      dim.height = hp('100%');
    }
  );
  

  console.log('re-rendered')

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

  const handleThumbsUpPress = async () => {
    // Start the rising animation
    console.log('triggered thumbs up press')
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

  const wiggleAnim = React.useRef(new Animated.Value(0)).current; 
  const thumbsUpAnim = React.useRef(new Animated.Value(1)).current; 
  const thumbsDownAnim = React.useRef(new Animated.Value(1)).current; 
  const [currentArtRating, setCurrentArtRating] = React.useState<IUserArtworkRated>({});
  const fadeAnimNav = React.useRef(new Animated.Value(0)).current;
  const fadeAnimRating = React.useRef(new Animated.Value(0)).current;
  const fadeAnimOptions = React.useRef(new Animated.Value(0)).current;


  React.useEffect(() => {
    fadeAnimNav.addListener(() => {})
    fadeAnimRating.addListener(() => {})
    fadeAnimOptions.addListener(() => {})

    wiggleAnim.addListener(() => {})
    thumbsUpAnim.addListener(() => {})
    thumbsDownAnim.addListener(() => {})
  }, [])

  const rateArtwork = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    const currentIndexOfArtwork = viewState.artworkRatingIndex ?? 0;
    const artOnDisplay = viewState.artworksToRate?.[currentIndexOfArtwork]

    if (!rating || !artOnDisplay) {
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
          analytics().logEvent('save_artwork')
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          break;
        case (USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE):
          userDispatch({
            type: UserETypes.setUserInquiredArtwork,
            artworkId: artOnDisplay?._id!,
          })
          analytics().logEvent('inquire_artwork')
          break;
        }
    } catch(error){
      //TO-DO: update error handling
    }
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


  const handleSavePress = async () => {
    // Start the first part of the wiggle animation
    Animated.timing(wiggleAnim, {
      toValue: 1,  // Rotate slightly right
      duration: 50,
      useNativeDriver: true,
    }).start(async () => {
      // Network call in the middle of the wiggle
      const currentIndexOfArtwork = viewState.artworkRatingIndex ?? 0;
      const artOnDisplay = viewState.artworksToRate?.[currentIndexOfArtwork]  

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


  React.useEffect(() => {
    modifyDisplayRating()
  }, [userState.userLikedArtwork, userState.userDislikedArtwork, userState.userSavedArtwork])


  const modifyDisplayRating = React.useCallback(() => {
    const currentIndexOfArtwork = viewState.artworkRatingIndex ?? 0;
    const artOnDisplay = viewState.artworksToRate?.[currentIndexOfArtwork]  
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
  }, [userState.userLikedArtwork, userState.userDislikedArtwork, userState.userSavedArtwork, viewState.artworkRatingIndex, viewState.artworksToRate])



  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-25deg', '25deg'],  // Small rotation range for wiggle
  });


  const dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(Object.values(viewState?.artworksToRate!));
  


  return (
    <GestureHandlerRootView>
      <View style={{...SSDartaGalleryView.container, justifyContent: state.isPortrait ? 'flex-start': 'center'}}>
        <View
          style={[
            backgroundContainerDimensionsPixels,
            SSDartaGalleryView.artOnDisplayContainer,
            {transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}]}
          ]}>
            <Onboard />
            <LinearGradient style={{flex: 1}} colors={[Colors.PRIMARY_50, Colors.PRIMARY_100, Colors.PRIMARY_200]}>
              <RecyclerListView
                  layoutProvider={layoutProvider}
                  dataProvider={dataProvider}
                  ref={scrollViewRef}
                  style={{flex: 1}}
                  rowRenderer={(_, item) => renderItem({ item })}
                  onEndReached={onEndReached}
                  onEndReachedThreshold={0.5}
                  isHorizontal
                  scrollViewProps={{
                    ScrollViewComponent: FlatList,
                    scrollEnabled: false
                  }}
                  renderAheadOffset={longestPainting * 3}
                />
              </LinearGradient>
        </View>
      </View>
      {state.isPortrait && (
            <>
          <Surface key={`disLikeButton`} style={SSDartaGalleryView.dislikeContainer} elevation={2}>
            <TouchableOpacity 
              onPress={handleThumbsDownPress} 
              style={SSDartaGalleryView.touchableContainer}>
              <Animated.View 
              style={{ transform: [{ translateY: thumbsDownAnim }] }}
              >
                {currentArtRating[RatingEnum.dislike] ?  <SVGs.ThumbsDownLargeFillIcon /> : <SVGs.ThumbsDownLargeIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          <Surface key={`saveButton`} style={SSDartaGalleryView.saveContainer} elevation={2}>
            <TouchableOpacity 
            onPress={handleSavePress}
            >
              <Animated.View 
              style={{ transform: [{ rotate }] }}
              >
                {currentArtRating[RatingEnum.save]  ?  <SVGs.SavedActiveIconLarge /> : <SVGs.SavedInactiveIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          <Surface key={`likeButton`} style={SSDartaGalleryView.likeContainer} elevation={2}>
            <TouchableOpacity 
            onPress={handleThumbsUpPress} 
            style={SSDartaGalleryView.touchableContainer}
            >
              <Animated.View 
              style={{ transform: [{ translateY: thumbsUpAnim }] }}
              >
                {currentArtRating[RatingEnum.like]  ?  <SVGs.ThumbsDownLargeFillIcon /> : <SVGs.ThumbsDownLargeIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
          </>
          )}
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


export const DartaRecommenderViewMemo = React.memo(DartaRecommenderViewFlatList);