import React from 'react';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import { ArtworkList } from '../Artwork/ArtworkList';
import { TextElement } from '../Elements/TextElement';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { listUserArtworkAPI } from '../../utils/apiCalls';
import { RefreshControl, ScrollView } from 'react-native';
import * as Colors from '@darta-styles';
import { UserRoutesEnum } from '../../typing/routes';
import { dartaLogo } from './UserInquiredArtwork';
import { UserETypes, UserStoreContext } from '../../state/UserStore';

export function UserSavedArtwork({navigation}: {navigation: any}) {
  const {userState, userDispatch} = React.useContext(UserStoreContext);



  const [artworkData, setArtworkData] = React.useState<Artwork[] | null>(null)
  const [hasNoArtwork, setHasNoArtwork] = React.useState<boolean>(true)

  React.useEffect(() => {
    const savedArtwork = userState.userSavedArtwork;
    if (savedArtwork){
      const data: Artwork[] = [];
      Object.keys(savedArtwork as any)
      .filter(key => savedArtwork[key])
      .filter((artworkId) => userState.artworkData && userState.artworkData[artworkId])
      .forEach((artwork: any) => {
        if (!userState.artworkData) return
        const fullArtwork = userState?.artworkData[artwork]
        data.push(fullArtwork)
      })
      setArtworkData(data)

      if (data.length > 0){
        setHasNoArtwork(false)
      }
    }

  }, [userState.userSavedArtwork, userState.artworkData]);

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
            <TextElement style={dartaLogo.text}>when you add artwork to your saves, it will appear here</TextElement>
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
