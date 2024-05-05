import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
// import FastImage from 'react-native-fast-image'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';

import {Artwork, Images, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types'
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import { Surface } from 'react-native-paper';
import * as Colors from '@darta-styles'
import { RecommenderRoutesEnum } from '../../typing/routes';
import {
  galleryDimensionsPortrait,
} from '../../utils/constants';
import { UIStoreContext, UiETypes } from '../../state';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import { DartaImageComponent } from '../Images/DartaImageComponent';

interface ArtDimensions {
  artImageSize: { height: number; width: number; } | null;
  artImageLocation: { top: number; left: number; } | null;
  artHeightPixels: number;
  artWidthPixels: number;
}

export function ArtOnWallFlatList({
  artworkDimensions,
  artOnDisplay,
  artImage,
  wallHeight = 84,
  navigation,
} : {
  artOnDisplay: Artwork;
  artImage: Images;
  artworkDimensions: Artwork['artworkDimensions'] | undefined;
  wallHeight?: number;
  navigation: any,
}) {

  const {uiDispatch} = React.useContext(UIStoreContext);

  const [backgroundContainerDimensionsPixels] = React.useState(galleryDimensionsPortrait) 

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
      navigation.navigate(RecommenderRoutesEnum.TopTabExhibition, {
        artOnDisplay, 
        galleryId: artOnDisplay?.galleryId, 
        exhibitionId: artOnDisplay?.exhibitionId,
        artworkTitle: artOnDisplay?.artworkTitle?.value!
      });
    }
  };


  const getDimensions = React.useCallback(() => {
    let artHeightInches: number = 0;
    let artWidthInches: number = 0;
    let artHeightPixels: number = 0
    let artWidthPixels: number = 0; 
    let artImageSize: {
      height: number;
      width: number;
    } | null = null;
    let artImageLocation: {
      top: number;
      left: number;
    } | null = null;


    if (artworkDimensions && artworkDimensions.heightIn.value && artworkDimensions.widthIn.value) {
      artHeightInches = parseInt(artworkDimensions.heightIn.value);
      artWidthInches = parseInt(artworkDimensions.widthIn.value);

      // now that we have the height and width, we will set the art dimensions by the relative height or width

      if (artHeightInches > artWidthInches) {
        // make the painting relative to the background height
        artHeightPixels = backgroundContainerDimensionsPixels.height * 0.65;
        // make the width relative to the height
        artWidthPixels = artHeightPixels  * (artWidthInches / artHeightInches)
      } else {
        artWidthPixels = backgroundContainerDimensionsPixels.width * 0.8;
        artHeightPixels = artWidthPixels * ( artHeightInches / artWidthInches);
        // artHeightPixels = artHeightInches * artWidthPixels;
      }

      // const pixelsPerInchHeight = backgroundContainerDimensionsPixels.height / wallHeight;
      // const pixelsPerInchWidth = backgroundContainerDimensionsPixels.width / backgroundWidthInches;

      // artHeightPixels = artHeightInches * pixelsPerInchHeight;
      // artWidthPixels = artWidthInches * pixelsPerInchWidth;

      // need to adjust proportions if the art is too big for the screen

      // if (artWidthPixels > backgroundContainerDimensionsPixels.width) {
      //   artWidthPixels = backgroundContainerDimensionsPixels.width;
      //   artHeightPixels = artHeightPixels * (artWidthPixels / artWidthInches);
      // } else if (artHeightPixels > backgroundContainerDimensionsPixels.height) {
      //   artHeightPixels = backgroundContainerDimensionsPixels.height;
      //   artWidthPixels = artWidthPixels * (artHeightPixels / artHeightInches);
      // }

      artImageSize = {
        height: artHeightPixels,
        width: artWidthPixels,
      };

      artImageLocation = {
        top: 0.45 * backgroundContainerDimensionsPixels.height - (0.5 * artHeightPixels),
        left: 0.5 * backgroundContainerDimensionsPixels.width - (0.5 * artWidthPixels),
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

  const galleryStylesPortraitDynamic = StyleSheet.create({
    artContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      height: hp('70%'),
      width: wp('100%'),
    },
    artwork: {
      height: artDimensions.artHeightPixels,
      width: artDimensions.artWidthPixels,
      // shadowColor: Colors.PRIMARY_300, // Shadow color should generally be black for realistic shadows
      // shadowOffset: { width: 0, height: 4.29 }, // Adjust the height for the depth of the shadow
      // shadowOpacity: 1,
      // shadowRadius: 4.29, // A larger shadow
      elevation: 4,
    },
    surfaceStyles: {
      height: artDimensions.artHeightPixels * 1.05,
      backgroundColor: Colors.PRIMARY_50,
      width: artDimensions.artWidthPixels * 1.05,
    },
    card: {
      height: artDimensions.artHeightPixels * 1.1, // Adjust the factor as needed
      width: artDimensions.artWidthPixels * 1.1, // Adjust the factor as needed
      backgroundColor: Colors.PRIMARY_100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const longPressGesture = Gesture.LongPress()
  .onStart((event) => {
    if (event.numberOfPointers === 1) {
      runOnJS(toggleArtTombstone)();
    }
  });

  return (
      <View style={galleryStylesPortraitDynamic.artContainer}>
          {artImage && (
          <GestureDetector gesture={longPressGesture}>
            <Surface elevation={2} mode={"elevated"} style={galleryStylesPortraitDynamic.card}>
                <DartaImageComponent
                  uri={artImage}
                  priority={"high"}
                  style={galleryStylesPortraitDynamic.artwork}
                  size={"mediumImage"}
                />
              </Surface>
            </GestureDetector>
          )} 
    </View>
  );
}


export const ArtOnWallMemo =  React.memo(ArtOnWallFlatList, (prevProps, nextProps) => {
  return (
    prevProps.artOnDisplay === nextProps.artOnDisplay &&
    prevProps.artImage === nextProps.artImage &&
    prevProps.artworkDimensions === nextProps.artworkDimensions &&
    prevProps.wallHeight === nextProps.wallHeight &&
    prevProps.navigation === nextProps.navigation 
  );
});