import React from 'react'
import { View, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as SVGs from '../../assets/SVGs/index';
import * as Colors from '@darta-styles';
import { ListSavedComponent } from '../../components/Gallery/ListSavedComponent';
import { IconButton, TextInput } from 'react-native-paper';
import { saveArtworkToList } from '../../state/hooks';

const addToListStyles = StyleSheet.create({
    container: {
        height: hp('50%'),
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 24,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY_950,
        opacity: 0.9,
        gap: 24,
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
})


export function AddToListScreen({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {
    let artworkId;
    if (route.params && route.params.artwork && route.params.artwork._id) {
        artworkId = route.params.artwork._id;
    }
    const [listName, setListName] = React.useState<string>("")
    const saveList = async () => {
        try{
            await saveArtworkToList({artworkId, newList:{
                listName: 'New List',
            }})
        } catch (e) {   
            console.log(e)
        }
    }
    return (
        <View style={addToListStyles.container}>
            <View style={addToListStyles.addContainer}>
                <View style={addToListStyles.text}>
                <TextInput 
                label="New List"
                inputAccessoryViewID="userNameInput"
                testID="userNameInput"
                value={listName}
                onChange={(e) => setListName(e.nativeEvent.text)}
                mode="outlined"
                activeOutlineColor={Colors.PRIMARY_800}
                textColor={Colors.PRIMARY_700}
                theme={{
                fonts: {default: {fontFamily: 'DMSans_400Regular'}}
                }}
                style={{width: '100%'}}
                />
                </View>
                <View style={addToListStyles.forwardButtonContainer}>
                    <IconButton onPress={() => saveList()} icon={() => <SVGs.PlusCircleIcon />}/>
                </View>
            </View>
            <ListSavedComponent 
              headline="Saved"
              subHeadline="Add to your saved list"
              iconComponent={SVGs.SavedActiveIconLarge}
              isAdding={true}
              artworkId={artworkId}
            />
        </View>
    )
}