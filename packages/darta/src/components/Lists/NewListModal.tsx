import React from 'react'
import { View, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import * as SVGs from '../../assets/SVGs/index';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state/Store';
import { TextElement, TextElementMultiLine } from '../Elements/TextElement';
import {Portal, Modal, Button, Switch, TextInput, Snackbar} from 'react-native-paper'
import { createArtworkListAPI } from '../../utils/apiCalls';
import { FailureToast } from '../Toasts/FailureToast';

const addToListStyles = StyleSheet.create({
    container: {
        height: hp('25%'),
        width: wp('90%'),
        padding: 24,
        alignSelf: 'center',
        backgroundColor: Colors.PRIMARY_50,
        // opacity: 0.9,
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
    },
    switchContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // height: 48,
        width: '100%',
        alignItems: 'center',
    },
    switchTextHeader:{
        fontFamily: 'DMSans_700Bold',
        color: Colors.PRIMARY_700,
        fontSize: 16,
    },
    switchTextDescription:{
        fontFamily: 'DMSans_400Regular',
        color: Colors.PRIMARY_700,
        fontSize: 12,
    },
    createButton:{
        width: wp('40%'),
        backgroundColor: Colors.PRIMARY_900,
    }, 
    buttonText: {
        color: Colors.PRIMARY_50,
        fontFamily: 'DMSans_700Bold',
    }
})


export function NewListModal({
    navigation,
    artworkId,
    visible,
    setVisible
}: {
    navigation: any;
    artworkId: string;
    visible: boolean,
    setVisible: (visible: boolean) => void
}) {

    const {dispatch} = React.useContext(StoreContext);
    const [listName, setListName] = React.useState<string>("")
    const [isCollaborative, setIsCollaborative] = React.useState<boolean>(false)
    const [isPrivate, setIsPrivate] = React.useState<boolean>(false)
    const [errorText, setErrorText] = React.useState<string>("")
    const [apiErrorText, setApiErrorText] = React.useState<string>("");
    const saveList = async () => {
        try{
            if(!listName) {
                setErrorText("Please enter a list name")
                return
            } else {
                setErrorText("")
            }
            const data = await createArtworkListAPI({artworkId, newList:{
                listName,
                isCollaborative,
                isPrivate,
            }})
            if (data && data._id) {
                dispatch({
                    type: ETypes.setUserListPreviews,
                    userListPreviews: {[data._id]: data},
                })
                setVisible(!visible)
                setListName("")
                navigation.goBack()
            } else {
                setApiErrorText("something went wrong please try again later")
            }
        } catch (e) {   
            setApiErrorText("something went wrong please try again later")
        }
    }


    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(!visible)}>
                <View style={addToListStyles.container}>
                    <TextInput 
                    value={listName}
                    label="List Name"
                    style={{width: '100%', backgroundColor: Colors.PRIMARY_200, fontFamily: 'DMSans_700Bold', color: Colors.PRIMARY_700}}
                    onChangeText={text => setListName(text)}
                    underlineColor="transparent" 
                    theme={{
                        colors: {
                        primary: Colors.PRIMARY_900,
                        },
                    }}
                    />
                    {errorText && <TextElement>{errorText}</TextElement>}
                    {/* <View style={addToListStyles.switchContainer}>
                        <View style={{width: '70%'}}>
                            <TextElement style={addToListStyles.switchTextHeader}>Private</TextElement>
                            <TextElementMultiLine style={addToListStyles.switchTextDescription}>When private, you can share this list but other users cannot</TextElementMultiLine>
                        </View>
                        <Switch 
                        theme={{
                            colors: {
                                primary: Colors.PRIMARY_950,
                            },
                        }}
                        value={isPrivate} onValueChange={setIsPrivate} />
                    </View> */}

                    <Button style={addToListStyles.createButton} onPress={saveList} mode={'outlined'}>
                        <TextElement style={addToListStyles.buttonText}>Create</TextElement>
                    </Button>
                    <View>
                        {apiErrorText && <TextElement>{apiErrorText}</TextElement>}
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}