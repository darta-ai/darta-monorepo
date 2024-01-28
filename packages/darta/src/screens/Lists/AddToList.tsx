import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as SVGs from '../../assets/SVGs/index';
import * as Colors from '@darta-styles';
import { ListSavedComponent } from '../../components/Gallery/ListSavedComponent';
import { ETypes, StoreContext } from '../../state/Store';
import { Artwork, ListPreview, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { UserListComponent } from '../../components/Gallery/UserListComponent';
import { TextElement } from '../../components/Elements/TextElement';
import { NewListModal } from '../../components/Lists/NewListModal';
import { addArtworkToList } from '../../api/listRoutes';
import { createUserArtworkRelationship } from '../../api/artworkRoutes';
import { UserETypes, UserStoreContext } from '../../state/UserStore';

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


export function AddToListScreen({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {

    const {state, dispatch} = React.useContext(StoreContext);
    const {userState, userDispatch} = React.useContext(UserStoreContext);
    const [visible, setVisible] = React.useState<boolean>(false)
    const [saveToSaved, setSaveToSaved] = React.useState<boolean>(false)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    type listArtworkIds = {
        [key: string]: string[]
    }

    const [pressedLists, setPressedLists] = React.useState<listArtworkIds>({})

    const [isSaved, setIsSaved] = React.useState<boolean>(false)
    const [artworkId, setArtworkId] = React.useState<string>()
    const [artwork, setArtwork] = React.useState<Artwork | null>(null)


    React.useEffect(() => {
        if (route.params && route.params.artwork && route.params.artwork._id) {
            setArtworkId(route.params.artwork._id)
            setArtwork(route.params.artwork)
        }
        if (route.params && route.params.artwork._id &&  userState.userSavedArtwork && userState.userSavedArtwork[route.params.artwork._id]) {
            setIsSaved(true)
        }
    }, [])

    const handlePress = ({listId} : {listId: string}) => {
        if (!artworkId) return
        if (listId === 'saved') {
            setSaveToSaved(!saveToSaved)
        }
        if (pressedLists[listId]?.includes(artworkId)) {
            const newList = pressedLists[listId].filter((id: string) => id !== artworkId)
            setPressedLists({...pressedLists, [listId]: newList})
        }
        else {
            if (!pressedLists[listId]) {
                setPressedLists({...pressedLists, [listId]: [artworkId]})
            } else {
                setPressedLists({...pressedLists, [listId]: [...pressedLists?.[listId], artworkId]})
            }
        }
    }

    const handleDone = async () => {
        setIsLoading(true)

        if (saveToSaved && artworkId) {
            await createUserArtworkRelationship({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE});
            userDispatch({
                type: UserETypes.setUserSavedArtworkMulti,
                artworkIds: {[artworkId]: true},
            })
            userDispatch({
                type: UserETypes.saveArtwork,
                artworkData: artwork!,
            })
        }
    
        try {
            const promises = Object.keys(pressedLists).map(listId => {
                return addArtworkToList({ listId, artworkId: artworkId ?? "" }).then((res) => {
                    dispatch({
                        type: ETypes.setUserLists,
                        userLists: res
                    });
                });
            });
            Promise.all(promises)
            setIsLoading(false)
            navigation.goBack()
        } catch (error) {
            // Handle any errors here
            console.error('An error occurred:', error);
        }
    }
    return (
        <View style={addToListStyles.container}>
            <ScrollView  contentContainerStyle={addToListStyles.contentContainer}>
                <Button 
                style={addToListStyles.newList}
                onPress={() => setVisible(!visible)}>
                    <TextElement style={addToListStyles.newListText}>New List</TextElement>
                </Button>
                {!isSaved && (
                    <ListSavedComponent 
                    headline="Saved"
                    subHeadline="Add to your saved list"
                    iconComponent={SVGs.SavedActiveIconLarge}
                    isAdding={true}
                    handlePress={handlePress}
                    />
                )}
                {state.userListPreviews && Object.values(state.userListPreviews).sort((a, b) => {
                    return b?.createdAt > a?.createdAt ? 1 : -1;
                }).map((listPreview: ListPreview ) => {
                    return (
                    <View key={listPreview._id}>
                        <UserListComponent 
                        listPreview={listPreview}
                        isAdding={true}
                        handlePress={handlePress}
                        />
                    </View>
                    )
                })}
                <NewListModal 
                navigation={navigation}
                artworkId={artworkId as string}
                visible={visible}
                setVisible={setVisible}
                artwork={artwork}
                />
            </ScrollView>
            <View style={addToListStyles.saveButtonContainer}>
                <Button 
                style={addToListStyles.doneButton}
                loading={isLoading}
                disabled={isLoading}
                onPress={handleDone}>
                    <TextElement style={{color: Colors.PRIMARY_950, fontFamily: 'DMSans_700Bold'}}>Done</TextElement>
                </Button>
            </View>
        </View>
    )
}