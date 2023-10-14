import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Colors from '@darta-styles'
import { SignIn } from '../Auth/SignIn';
import { SignUp } from '../Auth/SignUp';


export const NeedAccountDialog = ({
  dialogVisible, 
  setDialogVisible, 
} : {
    dialogVisible: boolean,
    setDialogVisible: (dialogVisible: boolean) => void
  }) => {

  const hideDialog = () => setDialogVisible(false)

  const [isSignIn, setIsSignIn] = React.useState<boolean>(false)


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
            {isSignIn ? 
            (
              <SignIn 
                setDialogVisible={setDialogVisible}
              />
            ) : (
              <SignUp
                setDialogVisible={setDialogVisible}
              />
            )}
            <Button 
              onPress={() => setIsSignIn(!isSignIn)}
              mode="text"
              textColor={Colors.PRIMARY_50}
              style={{
                alignSelf: 'center',
                marginTop: hp('1%'),
              }}>{isSignIn ?  "Don't have an account? Sign Up." : "Already have an account? Sign In." }</Button>
          </Dialog>
        </Portal>
      </View>
  );
};