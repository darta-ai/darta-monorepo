import React from 'react'
import { View, StyleSheet, Animated, TouchableOpacity, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state/Store';
import { UserListComponent } from '../../components/Gallery/UserListComponent';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { UserRoutesEnum } from '../../typing/routes';
import { UIStoreContext, UiETypes, UserStoreContext } from '../../state';
import { Icon } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteListAPI, listUserLists } from '../../api/listRoutes';
import { TextElement } from '../../components/Elements/TextElement';
import { dartaLogo } from '../../components/User/UserInquiredArtwork';
import * as SVGs from '../../assets/SVGs'

const addToListStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 24,
        backgroundColor: Colors.PRIMARY_50,
        opacity: 0.9,
    },
    defaultContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: Colors.PRIMARY_50,
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
}: {
    navigation?: any;
}) {
    const {state, dispatch} = React.useContext(StoreContext);
    const {uiDispatch} = React.useContext(UIStoreContext);

    const handlePress = ({listId} : {listId: string}) => {
        if(!state.userListPreviews) return;
        const list = state?.userListPreviews;
        if (list[listId] && list[listId].listName){
            uiDispatch({
                type: UiETypes.setListHeader,
                listHeader: list[listId].listName
            })
        }
        const listUrl = `https://darta.art/lists?listId=${listId}`
        uiDispatch({
            type: UiETypes.setListURL,
            listUrl
        })
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
                <Swipeable friction={3} renderRightActions={(dragX) => renderRightActions(_, dragX, listPreview?._id)}> 
                    <UserListComponent 
                        listPreview={listPreview}
                        isAdding={false}
                        handlePress={handlePress}
                    />
                </Swipeable>
            </View>
        );
    };

    const [loadingDelete, setLoadingDelete] = React.useState(false);

    const handleDelete = async (listId) => {
        Alert.alert("Delete List", "Are you sure you want to delete this list?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    setLoadingDelete(true);
                    if (listId) {
                        await deleteListAPI({listId});
                        dispatch({
                            type: ETypes.deleteList,
                            listId,
                        })
                        setLoadingDelete(false);
                    }
                    // navigation.goBack()
                },
            },
        ]);
    }

    const renderRightActions = (_, dragX, listId) => {
      
        const trans = dragX.interpolate({
          inputRange: [-50, 0],  // Start from -100 (fully swiped to the right) to 0 (no swipe)
          outputRange: [0, 0], // Corresponding translation: start off-screen and move to fully visible
          extrapolate: 'clamp',   // Clamps the output to the specified range
        });
        const styles = StyleSheet.create({
          container: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: wp('20%'),  // Adjust as needed
            height: '100%',
            // backgroundColor: Colors.PRIMARY_0,
            transform: [{ translateX: trans }],  // Ensure this moves as expected
          },
          buttonWidth: {
            width: '100%',  // Adjust as needed
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          },
          textColor: {
            color: Colors.PRIMARY_50,  // Ensure good contrast
          }
        });
    
        return (
          <Animated.View style={styles.container}>
            <TouchableOpacity style={styles.buttonWidth} onPress={() => handleDelete(listId)}>
                {loadingDelete ? (
                  <ActivityIndicator size="small"/>
                ) : (
                  <Icon name="delete" reverse raised solid={false}/>
                )}
            </TouchableOpacity>
          </Animated.View>
        );
      };

    const [refreshing, setRefreshing] = React.useState(false);
    
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try{
            const lists = await listUserLists();
            dispatch({
                type: ETypes.setUserListPreviews,
                userListPreviews: lists,
            })
        } catch {
            setRefreshing(false);
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 500)
    }, [])

    return (
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
        <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_950} onRefresh={onRefresh} />
        }>  
        <View style={addToListStyles.container}>
            {state?.userListPreviews && Object.values(state.userListPreviews).length > 0 ? (
                <RecyclerListView
                    layoutProvider={layoutProvider}
                    dataProvider={dataProvider}
                    rowRenderer={rowRenderer}
                />
            ) : (
                <View style={addToListStyles.defaultContainer}>
                    <TextElement style={dartaLogo.text}>Your lists are unavailable</TextElement>
                    <View style={{height: '10%', display: 'flex', flexDirection: 'row'}}>
                        <TextElement style={dartaLogo.text}>Create a list by pressing</TextElement>
                        <SVGs.SavedIcon />
                        <TextElement style={dartaLogo.text}>on an artwork</TextElement>
                    </View>
                </View>
            )}
        </View>
        </ScrollView>
    );
}