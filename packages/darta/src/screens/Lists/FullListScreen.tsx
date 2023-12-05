import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as SVGs from '../../assets/SVGs/index';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state/Store';
import { UserListComponent } from '../../components/Gallery/UserListComponent';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { Artwork, List } from '@darta-types/dist';
import { getFullList } from '../../api/listRoutes';

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
    const [fullList, setFullList] = React.useState<List | null>(null);
    const [fullArtwork, setFullArtwork] = React.useState<{[key: string] : Artwork} | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);


    const getListData = async ({listId} : {listId: string}): Promise<{[key: string] : List}> => {
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
                setIsLoading(false)
            } else {
                // if it is not in the state, fetch it from the API
                try{
                    const fullList = await getListData({listId: route.params.listId})
                    dispatch({
                        type: ETypes.setUserLists,
                        userLists: fullList
                    })
                    setFullList(Object.values(fullList)[0])
                } catch (error){
                    setIsError(true)
                }
            }
        }
        setIsLoading(true)

        setListData()
    }, [])

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
            dim.height = 78 + 18; // Replace with actual height of UserListComponent
        }
    );

    React.useEffect(() => {
        if (state.userLists) {
            const sortedLists = Object.values(state.userLists).sort((a, b) => {
                return b?.createdAt > a?.createdAt ? 1 : -1;
            });
            setDataProvider(dataProvider.cloneWithRows(sortedLists));
        }
    }, [state.userLists]);

    const rowRenderer = (_, listPreview) => {
        return (
            <View key={listPreview?._id}>
                <UserListComponent 
                    listPreview={listPreview}
                    isAdding={false}
                    handlePress={handlePress}
                />
            </View>
        );
    };

    return (
        <View style={newListStyles.container}>

        </View>
    );
}