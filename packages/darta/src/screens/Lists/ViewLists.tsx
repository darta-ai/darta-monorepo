import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as SVGs from '../../assets/SVGs/index';
import * as Colors from '@darta-styles';
import { ListSavedComponent } from '../../components/Gallery/ListSavedComponent';
import { IconButton, TextInput } from 'react-native-paper';
import { saveArtworkToList } from '../../state/hooks';
import { ETypes, StoreContext } from '../../state/Store';
import { ListPreview, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { UserListComponent } from '../../components/Gallery/UserListComponent';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { TextElement } from '../../components/Elements/TextElement';
import { NewListModal } from '../../components/Lists/NewListModal';
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import { addArtworkToList, readListForUser } from '../../api/listRoutes';
import { createUserArtworkRelationship } from '../../api/artworkRoutes';
import { UserRoutesEnum } from '../../typing/routes';

const addToListStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 24,
        backgroundColor: Colors.PRIMARY_950,
        opacity: 0.9,
    },
    contentContainer: {
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 24,
        paddingBottom: 100,
    },
    addContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'center',
        padding: 16,
        alignSelf: 'center',
        backgroundColor: Colors.PRIMARY_100,
        borderWidth: 1,
        borderColor: Colors.PRIMARY_900,
        height: 78,
        width: 345,
        borderRadius: 19,
    },
    textContainer: {
        backgroundColor: Colors.PRIMARY_50,
        fontFamily: 'DMSans_700Bold',
        color: Colors.PRIMARY_700,
        width: '100%',
    },
    forwardButtonContainer: {
        flex: 0.1,
        height: '100%',
        justifyContent: 'center',
      },
    text: {
        flex: 0.8,
        justifyContent: 'center',
      },
    newList: {
        backgroundColor: Colors.PRIMARY_50, 
        width: wp('40%'), 
        padding: 6
    }, 
    newListText: {
        color: Colors.PRIMARY_950, 
        fontFamily: 'DMSans_700Bold'
    },
    saveButtonContainer: {
        position: 'absolute',
        top: hp('75%'),
        left: wp('35%'),
    }, 
    doneButton: {
        backgroundColor: Colors.PRIMARY_50, 
        width: wp('30%'), 
        padding: 6,
        borderWidth: 2,
        borderColor: Colors.PRIMARY_950,
    }
})


export function ViewListsScreen({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {
    const {state, dispatch} = React.useContext(StoreContext);
    const handlePress = ({listId} : {listId: string}) => {
        if(!state.userListPreviews) return;
        const list = state?.userListPreviews;
        if (list[listId] && list[listId].listName){
            dispatch({
                type: ETypes.setListHeader,
                listHeader: list[listId].listName
            })
        }
        navigation.navigate(UserRoutesEnum.userListFull, {listId})
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
        if (state.userListPreviews) {
            const sortedLists = Object.values(state.userListPreviews).sort((a, b) => {
                return b?.createdAt > a?.createdAt ? 1 : -1;
            });
            setDataProvider(dataProvider.cloneWithRows(sortedLists));
        }
    }, [state.userListPreviews]);

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
        <View style={addToListStyles.container}>
            {state?.userListPreviews && (
                <RecyclerListView
                    layoutProvider={layoutProvider}
                    dataProvider={dataProvider}
                    rowRenderer={rowRenderer}
                />
            )}
        </View>
    );
}