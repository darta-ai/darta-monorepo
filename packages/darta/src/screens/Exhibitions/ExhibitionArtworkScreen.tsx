import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useState} from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';

import {PRIMARY_600, PRIMARY_50} from '@darta-styles';
import {imagePrefetch} from '../../utils/functions';
import {GalleryPreview} from '../../components/Previews/GalleryPreview';
import {TextElement} from '../../components/Elements/_index';
import {days, today} from '../../utils/constants';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { SSDartaHome, touchableOpacity } from '../../styles/styles';
import { readExhibition } from '../../api/exhibitionRoutes';
import {Artwork, Exhibition, ExhibitionDates, IOpeningLocationData} from '@darta-types'
import { ExhibitionPreview } from '../../components/Previews/ExhibitionPreview';
import {ArtworkCard} from '../../components/Artwork/ArtworkCard'
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/ExhibitionTopTabNavigator';

type ExhibitionArtworkScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.artworkList
>;

const exhibitionDetailsStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: PRIMARY_50,
      width: '100%',
      // height: hp('100%'),
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  flex1: {
    flex: 1,
  },
})

type ExhibitionArtworkRouteProp = RouteProp<ExhibitionStackParamList, ExhibitionRootEnum.artworkList>;


export function ExhibitionArtworkScreen({
  route, navigation
}: {
  route: ExhibitionArtworkRouteProp,
  navigation: any
}) {
  const {state} = useContext(StoreContext);

  let exhibitionId;
  if (route?.params?.exhibitionId){
    exhibitionId = route.params.exhibitionId;
  } else{
    return (
        <View style={exhibitionDetailsStyles.container}>
            <TextElement>hey something went wrong, please refresh and try again</TextElement>
        </View>
    )
  }

  let currentArtwork: Artwork[] = [];
  if (state?.exhibitionData && state.exhibitionData[exhibitionId] && state.exhibitionData[exhibitionId].artworks){
    const artwork = state.exhibitionData[exhibitionId].artworks
    currentArtwork = Object.values(artwork)
  }

  const evens: Artwork[] = []
  const odds: Artwork[] = []
  currentArtwork.sort((a: Artwork, b: Artwork) => a?.exhibitionOrder! - b?.exhibitionOrder!)
  .forEach((artwork: Artwork, index: number) => {
    if (index % 2 === 0){
      evens.push(artwork)
    } else{
      odds.push(artwork)
    }
  })

  const evenArtworks = evens;
  const oddArtworks = odds

  return (
        <View style={exhibitionDetailsStyles.container}>
        <FlatList
          data={[0]}
          keyExtractor={item => item.toString()}
          style={{ marginTop: hp('2.5%')}}
          renderItem={() => (
            <View style={exhibitionDetailsStyles.flexContainer}>
              <View >
                {evenArtworks && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={evenArtworks}
                    keyExtractor={item => item.artworkId?.toString() ?? "654321"}
                    renderItem={({item}) => (
                      <ArtworkCard
                        artwork={item}
                        displayLeft={true}
                        navigation={navigation}
                      />
                    )}
                  />
                )}
              </View>
              <View>
                {oddArtworks && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={oddArtworks}
                    keyExtractor={item => item.artworkId?.toString() ?? "123456"}
                    renderItem={({item}) => (
                      <View>
                      <ArtworkCard
                        artwork={item}
                        displayLeft={false}
                        navigation={navigation}
                      />
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          )}
        />
        </View>
  );
}
