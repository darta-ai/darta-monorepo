import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types'
import {TextElement} from '../Elements/_index';
import FastImage from 'react-native-fast-image';
import { Surface } from 'react-native-paper';
import { UIStoreContext, UiETypes } from '../../state';
import { heightPercentageToDP } from 'react-native-responsive-screen';

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
  loadingImageContainer: {
    height: '100%', // Adjust the height as needed
    width: '100%',  // Adjust the width as needed
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  imageContainer: {
    alignSelf: 'center',
    height: "60%", 
    width: '100%', 
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
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
    // position: "relative",
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
  const {uiDispatch} = React.useContext(UIStoreContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigateToTombstone = () => {
    uiDispatch({
      type: UiETypes.setTombstoneHeader,
      currentArtworkHeader: artwork?.artworkTitle?.value ?? "",
    });
    navigation.navigate(navigateTo, {
      artOnDisplay: artwork,
      navigateToParams: navigateToParams
    });
  };

  return (
    <View key={artwork?._id}>
      <View style={SSArtworkSelectorCard.container}>
        <View style={SSArtworkSelectorCard.imageContainer}>
          <TouchableOpacity onPress={() => navigateToTombstone()}>
            <Surface style={{backgroundColor: "transparent"}}>
              <View style={SSArtworkSelectorCard.loadingImageContainer}>
                <FastImage
                  source={{
                    uri: artwork.artworkImage?.value ?? "",
                  }}
                  style={SSArtworkSelectorCard.image}
                  resizeMode={FastImage.resizeMode.contain}
                  onLoadStart={() => setIsLoading(true)}
                  onLoadEnd={() => setIsLoading(false)}
                />
                  <View style={{height: heightPercentageToDP('5%')}}>
                    {isLoading && (
                      <ActivityIndicator size="small"/> 
                    )}
                  </View>
                </View>
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