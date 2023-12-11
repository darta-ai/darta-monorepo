import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types'
import {TextElement} from '../Elements/_index';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import {ETypes, StoreContext} from '../../state/Store';
import FastImage from 'react-native-fast-image';
import { Surface } from 'react-native-paper';

const ArtworkCard = ({
  artwork,
  navigation,
  navigateTo,
  navigateToParams
}: {
  artwork: Artwork;
  navigation: any,
  navigateTo: string,
  navigateToParams: string
}) => {
  const {dispatch} = useContext(StoreContext);

  const navigateToTombstone = () => {
    dispatch({
      type: ETypes.setTombstoneHeader,
      currentArtworkHeader: artwork?.artworkTitle?.value ?? "",
    });
    navigation.navigate(navigateTo, {
      artOnDisplay: artwork,
      navigateToParams: navigateToParams
    });
  };

  // let inputHeight = artwork?.artworkDimensions?.heightIn?.value ?? "1"
  // let inputWidth = artwork?.artworkDimensions?.widthIn?.value ?? "1"

  // const height = parseInt(inputHeight)
  // const width = parseInt(inputWidth)

  // let artHeight = 0;
  // let artWidth = 0;
  // const maxDimension = Math.floor(wp('50%') * 0.85);
  // if (height && width && height >= width) {
  //   artHeight = maxDimension;
  //   artWidth = Math.floor((width / height) * artHeight);
  //   artWidth= artWidth > maxDimension ? maxDimension : 100
  // }
  // if (height && width && height < width) {
  //   artWidth = maxDimension;
  //   artHeight = Math.floor((height / width) * artWidth);
  // }


  const SSArtworkSelectorCard = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      width: 150,
      height: 240,

      marginBottom: 36,
    },
    imageContainer: {
      alignSelf: 'center',
      alignContent: 'center',
      height: "60%", 
      width: '100%', 
    },
    textContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'flex-start',
      marginTop: 12
    },
    image: {
      zIndex: 1,
      height: '100%',
      width: '100%',
      alignSelf: 'center',
      shadowColor: Colors.PRIMARY_600, // Shadow color should generally be black for realistic shadows
      shadowOffset: { width: 0, height: 1.61 }, // Adjust the height for the depth of the shadow
      shadowOpacity: 1,
      shadowRadius: 1.61, // A larger shadow
    },
    imageArtistText: {
      fontFamily: 'DMSans_700Bold',
      fontSize: 16,
      textAlign: 'left',
      lineHeight: 20,
      color: Colors.PRIMARY_900,
    },
    imageTitle: {
      fontFamily: 'DMSans_400Regular_Italic',
      fontSize: 16,
      textAlign: 'left',
      lineHeight: 20,
      color: Colors.PRIMARY_900,
    },
    imagePrice: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 16,
      textAlign: 'left',
      lineHeight: 20,
      color: Colors.PRIMARY_900,
    },
  });

  return (
    <View key={artwork?._id}>
      <View style={SSArtworkSelectorCard.container}>
        <View style={SSArtworkSelectorCard.imageContainer}>
          <TouchableOpacity onPress={() => navigateToTombstone()}>
            <Surface style={{backgroundColor: "transparent"}}>
                <FastImage
                  source={{
                    uri: artwork.artworkImage?.value ?? "",
                  }}
                  style={SSArtworkSelectorCard.image}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </Surface>
              </TouchableOpacity>
            </View>
        <View style={SSArtworkSelectorCard.textContainer}>
          <TextElement style={SSArtworkSelectorCard.imageArtistText}>
            {artwork?.artistName?.value?.trim()}
          </TextElement>
          <TextElement style={SSArtworkSelectorCard.imageTitle}>
            {artwork?.artworkTitle?.value?.trim()}
          </TextElement>
          <TextElement style={SSArtworkSelectorCard.imagePrice}>
            {artwork?.artworkCreatedYear?.value?.trim()}
          </TextElement>
        </View>
      </View>
    
    </View>
  );
}

// Check the docs for React.memo for an explanation of this function
export default React.memo(ArtworkCard, (prevProps, nextProps) => {
  /*
    This is an optional comparison function that you can provide to React.memo for custom comparison logic.
    If you omit this function, it will do a shallow comparison of props by default.
    If you need to compare deeply nested properties, you can do so here.
  */
  return (
    prevProps.artwork === nextProps.artwork &&
    prevProps.navigation === nextProps.navigation &&
    prevProps.navigateTo === nextProps.navigateTo &&
    prevProps.navigateToParams === nextProps.navigateToParams
  );
});