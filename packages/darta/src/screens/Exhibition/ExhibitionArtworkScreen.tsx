import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, FlatList,
  RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { ActivityIndicator } from 'react-native-paper';


import * as Colors from '@darta-styles';
import {TextElement} from '../../components/Elements/_index';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { readExhibition } from '../../api/exhibitionRoutes';
import {Artwork} from '@darta-types'
import {ArtworkCard} from '../../components/Artwork/ArtworkCard'
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';


const artworkDetailsStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: Colors.PRIMARY_50,
      width: '100%',
      minHeight: '100%',
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp('10%'),
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PRIMARY_50,
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

  const [exhibitionId, setExhibitionId] = React.useState<string>("")
  const [errorText, setErrorText] = React.useState<string>("");
  const [isArtworkLoaded, setIsArtworkLoaded] = React.useState<boolean>(false);

  const [oddArtwork, setOdds] = React.useState<Artwork[] | null>(null)
  const [evenArtwork, setEvens] = React.useState<Artwork[] | null>(null)

  const setArtworksFromExhibitionId = async ({exhibitionId}: {exhibitionId: string}) => {
    if (state?.exhibitionData && state.exhibitionData[exhibitionId] && state.exhibitionData[exhibitionId].artworks){
      const artwork = state.exhibitionData[exhibitionId].artworks
      if (artwork){
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
        setIsArtworkLoaded(true)
        setErrorText("")
      }
  }
}

  React.useEffect(()=>{
    if (route?.params?.exhibitionId){
      setExhibitionId(route.params.exhibitionId);
      setArtworksFromExhibitionId({exhibitionId: route.params.exhibitionId})
    } else if (state.qrCodeExhibitionId) {
      setExhibitionId(state.qrCodeExhibitionId);
      setArtworksFromExhibitionId({exhibitionId: state.qrCodeExhibitionId})
    } else {
      setErrorText("hey something went wrong, please refresh and try again")
    }
  }, [,state.qrCodeExhibitionId])


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
    <>
      {!isArtworkLoaded ? ( 
        <View style={artworkDetailsStyles.spinnerContainer}>
            <ActivityIndicator animating={errorText !== ""} size={35} color={Colors.PRIMARY_800} />
            <TextElement>{errorText}</TextElement>
        </View>
        )
        : 
        (
      <View style={artworkDetailsStyles.container}>
        <FlatList
          data={[0]}
          keyExtractor={item => item.toString()}
          style={{ marginTop: hp('2.5%')}}
          refreshControl={
            <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}
          renderItem={() => (
            <View style={artworkDetailsStyles.flexContainer}>
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
      )}
    </>
  );
}
