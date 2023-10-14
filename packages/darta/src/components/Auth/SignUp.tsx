import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, TextInput } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles'
import { TextElement } from '../Elements/TextElement';
import { editDartaUserAccount } from '../../api/userRoutes';
import { firebaseSignUp } from '../../api/firebase';
import { ETypes, StoreContext } from '../../state/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_UID_KEY} from '../../utils/constants'


export const SignUp = ({
  setDialogVisible, 
} : {
    setDialogVisible: (dialogVisible: boolean) => void
  }) => {

  const hideDialog = () => setDialogVisible(false)

  const {state, dispatch} = React.useContext(StoreContext);

  const [email, setEmail] = React.useState<string>()
  const [password, setPassword] = React.useState<string>()
  const [confirmPassword, setConfirmPassword] = React.useState<string>()
  const [error, setError] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

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
    
    try {      
      setLoading(true)
      const firebaseRes = await firebaseSignUp({ email, password });
      const user = firebaseRes?.user;
      if (user && user.uid && user.email){
        dispatch({
          type: ETypes.setUser,
          userData: {
            uid: user.uid,
            email: user.email,
          }
        })            
      }
      const localStorageUid = state?.user?.localStorageUid ?? await AsyncStorage.getItem(USER_UID_KEY);
          
      if (localStorageUid && firebaseRes?.user?.uid) {
        await editDartaUserAccount({ uid: firebaseRes.user.uid, email, localStorageUid: localStorageUid });
      }
      setDialogVisible(false)
    } catch (err) {
      if (err.message === 'That email address is already in use!' || err.code === 'That email address is invalid!') {
        setError(err.message); // Assuming you want to handle all errors and set them to `setError`
      } else {
        setError('Something went wrong, please try again later');
      }
    } finally {
      setLoading(false)
    }
  }


  return (
  <View>
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
        <Button mode="outlined"  buttonColor={Colors.PRIMARY_900} textColor={Colors.PRIMARY_50} onPress={hideDialog}>Nevermind</Button>
        <Button mode="contained" loading={loading} buttonColor={Colors.PRIMARY_50} textColor={Colors.PRIMARY_950}  onPress={validateData}>Create Account</Button>
    </View>
    </View>
  );
};