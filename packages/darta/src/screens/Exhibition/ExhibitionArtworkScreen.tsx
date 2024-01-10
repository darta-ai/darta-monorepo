import React, {useContext} from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { ActivityIndicator } from 'react-native-paper';
import { ArtworkList } from '../../components/Artwork/ArtworkList';


import * as Colors from '@darta-styles';
import {TextElement} from '../../components/Elements/_index';
import {
  ExhibitionRootEnum
} from '../../typing/routes';
import {StoreContext} from '../../state/Store';
import { readExhibition } from '../../api/exhibitionRoutes';
import {Artwork} from '@darta-types'
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import FastImage from 'react-native-fast-image';
import { ExhibitionETypes, ExhibitionStoreContext, UIStoreContext } from '../../state';


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
  route, 
  navigation
}: {
  route?: ExhibitionArtworkRouteProp,
  navigation?: any
}) {
  const {state} = useContext(StoreContext);
  const {exhibitionState, exhibitionDispatch} = React.useContext(ExhibitionStoreContext);
  const {uiState} = React.useContext(UIStoreContext);


  const [exhibitionId, setExhibitionId] = React.useState<string>("")
  const [errorText, setErrorText] = React.useState<string>("");
  const [isArtworkLoaded, setIsArtworkLoaded] = React.useState<boolean>(false);

  const [artworkData, setArtworkData] = React.useState<Artwork[] | null>(null)

  const setArtworksFromExhibitionId = async ({exhibitionId}: {exhibitionId: string}) => {
      let artwork: {[key: string] : Artwork} = {}
      if (exhibitionState.exhibitionData && exhibitionState.exhibitionData[exhibitionId] && exhibitionState.exhibitionData[exhibitionId].artworks){
        artwork = exhibitionState.exhibitionData[exhibitionId].artworks ?? {}
      } 
      if (artwork){
        type ImageUrlObject = { uri: string };

        const imageUrlsToPrefetch: ImageUrlObject[] = [];
        const data: Artwork[] = [];
        Object.values(artwork).sort((a: Artwork, b: Artwork) => a?.exhibitionOrder! - b?.exhibitionOrder!)
        .forEach((artwork: Artwork) => {
          if (artwork?.artworkImage.value){
            imageUrlsToPrefetch.push({uri: artwork.artworkImage.value})
          }
          data.push(artwork)
        })
        FastImage.preload(imageUrlsToPrefetch)
        setArtworkData(data)
        setIsArtworkLoaded(true)
        setErrorText("")
  } else {
    setErrorText("hey something went wrong, please refresh and try again")
  }
}


  React.useEffect(()=>{
    if (route?.params?.exhibitionId && exhibitionState.exhibitionData && exhibitionState.exhibitionData[route?.params?.exhibitionId] && exhibitionState.exhibitionData[route?.params?.exhibitionId].artworks){
      setExhibitionId(route.params.exhibitionId);
      setArtworksFromExhibitionId({exhibitionId: route.params.exhibitionId})
    } else if (state.qrCodeExhibitionId) {
      setExhibitionId(state.qrCodeExhibitionId);
      setArtworksFromExhibitionId({exhibitionId: state.qrCodeExhibitionId})
    } else {
      setErrorText('something went wrong, please refresh and try again')
    }

  }, [exhibitionState.exhibitionData, uiState.currentExhibitionHeader, state.qrCodeExhibitionId])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
        const exhibId = route?.params.exhibitionId ?? exhibitionId
        const newExhibition = await readExhibition({exhibitionId: exhibId});
        exhibitionDispatch({
            type: ExhibitionETypes.saveExhibition,
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
          artworkData={artworkData as Artwork[]}
          navigation={navigation}
          navigateTo={route?.params.navigateTo ?? ExhibitionRootEnum.individualArtwork}
          navigateToParams={ExhibitionRootEnum.TopTab}
          route={route}
        />
      )}
    </>
  );
}
