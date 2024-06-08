import React from 'react';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtworkList } from '../Artwork/ArtworkList';
import { TextElement } from '../Elements/TextElement';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import * as Colors from '@darta-styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { listUserArtworkAPI } from '../../utils/apiCalls';
import { UserRoutesEnum } from '../../typing/routes';
// import FastImage from 'react-native-fast-image';
import { UserETypes, UserStoreContext } from '../../state/UserStore';

export const dartaLogo = StyleSheet.create({
  image: {
    height: hp('50%'),
    width: wp('50%'),
    borderRadius: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  textHeader:{
    color: Colors.PRIMARY_950,
    fontSize: 20,
    marginBottom: 24,
    fontFamily: 'DMSans_400Regular',
  },
  text:{
    color: Colors.PRIMARY_950,
    fontSize: 14,
    marginBottom: 24,
    fontFamily: 'DMSans_400Regular',
  },
});


export function UserInquiredArtwork({navigation}: {navigation: any}) {
  const {userState, userDispatch} = React.useContext(UserStoreContext);
  const [artworkData, setArtworkData] = React.useState<Artwork[] | null>(null)
  const [hasNoArtwork, setHasNoArtwork] = React.useState<boolean>(true)

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

      // FastImage.preload(imageUrlsToPrefetch)
      setArtworkData(data)
      if (data.length !== 0){
        setHasNoArtwork(false)
      }
    } 

  }, [userState.userInquiredArtwork, userState.artworkData]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const inquiredArt = await listUserArtworkAPI({action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 100})
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


    if (hasNoArtwork){
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
            <TextElement style={dartaLogo.textHeader}>No artwork to show</TextElement>
            <TextElement style={dartaLogo.text}>When you inquire on an artwork, it will appear here</TextElement>
        </ScrollView>
      )
    } else if (artworkData) {
      return (
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
}
