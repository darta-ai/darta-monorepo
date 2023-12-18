import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions
} from 'react-native';
import FastImage from 'react-native-fast-image'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types'
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import { Surface } from 'react-native-paper';
import * as Colors from '@darta-styles'
import {runOnJS} from 'react-native-reanimated';
import { RecommenderRoutesEnum } from '../../typing/routes';
import {
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../../utils/constants';
import { UIStoreContext, StoreContext, UiETypes } from '../../state';
import { Gesture } from 'react-native-gesture-handler';



export function ArtOnWallFlatList({
  artworkDimensions,
  artOnDisplay,
  artImage,
  wallHeight = 96,
  navigation,
  toggleArtForward,
  toggleArtBackward,
  longestPainting,
}: {
  artOnDisplay: Artwork;
  artImage: string | undefined;
  artworkDimensions: Artwork['artworkDimensions'] | undefined;
  wallHeight?: number;
  navigation: any
  toggleArtForward: () => void
  toggleArtBackward: () => void,
  longestPainting: number
}) {
  const {state} = useContext(StoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);

  const [backgroundContainerDimensionsPixels, setBackgroundContainerDimensionsPixels] = useState(galleryDimensionsPortrait) 


  React.useEffect(() => {
    if (state.isPortrait) {
      setBackgroundContainerDimensionsPixels(galleryDimensionsPortrait);
    } else {
      setBackgroundContainerDimensionsPixels(galleryDimensionsLandscape);
    }
  }, [state.isPortrait])

  interface ArtDimensions {
    artImageSize: { height: number; width: number; } | null;
    artImageLocation: { top: number; left: number; } | null;
    artHeightPixels: number;
    artWidthPixels: number;
  }

  const [artDimensions, setArtDimensions] = React.useState<ArtDimensions>({
    artImageSize: null,
    artImageLocation: null,
    artHeightPixels: 0,
    artWidthPixels: 0,
  });

  const toggleArtTombstone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    uiDispatch({
      type: UiETypes.setTombstoneHeader,
      currentArtworkHeader: artOnDisplay?.artworkTitle?.value!,
    });
    if (artOnDisplay){
      navigation.navigate(RecommenderRoutesEnum.TopTabExhibition, {artOnDisplay, galleryId: artOnDisplay?.galleryId, exhibitionId: artOnDisplay?.exhibitionId});
    }
  };


  const getDimensions = React.useCallback(() => {
    const dimensionsMultiplierPortrait =
      backgroundContainerDimensionsPixels.width /
      backgroundContainerDimensionsPixels.height;

    const backgroundWidthInches = wallHeight * dimensionsMultiplierPortrait;

    let artHeightInches, artWidthInches, artImageSize, artImageLocation, artHeightPixels, artWidthPixels;

    if (artworkDimensions && artworkDimensions.heightIn.value && artworkDimensions.widthIn.value) {
      artHeightInches = parseInt(artworkDimensions.heightIn.value);
      artWidthInches = parseInt(artworkDimensions.widthIn.value);

      const pixelsPerInchHeight =
        backgroundContainerDimensionsPixels.height / wallHeight;
      const pixelsPerInchWidth =
        backgroundContainerDimensionsPixels.width / backgroundWidthInches;

      artHeightPixels = artHeightInches * pixelsPerInchHeight;
      artWidthPixels = artWidthInches * pixelsPerInchWidth;

      // need to adjust proportions if the art is too big for the screen

      if (artWidthPixels > backgroundContainerDimensionsPixels.width) {
        artWidthPixels = backgroundContainerDimensionsPixels.width;
        artHeightPixels = artHeightPixels * (artWidthPixels / artWidthInches);
      } else if (artHeightPixels > backgroundContainerDimensionsPixels.height) {
        artHeightPixels = backgroundContainerDimensionsPixels.height;
        artWidthPixels = artWidthPixels * (artHeightPixels / artHeightInches);
      }

      artImageSize = {
        height: artHeightPixels,
        width: artWidthPixels,
      };

      artImageLocation = {
        top: 0.45 * backgroundContainerDimensionsPixels.height - 0.5 * artHeightPixels,
        left: 0.5 * backgroundContainerDimensionsPixels.width - 0.5 * artWidthPixels,
      };
    }

    return { artImageSize, artImageLocation, artHeightPixels, artWidthPixels };

  }, [artworkDimensions, backgroundContainerDimensionsPixels, wallHeight]);

  React.useEffect(() => {
    
    const { artImageSize, artImageLocation, artHeightPixels, artWidthPixels } = getDimensions();
    setArtDimensions({ artImageSize, artImageLocation, artHeightPixels, artWidthPixels });

    const setSaw = async () => {
      try{
        if (artOnDisplay?._id) {
          createArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.VIEWED})
        }
      } catch(err: any){
      }
    }
    setSaw()
  }, [artOnDisplay]);

  React.useEffect(() => {
    const { artImageSize, artImageLocation, artHeightPixels, artWidthPixels } = getDimensions();
    setArtDimensions({ artImageSize, artImageLocation, artHeightPixels, artWidthPixels });
  }, [state.isPortrait])

  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;

  const galleryStylesPortraitDynamic = StyleSheet.create({
    artContainer: {
      // top: artDimensions.artImageLocation?.top,
      // left: artDimensions.artImageLocation?.left,
      // height: artDimensions.artImageSize?.height,
      // width: artDimensions.artImageSize?.width,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      height: hp('70%'),
      width: wp('100%'),
    },
    artwork: {
      height: artDimensions.artImageSize?.height,
      width: artDimensions.artImageSize?.width,
      // height: '100%',
      // width: artDimensions.artImageSize?.width,
      resizeMode: 'contain',
      shadowColor: Colors.PRIMARY_300, // Shadow color should generally be black for realistic shadows
      shadowOffset: { width: 0, height: 4.29 }, // Adjust the height for the depth of the shadow
      shadowOpacity: 1,
      shadowRadius: 4.29, // A larger shadow
    },
    screenContainer: {
      // width: longestPainting,
      height: '100%',
    },
    container: {
      backgroundColor: Colors.PRIMARY_50,
      justifyContent: 'flex-start',
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
      borderRadius: 50, 
      width: 72, 
      height: 72, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
  });


  const doubleTapGesture = Gesture.Tap()
  .numberOfTaps(2)
  .maxDistance(9)
  .onEnd((_, success) => {
    'worklet';

    if (success) {
      // runOnJS(handleDoubleTap)();
    }
    return success;
  });


  return (
      <View style={galleryStylesPortraitDynamic.artContainer}>
        {/* <View style={galleryStylesPortrait.frameStyle}> */}
          {artImage && (
          <Pressable onPress={toggleArtTombstone}>
            <Surface style={{backgroundColor:"transparent"}}>
                  <FastImage
                    source={{uri: artImage, priority: FastImage.priority.normal}}
                    style={galleryStylesPortraitDynamic.artwork}
                    resizeMode={FastImage.resizeMode.contain}
                  />
              </Surface>
            </Pressable>
          )} 
    </View>
  );
}


export const ArtOnWallMemo =  React.memo(ArtOnWallFlatList, (prevProps, nextProps) => {
  /*
    This is an optional comparison function that you can provide to React.memo for custom comparison logic.
    If you omit this function, it will do a shallow comparison of props by default.
    If you need to compare deeply nested properties, you can do so here.
  */
  return (
    prevProps.artOnDisplay === nextProps.artOnDisplay &&
    prevProps.artImage === nextProps.artImage &&
    prevProps.artworkDimensions === nextProps.artworkDimensions &&
    prevProps.wallHeight === nextProps.wallHeight &&
    prevProps.navigation === nextProps.navigation 
  );
});