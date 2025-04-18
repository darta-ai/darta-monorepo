import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types'
import {TextElement} from '../Elements/_index';
// import FastImage from 'react-native-fast-image';
import { Surface } from 'react-native-paper';
import { DartaImageComponent } from '../Images/DartaImageComponent';
import { DartaCheckListImage } from '../Images/DartaCheckListImage';
import { Image } from 'expo-image';

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
    elevation: 3, // This is for Android
    
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
  activityIndicator: {
    position: 'absolute',
  },
});

const ArtworkCard = ({
  artwork,
  navigateToTombstone,
}: {
  artwork: Artwork;
  navigateToTombstone: (artwork: Artwork) => void
}) => {

  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View key={artwork?._id}>
      <View style={SSArtworkSelectorCard.container}>
        <View style={SSArtworkSelectorCard.imageContainer}>
              <TouchableOpacity style={SSArtworkSelectorCard.loadingImageContainer} onPress={() => navigateToTombstone(artwork)}>
                <Image
                  source={artwork.artworkImage?.smallImage?.value ?? artwork.artworkImage?.value}
                  priority={"normal"}
                  style={SSArtworkSelectorCard.image}
                  contentFit={"contain"}
                  onLoadStart={handleLoadStart}
                  onLoadEnd={handleLoadEnd}
                />
                {isLoading && (
                  <ActivityIndicator
                    style={SSArtworkSelectorCard.activityIndicator}
                    size="small"
                    color={Colors.PRIMARY_950}
                  />
                )}
                </TouchableOpacity>
          </View>
        <View style={SSArtworkSelectorCard.textContainer}>
          <TextElement style={SSArtworkSelectorCard.imageArtistText}>
            {artwork?.artistName?.value && artwork?.artistName?.value?.trim()}
          </TextElement>
          <TextElement style={SSArtworkSelectorCard.imageTitle}>
            {artwork?.artworkTitle?.value && artwork?.artworkTitle?.value?.trim()}
          </TextElement>
          <TextElement style={SSArtworkSelectorCard.imagePrice}>
            {artwork?.artworkCreatedYear?.value && artwork?.artworkCreatedYear?.value?.trim()}
          </TextElement>
        </View>
      </View>
    </View>
  );
}

// Check the docs for React.memo for an explanation of this function
export default React.memo(ArtworkCard, (prevProps, nextProps) => {
  return (
    prevProps.artwork === nextProps.artwork &&
    prevProps.navigateToTombstone === nextProps.navigateToTombstone
  );
});