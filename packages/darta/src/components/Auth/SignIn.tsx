import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, TextInput, useTheme } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles'
import { TextElement } from '../Elements/TextElement';
import { firebaseSignIn } from '../../api/firebase';
import { getDartaUser } from '../../api/userRoutes';
import { UserETypes, UserStoreContext } from '../../state';

export const SignIn = ({
    setDialogVisible, 
} : {
    setDialogVisible: (dialogVisible: boolean) => void
  }) => {

  const hideDialog = () => setDialogVisible(false)

  const {userDispatch} = React.useContext(UserStoreContext);

  const theme = useTheme()
  const { colors } = theme;
  const [email, setEmail] = React.useState<string>()
  const [password, setPassword] = React.useState<string>()
  const [error, setError] = React.useState<string>("")

  const validateData = async () => {
    if (!email || !password) return
    if (email && !email.match(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)){
      setError("Please enter a valid email")
      return false
    }
    
    try {      
      const firebaseRes = await firebaseSignIn({ email, password });
      const user = firebaseRes?.user;
      const dartaUser = await getDartaUser({uid: user?.uid})
      if (user && user.uid && user.email){
        userDispatch({
          type: UserETypes.setUser,
          userData: {
            uid: user.uid,
            email: user.email,
            ...dartaUser
          }
        })            
      }

      setDialogVisible(false)
    } catch (err) {
      if (err.message === 'That email address is already in use!' || err.code === 'That email address is invalid!') {
        setError(err.message); // Assuming you want to handle all errors and set them to `setError`
      } else {
        setError('Something went wrong, please try again later');
      }
    }
  }


  return (
  <View>
    <Dialog.Title >Welcome back</Dialog.Title>
    <Dialog.Content style={{
        display: 'flex', 
        flexDirection: 'column', 
        gap: hp('2%'),
        height: hp('35%'),
        }}
        >
    <TextInput
    style={{backgroundColor: Colors.PRIMARY_200}}
    theme={{...theme, colors: {...colors, primary: Colors.PRIMARY_900}}}
    label="Email"
    value={email}
    onChangeText={text => setEmail(text)}
    />
    <TextInput
    style={{backgroundColor: Colors.PRIMARY_200}}
    theme={{...theme, colors: {...colors, primary: Colors.PRIMARY_900}}}
    label="Password"
    secureTextEntry={true} 
    value={password}
    onChangeText={text => setPassword(text)}
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
        <Button mode="contained" buttonColor={Colors.PRIMARY_50} textColor={Colors.PRIMARY_950}  onPress={validateData}>Sign In</Button>
    </View>
    </View>
  );
};