import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, FlatList,
  RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';

import {PRIMARY_600, PRIMARY_50} from '@darta-styles';
import {TextElement} from '../../components/Elements/_index';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { SSDartaHome, touchableOpacity } from '../../styles/styles';
import { readExhibition } from '../../api/exhibitionRoutes';
import {Artwork, Exhibition, ExhibitionDates, IOpeningLocationData} from '@darta-types'
import {ArtworkCard} from '../../components/Artwork/ArtworkCard'
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';

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
      height: hp('100%'),
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
  route?: ExhibitionArtworkRouteProp,
  navigation?: any
}) {
  const {state, dispatch} = useContext(StoreContext);

  let exhibitionId = ""
  if (route?.params?.exhibitionId){
    exhibitionId = route.params.exhibitionId;
  } else{
    return (
        <View style={exhibitionDetailsStyles.container}>
            <TextElement>hey something went wrong, please refresh and try again</TextElement>
        </View>
    )
  }

  const [currentArtwork, setCurrentArtwork] = React.useState<Artwork[] | null>(null)
  const [oddArtwork, setOdds] = React.useState<Artwork[] | null>(null)
  const [evenArtwork, setEvens] = React.useState<Artwork[] | null>(null)

  React.useEffect(()=>{
    if (state?.exhibitionData && state.exhibitionData[exhibitionId] && state.exhibitionData[exhibitionId].artworks){
      const artwork = state.exhibitionData[exhibitionId].artworks
      if (artwork){
        setCurrentArtwork(Object.values(artwork))
        const odds: Artwork[] = [];
        const evens: Artwork[]  = [];
        Object.values(artwork).sort((a: Artwork, b: Artwork) => a?.exhibitionOrder! - b?.exhibitionOrder!)
        .forEach((artwork: Artwork, index: number) => {
          if (index % 2 === 0){
            evens.push(artwork)
          } else{
            odds.push(artwork)
          }
        })
        setOdds(odds)
        setEvens(evens)
      }
    }
  }, [, state.exhibitionData])


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
        const newExhibition = await readExhibition({exhibitionId: exhibitionId});
        dispatch({
            type: ETypes.saveExhibition,
            exhibitionData: newExhibition,
        })
    } catch {
        setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500)  }, []);

  return (
      <View style={exhibitionDetailsStyles.container}>
        <FlatList
          data={[0]}
          keyExtractor={item => item.toString()}
          style={{ marginTop: hp('2.5%')}}
          refreshControl={
            <RefreshControl refreshing={refreshing} tintColor={PRIMARY_600} onRefresh={onRefresh} />}
          renderItem={() => (
            <View style={exhibitionDetailsStyles.flexContainer}>
              <View >
                {evenArtwork && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={evenArtwork}
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
                {oddArtwork && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={oddArtwork}
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
