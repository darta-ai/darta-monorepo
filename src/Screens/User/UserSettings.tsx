import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// import {deviceInformation} from '../../../App';
import {UserSettingsSignedIn} from '../../Components/User/UserSettings/SignedInUserSettings';

export const SSUserSettings = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginBottom: hp('5%'),
  },
});

export function UserSettings() {
  // can delete - for uuid settings
  // const [uniqueId, setUniqueId] = useState<string>('');
  // useEffect(() => {
  //   const getDeviceInformation = async () => {
  //     const {uniqueId} = await deviceInformation();
  //     setUniqueId(uniqueId);
  //   };
  //   getDeviceInformation();
  // }, []);

  return (
    <View style={SSUserSettings.container}>
      <View>
        <UserSettingsSignedIn />
      </View>
    </View>
  );
}
