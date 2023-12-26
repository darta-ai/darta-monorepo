import React from 'react';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtworkList } from '../Artwork/ArtworkList';
import { TextElement } from '../Elements/TextElement';
import { Image } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { listUserArtworkAPI } from '../../utils/apiCalls';
import { RefreshControl, ScrollView } from 'react-native';
import * as Colors from '@darta-styles';
import { UserRoutesEnum } from '../../typing/routes';
import { dartaLogo } from './UserInquiredArtwork';
import FastImage from 'react-native-fast-image';
import { UserETypes, UserStoreContext } from '../../state/UserStore';

export function UserSavedArtwork({navigation}: {navigation: any}) {
  const {userState, userDispatch} = React.useContext(UserStoreContext);

  const errorMessageText = "when you save artwork, it will appear here"


  const [artworkData, setArtworkData] = React.useState<Artwork[] | null>(null)
  const [getStartedText, setGetStartedText] = React.useState<string | null>(errorMessageText)

  React.useEffect(() => {
    const savedArtwork = userState.userSavedArtwork;
    console.log({savedArtwork})
    if (savedArtwork){
      type ImageUrlObject = { uri: string };
      const imageUrlsToPrefetch: ImageUrlObject[] = [];
      const data: Artwork[] = [];
      Object.keys(savedArtwork as any)
      .filter(key => savedArtwork[key])
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
    }else {
      setGetStartedText(errorMessageText)
    }

  }, [userState.userSavedArtwork]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const savedArtwork = await listUserArtworkAPI({action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 10})
      let savedArtworkIds = {}
      if (savedArtwork && Object.values(savedArtwork).length > 0){
        savedArtworkIds = Object.values(savedArtwork).reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
      }
      userDispatch({
        type: UserETypes.setUserSavedArtworkMulti,
        artworkIds: savedArtworkIds
      })
      userDispatch({
        type: UserETypes.saveArtworkMulti,
        artworkDataMulti: savedArtwork
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
