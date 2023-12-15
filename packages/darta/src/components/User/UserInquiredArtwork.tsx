import React from 'react';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtworkList } from '../Artwork/ArtworkList';
import { Image } from 'react-native';
import { TextElement } from '../Elements/TextElement';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import * as Colors from '@darta-styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { listUserArtworkAPI } from '../../utils/apiCalls';
import { UserRoutesEnum } from '../../typing/routes';
import FastImage from 'react-native-fast-image';
import { UserETypes, UserStoreContext } from '../../state/UserStore';

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
  const {userState, userDispatch} = React.useContext(UserStoreContext);

  const errorMessageText = "when you inquire about artwork, it will appear here"

  const [artworkData, setArtworkData] = React.useState<Artwork[] | null>(null)
  const [getStartedText, setGetStartedText] = React.useState<string | null>(errorMessageText)

  React.useEffect(() => {
    const inquiredArtwork = userState.userInquiredArtwork;
    if (inquiredArtwork){
      type ImageUrlObject = { uri: string };
      const imageUrlsToPrefetch: ImageUrlObject[] = [];
      const data: Artwork[] = [];
      Object.keys(inquiredArtwork as any)
      .filter(key => inquiredArtwork[key])
      .filter((artworkId) => userState.artworkData && userState.artworkData[artworkId])
      .forEach((artwork: any) => {
        if (!userState.artworkData) return
        const fullArtwork = userState?.artworkData[artwork]
        if (fullArtwork.artworkImage?.value){
          imageUrlsToPrefetch.push({uri: fullArtwork.artworkImage.value})
        }
        data.push(fullArtwork)
      })

      FastImage.preload(imageUrlsToPrefetch)
      setArtworkData(data)
      if (data.length !== 0){
        setGetStartedText(null)
      }
    } else {
      setGetStartedText(errorMessageText)
    }


  }, [userState.userInquiredArtwork]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const inquiredArt = await listUserArtworkAPI({action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 10})
      let inquiredArtworkIds = {}
      if (inquiredArt && Object.values(inquiredArt).length > 0){
        inquiredArtworkIds = Object.values(inquiredArt).reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
      }
      userDispatch({
        type: UserETypes.setUserInquiredArtworkMulti,
        artworkIds: inquiredArtworkIds
      })
      userDispatch({
        type: UserETypes.saveArtworkMulti,
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
          artworkData={artworkData as Artwork[]}
          navigation={navigation}
          navigateTo={UserRoutesEnum.UserGalleryAndArtwork}
          navigateToParams={UserRoutesEnum.UserPastTopTabNavigator}
        />
        )
      }
      </>
  );
}
