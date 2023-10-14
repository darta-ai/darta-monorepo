import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles'
import { TextElement } from '../Elements/TextElement';
import { firebaseDeleteUser } from '../../api/firebase';
import { ETypes, StoreContext } from '../../state/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_UID_KEY} from '../../utils/constants'
import {deleteDartaUser, createUser} from '../../api/userRoutes'
import { useNavigation } from '@react-navigation/native';


export const DeleteAccountDialog = ({
  dialogVisible, 
  setDialogVisible, 
} : {
    dialogVisible: boolean,
    setDialogVisible: (dialogVisible: boolean) => void,
  }) => {

  const navigation = useNavigation();

  const hideDialog = () => setDialogVisible(false)

  const {state, dispatch} = React.useContext(StoreContext);

  const [error, setError] = React.useState<string>("")

  const [password, setPassword] = React.useState<string>("")

  const [loading, setLoading] = React.useState<boolean>(false)
    
  const deleteAccount = async () => {

    setLoading(true)
    try {      
      const localStorageUid = state?.user?.localStorageUid ?? await AsyncStorage.getItem(USER_UID_KEY);
      await firebaseDeleteUser({password});
      if (localStorageUid) {
        await deleteDartaUser({ localStorageUid: localStorageUid });
        await createUser({localStorageUid})
        hideDialog()
      }
      
    } catch (err) {
      if (err.message === 'That email address is already in use!' || err.code === 'That email address is invalid!') {
        setError(err.message); // Assuming you want to handle all errors and set them to `setError`
      } else {
        console.log(err)
        setError('Something went wrong, please try again later');
      }
    } finally{
      navigation.goBack()
      setLoading(false)
    }
  }


  return (
      <View>
        <Portal>
          <Dialog style={{
            backgroundColor: Colors.PRIMARY_900,
            display: 'flex',
            justifyContent: 'space-around',
            }} 
            visible={dialogVisible} 
            onDismiss={hideDialog}
            >
            <Dialog.Title >Enter Password To Confirm Delete</Dialog.Title>
            <TextInput
            style={{backgroundColor: Colors.PRIMARY_700}}
            label="Password"
            secureTextEntry={true} 
            value={password}
            onChangeText={text => setPassword(text)}
            />
            <Dialog.Content style={{
              display: 'flex', 
              flexDirection: 'column', 
              gap: hp('2%'),
            }}
              >
            {error && (
              <TextElement style={{color: Colors.PRIMARY_50, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{error}</TextElement>
            )}
            </Dialog.Content>
            <View style={{
              display: 'flex', 
              flexDirection: 'row',
              width: '100%', 
              height: hp('7.5%'), 
              gap: wp('1%'),
              justifyContent:"space-around"
              }}>
              <Button mode="outlined" buttonColor={Colors.PRIMARY_900} loading={loading} textColor={Colors.PRIMARY_50} onPress={deleteAccount}>Delete Account</Button>
              <Button mode="contained" buttonColor={Colors.PRIMARY_50} textColor={Colors.PRIMARY_950}  onPress={hideDialog}>Nevermind</Button>
            </View>
          </Dialog>
        </Portal>
      </View>
  );
};