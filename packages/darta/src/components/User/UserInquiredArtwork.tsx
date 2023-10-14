import React from 'react';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtworkList } from '../Artwork/ArtworkList';
import { Image } from 'react-native';
import { TextElement } from '../Elements/TextElement';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import * as Colors from '@darta-styles';
import {ETypes, StoreContext} from '../../state/Store';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { listUserArtwork } from '../../utils/apiCalls';
import { UserRoutesEnum } from '../../typing/routes';

export const dartaLogo = StyleSheet.create({
  image: {
    height: hp('50%'),
    width: wp('50%'),
    borderRadius: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});


export function UserInquiredArtwork({navigation}: {navigation: any}) {
  const {state, dispatch} = React.useContext(StoreContext);

  const errorMessageText = "when you inquire about artwork, it will appear here"

  const [oddArtwork, setOddsArtwork] = React.useState<Artwork[] | null>(null)
  const [evenArtwork, setEvensArtwork] = React.useState<Artwork[] | null>(null)
  const [getStartedText, setGetStartedText] = React.useState<string | null>(errorMessageText)

  React.useEffect(() => {
    const inquiredArtwork = state.userInquiredArtwork;
    if (inquiredArtwork){
      const odds: Artwork[] = [];
      const evens: Artwork[] = [];
      Object.keys(inquiredArtwork as any)
      .filter(key => inquiredArtwork[key])
      .filter((artworkId) => state.artworkData && state.artworkData[artworkId])
      .map((el, index) => {
        if (index % 2 !== 0 && state.artworkData && state.artworkData[el]){
          odds.push(state.artworkData[el])
        }else if (state.artworkData && state.artworkData[el]){
          evens.push(state.artworkData[el])
        }
      })

      setOddsArtwork(odds)
      setEvensArtwork(evens)
      if (evens.length !== 0){
        setGetStartedText(null)
        }
    } else {
      setGetStartedText(errorMessageText)
    }


  }, [state.userInquiredArtwork]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const inquiredArt = await listUserArtwork({action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 10})
      let inquiredArtworkIds = {}
      if (inquiredArt && Object.values(inquiredArt).length > 0){
        inquiredArtworkIds = Object.values(inquiredArt).reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
      }
      dispatch({
        type: ETypes.setUserInquiredArtworkMulti,
        artworkIds: inquiredArtworkIds
      })
      dispatch({
        type: ETypes.saveArtworkMulti,
        artworkDataMulti: inquiredArt
      })
    } catch {
        setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500)  }, []);

  return (
    <>
      {getStartedText ? 
      (
        <ScrollView 
        style={{
          height: hp('40%'),
          width: '100%',
          backgroundColor: Colors.PRIMARY_600,
        }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>  
          <Image 
            source={require('../../assets/dartahousewhite.png')}
            style={dartaLogo.image}
          />
          <TextElement style={{margin: 5, color: Colors.PRIMARY_50}}>{getStartedText}</TextElement>
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
          navigateTo={UserRoutesEnum.UserGalleryAndArtwork}
          navigateToParams={UserRoutesEnum.UserPastTopTabNavigator}
        />
        )
      }
      </>
  );
}
