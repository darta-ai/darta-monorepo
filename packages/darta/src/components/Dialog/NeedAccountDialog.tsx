import * as React from 'react';
import { View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
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
              <SignUp
                setDialogVisible={setDialogVisible}
              />
          </Dialog>
        </Portal>
      </View>
  );
};