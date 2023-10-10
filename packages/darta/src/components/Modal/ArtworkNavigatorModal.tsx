import React, {useContext} from 'react';
import {Alert, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {StoreContext} from '../../state/Store';
import {TombstonePortrait} from '../Tombstone/_index';
import {NeedAccountDialog} from '../Dialog/NeedAccountDialog';
import { createDartaAccount } from '../../api/userRoutes';

export function ArtworkNavigatorModal({route}: {route: any}) {
  let artOnDisplay: any = null;
  if (route.params){
    ({artOnDisplay} = route.params);
  }

  const [dialogVisible, setDialogVisible] = React.useState(false)

  const {state} = useContext(StoreContext);


  const likeArtwork = () => {

  }

  const inquireAlert = () =>
  {
    const email = auth().currentUser?.email;
    if (email){
      Alert.alert("We'll reach out", 'How would you like to get in contact?', [
        {
          text: `Email: ${email}`,
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'destructive',
        },
      ])
    } else {
      setDialogVisible(true)
    }
  };

  return (
    <View>
      <TombstonePortrait 
        artwork={artOnDisplay}
        inquireAlert={inquireAlert}
      />
      <NeedAccountDialog 
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
      />
    </View>
  );
}
