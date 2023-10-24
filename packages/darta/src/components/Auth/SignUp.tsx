import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, TextInput, useTheme } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles'
import { TextElement } from '../Elements/TextElement';
import { ETypes, StoreContext } from '../../state/Store';
import { editDartaUserAccountAPI } from '../../utils/apiCalls';


export const SignUp = ({
  setDialogVisible, 
} : {
    setDialogVisible: (dialogVisible: boolean) => void
  }) => {

  const hideDialog = () => setDialogVisible(false)

  const {state, dispatch} = React.useContext(StoreContext);

  const theme = useTheme()
  const { colors } = theme;
  const [email, setEmail] = React.useState<string>(state.user?.email ?? "")
  const [firstName, setFirstName] = React.useState<string>(state.user?.legalFirstName ?? "")
  const [lastName, setLastName] = React.useState<string>(state.user?.legalLastName ?? "")
  const [error, setError] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

  const validateData = async () => {
    if (!email || !firstName || !lastName){
      setError("Please fill out all fields")
      return false
    }
    if (!email.match(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)){
      setError("Please enter a valid email")
      return false
    }
    
    try {      
      setLoading(true)
      const res = await editDartaUserAccountAPI({data : { email, legalFirstName: firstName, legalLastName: lastName }});
      console.log({res})
      if (res){
        dispatch({
          type: ETypes.setUser,
          userData: {
            ...res
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
    } finally {
      setLoading(false)
    }
  }


  return (
  <View>
    <Dialog.Title style={{color: Colors.PRIMARY_50}}>You'll need an account first</Dialog.Title>
    <Dialog.Content style={{
        display: 'flex', 
        flexDirection: 'column', 
        gap: hp('2%'),
        height: hp('35%'),
        }}
        >
    <TextInput
    style={{backgroundColor: Colors.PRIMARY_200}}
    label="Email"
    theme={{...theme, colors: {...colors, primary: Colors.PRIMARY_900}}}
    value={email}
    onChangeText={text => setEmail(text)}
    />
    <TextInput
    style={{backgroundColor: Colors.PRIMARY_200}}
    underlineColor="transparent"
    label="First Name"
    theme={{...theme, colors: {...colors, primary: Colors.PRIMARY_900}}}
    value={firstName}
    onChangeText={text => setFirstName(text)}
    />
    <TextInput
    style={{backgroundColor: Colors.PRIMARY_200}}
    label="Last Name"
    theme={{...theme, colors: {...colors, primary: Colors.PRIMARY_900}}}
    value={lastName}
    onChangeText={text => setLastName(text)}
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