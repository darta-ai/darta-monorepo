import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles'
import { TextElement } from '../Elements/TextElement';
import { editDartaUserAccount } from '../../api/userRoutes';
import { firebaseSignUp } from '../../api/firebase';
import { StoreContext } from '../../state/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_UID_KEY} from '../../utils/constants'


export const NeedAccountDialog = ({
  dialogVisible, 
  setDialogVisible, 
} : {
    dialogVisible: boolean,
    setDialogVisible: (dialogVisible: boolean) => void
  }) => {

  const hideDialog = () => setDialogVisible(false)

  const {state} = React.useContext(StoreContext);

  const [email, setEmail] = React.useState<string>()
  const [password, setPassword] = React.useState<string>()
  const [confirmPassword, setConfirmPassword] = React.useState<string>()
  const [error, setError] = React.useState<string>("")

  const validateData = async () => {
    if (!email || !password || !confirmPassword){
      setError("Please fill out all fields")
      return false
    }
    if (password !== confirmPassword){
      setError("Passwords do not match")
      return false
    }
    if (!email.match(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)){
      setError("Please enter a valid email")
      return false
    }
    let firebaseRes
    try{
      firebaseRes = await firebaseSignUp({email, password});
    } catch (err) {
      setError(err.message)
      return false
    }
    try{
      const localStorageUid = state.user?.localStorageUid ?? await AsyncStorage.getItem(USER_UID_KEY);
      if(localStorageUid) {
        const results = await editDartaUserAccount({uid: firebaseRes.user, email, localStorageUid: localStorageUid})
        console.log({results})
      }
    } catch (err){

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
            dismissable={false}
            >
            <Dialog.Title >You need an account first</Dialog.Title>
            <Dialog.Content style={{
              display: 'flex', 
              flexDirection: 'column', 
              gap: hp('2%'),
              height: hp('35%'),
            }}
              >
            <TextInput
            style={{backgroundColor: Colors.PRIMARY_700}}
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            />
            <TextInput
            style={{backgroundColor: Colors.PRIMARY_700}}
            label="Password"
            secureTextEntry={true} 
            value={password}
            onChangeText={text => setPassword(text)}
            />
            <TextInput
            style={{backgroundColor: Colors.PRIMARY_700}}
            label="Confirm Password"
            secureTextEntry={true} 
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            />
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
              <Button mode="outlined" buttonColor={Colors.PRIMARY_900} textColor={Colors.PRIMARY_50} onPress={hideDialog}>Nevermind</Button>
              <Button mode="contained" buttonColor={Colors.PRIMARY_50} textColor={Colors.PRIMARY_950}  onPress={validateData}>Create Account</Button>
            </View>
          </Dialog>
        </Portal>
      </View>
  );
};