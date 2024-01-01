import React from 'react'
import { View, StyleSheet, RefreshControl, Alert, Linking } from 'react-native'
import { Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state/Store';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { Artwork, ArtworkListInformation, ExhibitionForList, FullList, GalleryForList, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { getFullList, removeArtworkFromList } from '../../api/listRoutes';
import { ArtworkListView } from '../../components/Lists/ArtworkListView';
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import { UserETypes, UserStoreContext } from '../../state';
import analytics from '@react-native-firebase/analytics';


export function FullListScreen({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {

    const {state, dispatch} = React.useContext(StoreContext);
    const {userState, userDispatch} = React.useContext(UserStoreContext);
    const [fullList, setFullList] = React.useState<FullList | null>(null);
    const [fullArtwork, setFullArtwork] = React.useState<{[key: string] : ArtworkListInformation} | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [noArtwork, setNoArtwork] = React.useState<boolean>(false);
    const [isRefreshing, setRefreshing] = React.useState<boolean>(false);


    const getListData = async ({listId} : {listId: string}): Promise<{[key: string] : FullList  }> => {
        return await getFullList({listId})
    }

    React.useEffect(()=>{
        // first check to see if there is a list ID on the params

        const setListData = async () => {
            if (!route.params?.listId){
                // if there is not, throw an error
                setIsError(true)
                setIsLoading(false)
                return
            } else if (state.userLists && state.userLists[route.params.listId]){
                // if there is, check to see if it is in the state
                setFullList(state.userLists[route.params.listId])
                if (state.userLists[route.params.listId].artwork){
                    setFullArtwork(state.userLists[route.params.listId].artwork)
                    setIsLoading(false)
                }else {
                    setNoArtwork(true)
                }
            } else {
                // if it is not in the state, fetch it from the API
                try{
                    const fullList = await getListData({listId: route.params.listId})
                    dispatch({
                        type: ETypes.setUserLists,
                        userLists: fullList
                    })
                    setFullList(Object.values(fullList)[0])
                    setFullArtwork(Object.values(fullList)[0].artwork)
                    setIsLoading(false)
                } catch (error){
                    setIsError(true)
                }
            }
        }
        setIsLoading(true)

        setListData()
    }, [state.userLists])

    const [dataProvider, setDataProvider] = React.useState(
        new DataProvider((r1, r2) => r1 !== r2)
    );

    const layoutProvider = new LayoutProvider(
        () => 1, 
        (_, dim) => {
            dim.width = wp('100%');
            dim.height = hp('90%');
        }
    );

    React.useEffect(() => {
        if (fullArtwork) {
            const sortedArtworks = Object.values(fullArtwork)
            setDataProvider(dataProvider.cloneWithRows(sortedArtworks));
        }
    }, [fullArtwork]);

    const handleDelete = async ({artworkId} : {artworkId: string}): Promise<boolean> => {
        if (!artworkId || !fullList?._id) return false
        // delete the artwork from the list
        const res = await removeArtworkFromList({listId: fullList._id, artworkId})
        // update the state
        if (res){
            dispatch({
                type: ETypes.setUserLists,
                userLists: res
            })
            setFullList(Object.values(res)[0])
            setFullArtwork(Object.values(res)[0].artwork)
            return true
        }
        return false
    }

    const refreshControl = React.useCallback(async () => {
        setRefreshing(true)
        const fullList = await getListData({listId: route.params.listId})
        dispatch({
            type: ETypes.setUserLists,
            userLists: fullList
        })
        setFullList(Object.values(fullList)[0])
        setFullArtwork(Object.values(fullList)[0].artwork)
        setRefreshing(false)
    }, [route.params.listId])


  const inquireArtwork = React.useCallback(async ({artwork, gallery, exhibition} : {artwork: Artwork, gallery: GalleryForList, exhibition: ExhibitionForList}) => {

    try {
        const artworkId = artwork?._id
        if (!artworkId) return

        // await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE})
        userDispatch({
            type: UserETypes.setUserInquiredArtwork,
            artworkId,
        })
        analytics().logEvent('inquire_artwork', {artworkId})

        const emailAddress = gallery.primaryContact?.value 
        if (!emailAddress) return

        const subject = `Inquiry about ${artwork.artworkTitle?.value} at ${gallery.galleryName?.value}`
        
        const body = `Hi ${gallery.galleryName?.value},%0D%0A%0D%0A I saw ${artwork.artworkTitle?.value} by ${artwork.artistName?.value} on darta and I'm interested in learning more. %0D%0A%0D%0A Best,%0D%0A%0D%0A${userState.user?.legalFirstName}`

        const url = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
        Linking.canOpenURL(url)
          .then((supported) => {
            if (!supported) {
              console.log(`Can't handle URL: ${url}`);
            } else {
              return Linking.openURL(url);
            }
          })
          .catch((err) => console.error('An error occurred', err));
    } catch(error){
        console.log(error)
    } 
    }, [])

    const inquireAlert = ({artwork, gallery, exhibition} : {artwork: Artwork, gallery: GalleryForList, exhibition: ExhibitionForList}) => {

        const galleryName = gallery?.galleryName?.value || "the gallery"

        Alert.alert(`Reach out to ${galleryName}?`, `We'll autofill an email from you and let the gallery tell you all about the work!`, [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'destructive',
            },
            {
              text: `Yes`,
              onPress: () => inquireArtwork({artwork, gallery, exhibition}),
            },
          ])
    }

    const rowRenderer = (_, artwork) => {
        return (
            <View style={{flex: 1, margin: 24 }}>
                <ArtworkListView 
                    artwork={artwork.artwork}
                    exhibition={artwork.exhibition}
                    gallery={artwork.gallery}
                    inquireAlert={inquireAlert}
                    navigation={navigation}
                    onDelete={handleDelete}
                />
            </View>
        );
    };
    if (isError){
        return(
            <View>
                <Button onPress={() => navigation.goBack()} textColor={Colors.PRIMARY_950}>Go Back</Button>
            </View>
        )
    } else if (isLoading){
        return(
            <View>
                <Button onPress={() => navigation.goBack()} textColor={Colors.PRIMARY_950}>Loading...</Button>
            </View>
        )
    } else if (noArtwork){
        return(
            <View>
                <Button onPress={() => navigation.goBack()} textColor={Colors.PRIMARY_950}>No artwork to display</Button>
            </View>
        )
    } 
    else if (fullArtwork){
        return (
            <RecyclerListView
            style={{ flex: 1 }}
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            rowRenderer={rowRenderer}
            scrollViewProps={{
                decelerationRate: "fast",
                snapToInterval: hp('90%'),
                // snapToAlignment: 'center',
                scrollEnabled: true,
                disableIntervalMomentum: true,
                pagingEnabled: true,
                refreshControl:  
                    <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={refreshControl}
                        tintColor={Colors.PRIMARY_600}
                    />
            }}
        />
        )
    }
}