import React, {useContext} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
// import FastImage from 'react-native-fast-image';
import { ExhibitionETypes, ExhibitionStoreContext, UIStoreContext } from '../../state';
import { dartaLogo } from '../../components/User/UserInquiredArtwork';


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
  const [isArtworkLoaded, setIsArtworkLoaded] = React.useState<boolean>(false);
  const [hasNoArtwork, setHasNoArtwork] = React.useState<boolean>(true);

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
        // FastImage.preload(imageUrlsToPrefetch)
        setArtworkData(data)
        if (data.length > 0){
          setHasNoArtwork(false)
        }
        setIsArtworkLoaded(true)
    } else {
      setHasNoArtwork(true)
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
      setHasNoArtwork(true)
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

    if (!isArtworkLoaded && !hasNoArtwork){
      //loading screen 
      return (
        <ScrollView 
        style={{
          height: hp('40%'),
          width: '100%',
          backgroundColor: Colors.PRIMARY_50,
        }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_950} onRefresh={onRefresh} />}>  
            <TextElement style={dartaLogo.textHeader}>Loading...</TextElement>
            <ActivityIndicator color={Colors.PRIMARY_950} />
        </ScrollView>
      )
    }
    else if (hasNoArtwork){
      return(
        <ScrollView 
        style={{
          height: hp('40%'),
          width: '100%',
          backgroundColor: Colors.PRIMARY_50,
        }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_950} onRefresh={onRefresh} />}>  
            <TextElement style={dartaLogo.text}>Full checklist unavailable</TextElement>
        </ScrollView>
      )
    } else if (isArtworkLoaded) {
      return (
          <ArtworkList 
          refreshing={refreshing}
          onRefresh={onRefresh}
          artworkData={artworkData as Artwork[]}
          navigation={navigation}
          navigateTo={route?.params.navigateTo ?? ExhibitionRootEnum.individualArtwork}
          navigateToParams={ExhibitionRootEnum.TopTab}
          route={route}
        />
      )
    }
}
