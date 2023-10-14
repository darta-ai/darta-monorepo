import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {PRIMARY_600, PRIMARY_900, PRIMARY_200} from '@darta-styles';
import {Artwork} from '@darta-types'
import {TextElement} from '../Elements/_index';
import {ETypes, StoreContext} from '../../state/Store';
import { ExhibitionRootEnum } from '../../typing/routes';

export function ArtworkCard({
  artwork,
  displayLeft,
  navigation,
  navigateTo,
  navigateToParams
}: {
  artwork: Artwork;
  displayLeft: boolean;
  navigation: any,
  navigateTo: string,
  navigateToParams: string
}) {
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

  let inputHeight = artwork?.artworkDimensions?.heightIn?.value ?? "1"
  let inputWidth = artwork?.artworkDimensions?.widthIn?.value ?? "1"

  const height = parseInt(inputHeight, 10)
  const width = parseInt(inputWidth, 10)

  let artHeight = 0;
  let artWidth = 0;
  const maxDimension = Math.floor(wp('45%') * 0.85);
  if (height && width && height >= width) {
    artHeight = maxDimension;
    artWidth = Math.floor((width / height) * artHeight);
  }
  if (height && width && height < width) {
    artWidth = maxDimension;
    artHeight = Math.floor((height / width) * artWidth);
  }

  let displayPrice = "";

  if (artwork?.artworkPrice?.value){
    displayPrice = "$" + parseInt(artwork?.artworkPrice?.value, 10)?.toLocaleString()
  }


  const SSArtworkSelectorCard = StyleSheet.create({
    container: {
      marginTop: hp('1%'),
      flexDirection: 'column',
      borderTopLeftRadius: !displayLeft ? hp('1%') : 0,
      borderBottomLeftRadius: !displayLeft ? hp('2%') : 0,
      borderTopRightRadius: displayLeft ? hp('1%') : 0,
      borderBottomRightRadius: displayLeft ? hp('2%') : 0,
      borderLeftColor: displayLeft ? PRIMARY_600 : PRIMARY_200,
      borderRightColor: !displayLeft ? PRIMARY_600 : PRIMARY_200,
      borderLeftWidth: displayLeft ? 2 : 0.5,
      borderRightWidth: !displayLeft ? 2 : 0.5,
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      width: wp('45%'),
      minHeight: hp('28%'),
      marginBottom: hp('0.5%'),
      borderWidth: 0.5,
      borderColor: PRIMARY_200,
    },
    imageContainer: {
      alignSelf: 'center',
      alignContent: 'center',
      margin: hp('1%'),
    },
    textContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      margin: hp('1%'),
    },
    imageArtistText: {
      fontFamily: 'AvenirNext-Bold',
      fontSize: 15,
      textAlign: 'center',
      color: PRIMARY_900,
    },
    imageTitle: {
      fontFamily: 'AvenirNext-Italic',
      fontSize: 13,
      textAlign: 'center',
      color: PRIMARY_900,
    },
    imagePrice: {
      fontFamily: 'Avenir Next',
      fontSize: 13,
      textAlign: 'center',
      color: PRIMARY_900,
    },
  });
  return (

    <TouchableOpacity 
      onPress={() => navigateToTombstone()}
      key={artwork?._id}
    >
      <View style={SSArtworkSelectorCard.container}>
        <View style={SSArtworkSelectorCard.imageContainer}>
          <Image
            source={{
              uri: artwork.artworkImage?.value ?? "",
            }}
            style={{height: artHeight, width: artWidth}}
          />
        </View>
        <View style={SSArtworkSelectorCard.textContainer}>
          <TextElement style={SSArtworkSelectorCard.imageArtistText}>
            {artwork?.artistName?.value}
          </TextElement>
          <TextElement style={SSArtworkSelectorCard.imageTitle}>
            {artwork?.artworkTitle?.value}
          </TextElement>
          <TextElement style={SSArtworkSelectorCard.imagePrice}>
            {displayPrice}
          </TextElement>
        </View>
      </View>
    </TouchableOpacity>
  );
}
