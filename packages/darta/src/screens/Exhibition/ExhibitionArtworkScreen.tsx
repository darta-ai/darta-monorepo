import React, {useContext} from 'react';
import {View, StyleSheet, Image, ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { ActivityIndicator } from 'react-native-paper';
import { ArtworkList } from '../../components/Artwork/ArtworkList';


import * as Colors from '@darta-styles';
import {TextElement} from '../../components/Elements/_index';
import {
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import { readExhibition } from '../../api/exhibitionRoutes';
import {Artwork} from '@darta-types'
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

  const [oddArtwork, setOddsArtwork] = React.useState<Artwork[] | null>(null)
  const [evenArtwork, setEvensArtwork] = React.useState<Artwork[] | null>(null)

  const setArtworksFromExhibitionId = async ({exhibitionId}: {exhibitionId: string}) => {
      let artwork: {[key: string] : Artwork} = {}
      if (state.exhibitionData && state.exhibitionData[exhibitionId] && state.exhibitionData[exhibitionId].artworks){
        artwork = state.exhibitionData[exhibitionId].artworks ?? {}
      } 
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
        setOddsArtwork(odds)
        setEvensArtwork(evens)
        setIsArtworkLoaded(true)
        setErrorText("")
  } else {
    setErrorText("hey something went wrong, please refresh and try again")
  }
}

async function fetchArtworkByExhibitionById(): Promise<{[key: string] : Artwork} | null> {
  if (!route?.params?.exhibitionId) return null;
  try {
      const { exhibitionId} = route.params
      const exhibition = await readExhibition({ exhibitionId })

      const artworkPromises = (Object.values(exhibition.artworks) as Artwork[]).map((artwork: Artwork) => {
        if (artwork.artworkImage.value){
          return Image.prefetch(artwork.artworkImage.value)
        }
      })
      Promise.all(artworkPromises)
      
      dispatch({
          type: ETypes.saveExhibition,
          exhibitionData: exhibition,
      })
      dispatch({
          type: ETypes.setQRCodeExhibitionId,
          qRCodeExhibitionId: exhibition.exhibitionId,
        })
      dispatch({
          type: ETypes.setFullyLoadedExhibitions,
          fullyLoadedExhibitions: {[exhibition._id] : true},
      })
      return exhibition.artworks
  } catch (error: any){
      console.log(error)
  }
  return null
}


  React.useEffect(()=>{
    if (route?.params?.exhibitionId && state.exhibitionData && state.exhibitionData[route?.params?.exhibitionId] && state.exhibitionData[route?.params?.exhibitionId].artworks){
      setExhibitionId(route.params.exhibitionId);
      setArtworksFromExhibitionId({exhibitionId: route.params.exhibitionId})
    } else {
      setErrorText('something went wrong, please refresh and try again')
    }

  }, [state.exhibitionData, state.currentExhibitionHeader])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
        const exhibId = route?.params.exhibitionId ?? exhibitionId
        const newExhibition = await readExhibition({exhibitionId: exhibId});
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
          <ScrollView style={artworkDetailsStyles.spinnerContainer} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} refreshControl={
            <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>      
                <ActivityIndicator animating={true} size={35} color={Colors.PRIMARY_800} />
                <TextElement>{errorText}</TextElement>
            </ScrollView>
        )
        : 
        (
          <ArtworkList 
          refreshing={refreshing}
          onRefresh={onRefresh}
          evenArtwork={evenArtwork as Artwork[]}
          oddArtwork={oddArtwork as Artwork[]}
          navigation={navigation}
          navigateTo={ExhibitionRootEnum.individualArtwork}
          navigateToParams={ExhibitionRootEnum.TopTab}
        />
      )}
    </>
  );
}
