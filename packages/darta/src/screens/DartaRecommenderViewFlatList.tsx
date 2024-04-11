import React from 'react';
import {StyleSheet, Animated, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import * as Colors from '@darta-styles'
import * as Haptics from 'expo-haptics';
import { Snackbar, Surface } from 'react-native-paper';
import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import {
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
import { UserETypes, UserStoreContext } from '../state/UserStore';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { RecommenderRoutesEnum } from '../typing/routes';




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
    justifyContent: 'flex-start'
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
  footerContainer: {
    height: hp('70%'),
    width: wp('100%'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  }
});

export function DartaRecommenderViewFlatList({
  navigation,
}: {
  navigation: any;
}) {
  const {viewState, viewDispatch} = React.useContext(ViewStoreContext);
  const {userState, userDispatch} = React.useContext(UserStoreContext);

  const [backgroundContainerDimensionsPixels, setBackgroundImageDimensionsPixels] = React.useState(galleryDimensionsPortrait);
  
  const scrollViewRef = React.useRef<RecyclerListView<any, any>>(null);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);


  const [visibleError, setVisibleError] = React.useState(false);

  const onToggleSnackBarError = () => setVisibleError(!visibleError);

  const onDismissSnackBarError = () => setVisibleError(false);

  const [longestPainting, setLongestPainting] = React.useState<number>(0)

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const wiggleAnim = React.useRef(new Animated.Value(0)).current; 
  const thumbsUpAnim = React.useRef(new Animated.Value(1)).current; 
  const thumbsDownAnim = React.useRef(new Animated.Value(1)).current; 

  const [currentArtRating, setCurrentArtRating] = React.useState<IUserArtworkRated>({});

  React.useEffect(() => {
    wiggleAnim.addListener(() => {})
    thumbsUpAnim.addListener(() => {})
    thumbsDownAnim.addListener(() => {})
  }, [])

  wiggleAnim.removeAllListeners();
  thumbsUpAnim.removeAllListeners();
  thumbsDownAnim.removeAllListeners();

  const itemWidth = wp('100%'); // Assuming each item has a fixed height
  
  const handleScroll = (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => {
    const currentScrollPosition = rawEvent.nativeEvent.contentOffset.x;
    const visibleIndex = Math.round(currentScrollPosition / itemWidth);
  
    if (visibleIndex !== currentIndex) {
      setCurrentIndex(visibleIndex);
      modifyDisplayRating({ index: visibleIndex });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

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
    }
  }, [viewState.artworksToRate])

  React.useEffect(() => {
    modifyDisplayRating({})
  }, [userState?.userLikedArtwork, userState?.userDislikedArtwork, userState?.userSavedArtwork])

  const toggleArtForward = React.useCallback(async () => {
    const index = currentIndex ?? 0;

    if (viewState.artworksToRate && viewState.artworksToRate[index + 1]) {
        try {
            const artworkRatingIndex = index + 1;
            scrollViewRef.current?.scrollToIndex(artworkRatingIndex, true)
            setCurrentIndex(artworkRatingIndex)
        } catch (error) {
          scrollViewRef.current?.scrollToIndex(index + 2, true)
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

        } else {
            onToggleSnackBar();
        }
        } catch(error: any) {
          onToggleSnackBarError();
        }
    }
  }, [viewState.artworksToRate, currentIndex])


  const toggleArtBackwards = React.useCallback(async () => {
    const index = currentIndex ?? 0;

    if (index !== 0) {
      const artworkRatingIndex = index - 1;
      scrollViewRef.current?.scrollToIndex(artworkRatingIndex, true)
      setCurrentIndex(artworkRatingIndex)
    }
  }, [viewState.artworksToRate, currentIndex])

  const findArtworkIds = React.useCallback(({artworks} : {artworks : Artwork[]}) => {
    const artworkIds: string[] = []
    artworks.forEach(artwork => {
      artworkIds.push(artwork._id!)
    })
    return artworkIds
  }, [viewState.artworkRatingIndex, viewState.artworksToRate])

  const onEndReached = React.useCallback(async () => {
  
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
      // console.log('####', error)
    }
  }, [viewState.artworksToRate])


  const renderItem = React.useCallback(({ item }) => {
    if (!item) return null
    return (
    <View key={item._id} style={{flex: 1}}>
      <ArtOnWallMemo
        artImage={item?.artworkImage}
        artOnDisplay={item!}
        artworkDimensions={item?.artworkDimensions}
        navigation={navigation}
      />
    </View>
  )}, [backgroundContainerDimensionsPixels, viewState.artworksToRate, longestPainting])

  const handleArtworkRating = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    const currentIndexOfArtwork = currentIndex ?? 0;
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
  }

  const rateArtwork = async (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => {
    const currentIndexOfArtwork = currentIndex ?? 0;
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
            artworkData: artOnDisplay
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
        default: 
          break;
        }
    } catch(error){
      //TO-DO: update error handling
    }
  }

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
        ]).start(async () => {
          if(!currentArtRating[RatingEnum.like]) {
            await toggleArtForward()
          }
        })
      });
    });
  }

  const thumbsDownWiggle = React.useCallback(() => {
    // Configuration for moving up
    const moveUpConfig = {
      toValue: -5,
      duration: 50,
      useNativeDriver: true,
    };
  
    // Configuration for rotating slightly left
    const rotateLeftConfig = {
      toValue: 5,
      duration: 50,
      useNativeDriver: true,
    };
  
    // Configuration for returning to the original position
    const returnToOriginalConfig = {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    };
  
    // Start the initial move up animation
    Animated.timing(thumbsDownAnim, moveUpConfig).start(() => {
      // After moving up, start the sequence of rotating left and returning to original position
      Animated.sequence([
        Animated.timing(thumbsDownAnim, rotateLeftConfig),
        Animated.timing(thumbsDownAnim, returnToOriginalConfig),
      ]).start();
    });
  }, []);
  

const thumbsDownWiggleTiny = React.useCallback(() => {
  // Animation configurations
  const moveUpConfig = {
    toValue: -5,  // Move up (negative value for upward movement)
    duration: 50,
    useNativeDriver: true,
  };

  const rotateLeftConfig = {
    toValue: 0,  // Rotate slightly left
    duration: 50,
    useNativeDriver: true,
  };

  // Start the first animation
  Animated.timing(thumbsDownAnim, moveUpConfig).start(() => {  
    // Start the second animation after the first one completes
    Animated.timing(thumbsDownAnim, rotateLeftConfig).start();
  });
}, []);


const thumbsUpWiggle = React.useCallback(async () => {
  Animated.timing(thumbsUpAnim, {
    toValue: -5,  // Move up (negative value for upward movement)
    duration: 50,
    useNativeDriver: true,
  }).start(async () => {
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
    ]).start()
  })
}, [thumbsDownAnim, currentArtRating, toggleArtForward, handleArtworkRating])

const saveWiggle = React.useCallback(async () => {
  Animated.sequence([
    Animated.timing(wiggleAnim, {
      toValue: 1,  // Rotate slightly right
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(wiggleAnim, {
      toValue: 0,  // Return to original position
      duration: 50,
      useNativeDriver: true,
    }),
    ]).start(async () => {
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
  }, [wiggleAnim, currentArtRating, toggleArtForward, handleArtworkRating])

  const handleThumbsDownPress = React.useCallback(async () => {
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
        ]).start( async () => {
          await toggleArtForward()
        })
      });
    });
  }, [thumbsDownAnim, currentArtRating, toggleArtForward, handleArtworkRating])


  const handleSavePress = React.useCallback(async () => {
    // Start the first part of the wiggle animation
    Animated.timing(wiggleAnim, {
      toValue: 1,  // Rotate slightly right
      duration: 50,
      useNativeDriver: true,
    }).start(async () => {
      // Network call in the middle of the wiggle
      const currentIndexOfArtwork = currentIndex ?? 0;
      const artOnDisplay = viewState.artworksToRate?.[currentIndexOfArtwork]  

      navigation.navigate(RecommenderRoutesEnum.recommenderLists, {artwork: artOnDisplay})

      // await rateArtwork(await handleArtworkRating(USER_ARTWORK_EDGE_RELATIONSHIP.SAVE));
  
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
          // toggleArtForward()
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
  }, [wiggleAnim, currentArtRating, toggleArtForward, handleArtworkRating])

  const modifyDisplayRating = React.useCallback(({index} : {index?: number}) => {

    let currentIndexOfArtwork: number;

    if (index === 0){
      currentIndexOfArtwork = index
    } else if (!index){
      currentIndexOfArtwork = currentIndex ?? 0;
    } else {
      currentIndexOfArtwork = index
    }
    const artOnDisplay = viewState.artworksToRate?.[currentIndexOfArtwork]
  
    const artworkOnDisplayId = artOnDisplay?._id;
    const likedArtworks = userState?.userLikedArtwork;
    const dislikedArtworks = userState?.userDislikedArtwork;
    const savedArtworks = userState?.userSavedArtwork;
    
    const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
    const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
    const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false

     if (userSaved){
      saveWiggle()
      setCurrentArtRating({[RatingEnum.save]: true})
    } else if (userLiked){
      thumbsUpWiggle()
      setCurrentArtRating({[RatingEnum.like]: true})
    } else if (userDisliked){
      thumbsDownWiggle()
      setCurrentArtRating({[RatingEnum.dislike]: true})
    } else if (currentArtRating[RatingEnum.like]) {
      thumbsUpWiggle()
      setCurrentArtRating({})
    } else if (currentArtRating[RatingEnum.dislike]) {
      thumbsDownWiggleTiny()
      setCurrentArtRating({})
    }else if (currentArtRating[RatingEnum.save]) {
      saveWiggle()
      setCurrentArtRating({})
    } else{
      setCurrentArtRating({})
    }
  }, [viewState.artworksToRate, currentIndex, userState?.userLikedArtwork, userState?.userDislikedArtwork, userState?.userSavedArtwork])

  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-25deg', '25deg'],  // Small rotation range for wiggle
  });

  const layoutProvider = React.useMemo(() => {
    return new LayoutProvider(
      () => {
        return 'FULL_WIDTH'; // Assuming a single type of item
    },
    (type, dim) => {
        dim.width = wp('100%');
        dim.height = hp('80%')
    })
  }, []);

  const dataProvider = new DataProvider((r1, r2) => {
    return r1.id !== r2.id;
  }).cloneWithRows(Object.values(viewState?.artworksToRate!));

  const panGestureRight = Gesture.Pan()
  .activeOffsetX(wp('20%'))
  .onStart(() => {
    runOnJS(toggleArtBackwards)()
  });

const panGestureLeft = Gesture.Pan()
  .activeOffsetX(-wp('20%'))
  .onStart(() => {
    runOnJS(toggleArtForward)()
  });

  const composed = Gesture.Exclusive(
    panGestureRight,
    panGestureLeft,
  );


  return (
    <GestureHandlerRootView>
      <View style={SSDartaGalleryView.container}>
        <View
          style={[
            backgroundContainerDimensionsPixels,
            SSDartaGalleryView.artOnDisplayContainer,
          ]}>
            <Onboard />
            <GestureDetector gesture={composed}>
              <LinearGradient style={{flex: 1}} colors={[Colors.PRIMARY_50, Colors.PRIMARY_100, Colors.PRIMARY_200]}>
                <RecyclerListView
                    layoutProvider={layoutProvider}
                    dataProvider={dataProvider}
                    ref={scrollViewRef}
                    rowRenderer={(_, item) => renderItem({ item })}
                    onEndReached={onEndReached}
                    isHorizontal={true}
                    scrollThrottle={2}
                    snapToInterval={wp('100%')} 
                    snapToAlignment={"center"}
                    pagingEnabled={true}
                    zoomableViewProps={{
                      disabled: true,
                    }}
                    renderFooter={() => <View 
                    style={SSDartaGalleryView.footerContainer}>
                      <ActivityIndicator size="small" color={Colors.PRIMARY_600} />
                    </View>}
                    onScroll={handleScroll}
                    scrollViewProps={{
                        decelerationRate: "fast",
                        disableScrollViewPanResponder: true,
                        directionalLockEnabled: true,
                        snapToInterval: wp('100%'),
                        snapToAlignment: 'center',
                        scrollEnabled: false,
                        disableIntervalMomentum: true,
                        pagingEnabled: true,
                        onEndReachedThreshold: 0.5,
                        // Add any other ScrollView props here
                    }}
        
                  />
                  {/* <FlatList
                    data={Object.values(viewState?.artworksToRate!)}
                    ref={scrollViewRef}
                    horizontal={true}
                    renderItem={({ item }) => renderItem({ item })}
                    keyExtractor={(_, index) => `key-${index}`} // Adjust as needed
                    onEndReached={onEndReached}
                    onEndReachedThreshold={5} // This is a ratio, not a percentage like in RecyclerListView
                    decelerationRate={0.5}// For smooth scrolling, may adjust as needed
                    disableScrollViewPanResponder={true}
                    directionalLockEnabled={true}
                    snapToInterval={wp('100%')}
                    snapToAlignment="center"
                    disableIntervalMomentum={ true }
                    pagingEnabled={true}
                    onScroll={handleScroll} // Adjust if needed for your specific use case
                    /> */}
              </LinearGradient>
            </GestureDetector>
        </View>
      </View>
          <Surface key={`disLikeButton`} style={SSDartaGalleryView.dislikeContainer} elevation={2}>
            <TouchableOpacity 
              onPress={handleThumbsDownPress} 
              style={SSDartaGalleryView.touchableContainer}>
              <Animated.View 
              style={{ transform: [{ translateY: thumbsDownAnim }], opacity: 1 }}
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
              style={{ transform: [{ rotate }], opacity: 1 }}
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
              style={{ transform: [{ translateY: thumbsUpAnim }], opacity: 1 }}
              >
                {currentArtRating[RatingEnum.like]  ?  <SVGs.ThumbsDownLargeFillIcon /> : <SVGs.ThumbsDownLargeIcon />}
              </Animated.View>
            </TouchableOpacity>
          </Surface>
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