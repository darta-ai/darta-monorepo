import React from 'react'
import { View, RefreshControl, Alert, Linking, StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state/Store';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { Artwork, ArtworkListInformation, ExhibitionForList, FullList, GalleryForList } from '@darta-types/dist';
import { getFullList, removeArtworkFromList } from '../../api/listRoutes';
import { ArtworkListMemo } from '../../components/Lists/ArtworkListView';
import { UserETypes, UserStoreContext } from '../../state';
import analytics from '@react-native-firebase/analytics';
import { TextElement } from '../../components/Elements/TextElement';


const container = StyleSheet.create({
    textContainer: {
        backgroundColor: Colors.PRIMARY_50,
        height: '100%',
    },
    flexTextContainer: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
})

export function FullListScreen({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {

    const {state, dispatch} = React.useContext(StoreContext);
    const {userDispatch} = React.useContext(UserStoreContext);
    const [fullList, setFullList] = React.useState<FullList | null>(null);
    const [fullArtwork, setFullArtwork] = React.useState<{[key: string] : ArtworkListInformation} | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [noArtwork, setNoArtwork] = React.useState<boolean>(false);
    const [isRefreshing, setRefreshing] = React.useState<boolean>(false);
    const [dataProvider, setDataProvider] = React.useState(
        new DataProvider((r1, r2) => r1 !== r2)
    );
    const [layoutProvider] = React.useState(
        new LayoutProvider(
            () => 1, 
            (_, dim) => {
                dim.width = wp('100%');
                dim.height = hp('85%');
            }
        )
    );

    const setListData = React.useCallback(async () => {
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
                const fullList = await getFullList({listId: route.params.listId})
                if (!fullList) throw new Error('No list found')
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
    }, [route.params.listId, state.userLists])



    React.useEffect(()=>{
        // first check to see if there is a list ID on the params

        setIsLoading(true)

        setListData()
    }, [state.userLists, dataProvider])


    React.useEffect(() => {
        if (fullArtwork) {
            const sortedArtworks = Object.values(fullArtwork).sort((a, b) => {
                if (a.exhibition?.exhibitionDates?.exhibitionEndDate?.value && b.exhibition?.exhibitionDates?.exhibitionEndDate?.value) {
                    const bEnd = new Date(b.exhibition?.exhibitionDates?.exhibitionEndDate?.value)
                    const aEnd = new Date(a.exhibition?.exhibitionDates?.exhibitionEndDate?.value)
                    if (bEnd > aEnd) return 1
                    else if (bEnd < aEnd) return -1
                    else return 0
                }
                else return 0
            })
            if (sortedArtworks.length === 0) {
                setNoArtwork(true)
            } else {
                setDataProvider(dataProvider.cloneWithRows(sortedArtworks));
            }
        }
    }, [fullArtwork]);

    const handleDelete = React.useCallback(async ({artworkId} : {artworkId: string}): Promise<boolean> => {
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
    }, [fullList])

    const refreshControl = React.useCallback(async () => {
        setRefreshing(true)
        const fullList = await getFullList({listId: route.params.listId})
        if (!fullList) return
        dispatch({
            type: ETypes.setUserLists,
            userLists: fullList
        })
        setFullList(Object.values(fullList)[0])
        setFullArtwork(Object.values(fullList)[0].artwork)
        setRefreshing(false)
    }, [route.params.listId])


  const inquireArtwork = React.useCallback(async ({artwork, gallery} : {artwork: Artwork, gallery: GalleryForList}) => {

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
        
        const body = `Hi ${gallery.galleryName?.value}, I saw ${artwork.artworkTitle?.value} by ${artwork.artistName?.value} on darta and I am interested in learning more.`

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
    } 
    }, [])

    const inquireAlert = React.useCallback(({artwork, gallery, exhibition} : {artwork: Artwork, gallery: GalleryForList, exhibition: ExhibitionForList}) => {

        const galleryName = gallery?.galleryName?.value || "the gallery"

        Alert.alert(`Reach out to ${galleryName}?`, `We'll autofill an email from you and let the gallery tell you all about the work!`, [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'destructive',
            },
            {
              text: `Yes`,
              onPress: () => inquireArtwork({artwork, gallery}),
            },
          ])
    }, [])

    const rowRenderer = React.useCallback((_, artwork) => {
        return (
            <View style={{flex: 1, margin: 24}}>
                <ArtworkListMemo 
                    artwork={artwork.artwork}
                    exhibition={artwork.exhibition}
                    gallery={artwork.gallery}
                    inquireAlert={inquireAlert}
                    onDelete={handleDelete}
                    navigation={navigation}
                    navigateToGalleryParams={route?.params?.navigateToGalleryParams}
                />
            </View>
        );
    }, [fullArtwork])

    if (isError){
        return(
            <View style={container.textContainer}>
                <Button onPress={() => navigation.goBack()} textColor={Colors.PRIMARY_950}>Go Back</Button>
            </View>
        )
    } else if (isLoading){
        return(
            <View style={container.textContainer}>
                <Button onPress={() => navigation.goBack()} textColor={Colors.PRIMARY_950}>Loading...</Button>
            </View>
        )
    } else if (noArtwork){
        return(
            <ScrollView 
            style={container.textContainer}
            contentContainerStyle={container.flexTextContainer}
            refreshControl={
                <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={refreshControl}
                        tintColor={Colors.PRIMARY_600}
                    />
            }>
                <TextElement style={container.textHeader}>This list contains no artwork</TextElement>
                <TextElement style={container.text}>Add more artwork to get started</TextElement>
            </ScrollView>
        )
    } 
    else if (fullArtwork && Object.values(fullArtwork).length !== 0){
        return (
            <RecyclerListView
            style={{ flex: 1, backgroundColor: Colors.PRIMARY_50 }}
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            rowRenderer={rowRenderer}
            scrollViewProps={{
                decelerationRate: "fast",
                // snapToInterval: hp('90%'),
                scrollEnabled: true,
                disableIntervalMomentum: true,
                // pagingEnabled: true,
                isScrollEnabled: true,
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