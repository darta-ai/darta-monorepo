import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as SVGs from '../../assets/SVGs/index';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state/Store';
import { UserListComponent } from '../../components/Gallery/UserListComponent';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { Artwork, FullList, List } from '@darta-types/dist';
import { getFullList } from '../../api/listRoutes';
import { TombstonePortrait } from '../../components/Tombstone/TombstonePortrait';
import { ArtworkListView } from '../../components/Lists/ArtworkListView';

const newListStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 24,
        backgroundColor: Colors.PRIMARY_50,
        opacity: 0.9,
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
    const [fullList, setFullList] = React.useState<FullList | null>(null);
    const [fullArtwork, setFullArtwork] = React.useState<{[key: string] : Artwork} | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);


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
                console.log('state.userLists[route.params.listId]', Object.keys(state.userLists[route.params.listId].artwork))
                setFullList(state.userLists[route.params.listId])
                setFullArtwork(state.userLists[route.params.listId].artwork)
                setIsLoading(false)
            } else {
                // if it is not in the state, fetch it from the API
                try{
                    const fullList = await getListData({listId: route.params.listId})
                    dispatch({
                        type: ETypes.setUserLists,
                        userLists: fullList
                    })
                    console.log({fullList})
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

    const handlePress = ({listId} : {listId: string}) => {
        console.log('hey hey hey', listId)
    }
    const [dataProvider, setDataProvider] = React.useState(
        new DataProvider((r1, r2) => r1 !== r2)
    );

    const layoutProvider = new LayoutProvider(
        () => 1, // Assuming all items are of the same type
        (_, dim) => {
            dim.width = wp('100%');
            dim.height = hp('100%'); // Replace with actual height of ArtworkListView
        }
    );

    React.useEffect(() => {
        if (fullArtwork) {
            const sortedArtworks = Object.values(fullArtwork).sort((a, b) => {
                if (!a.createdAt || !b.createdAt) {
                    return 0;
                }
                return Number(new Date(b?.createdAt)) - Number(new Date(a?.createdAt));
            });
            setDataProvider(dataProvider.cloneWithRows(sortedArtworks));
        }
    }, [fullArtwork]);

    const rowRenderer = (_, artwork) => {
        return (
            <ArtworkListView 
                artwork={artwork}
                inquireAlert={() => {}}
                likeArtwork={() => {}}
                saveArtwork={() => {}}
                saveLoading={false}
                likeLoading={false}
            />
        );
    };

    return (
        <View style={newListStyles.container}>
            {isError && <View><Button onPress={() => navigation.goBack()}>Go Back</Button></View>}
            {isLoading && <View><Button onPress={() => navigation.goBack()}>Loading...</Button></View>}
            {fullList && (
            <RecyclerListView
                style={{ flex: 1 }}
                dataProvider={dataProvider}
                layoutProvider={layoutProvider}
                rowRenderer={rowRenderer}
            />
            )}
        </View>
    );
}