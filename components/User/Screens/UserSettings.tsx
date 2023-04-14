import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {globalTextStyles} from '../../styles';
import {UserSettingsSignedIn} from '../UserComponents/UserSettings/SignedInUserSettings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {deviceInformation} from '../../../App';
import {PRIMARY_DARK_GREY} from '../../../assets/styles';
import { StoreContext } from '../../Gallery/galleryStore';

export function UserSettings() {

  const {state} = useContext(StoreContext);

  // can delete - for uuid settings
  const [uniqueId, setUniqueId] = useState<string>('');
  useEffect(() => {
    const getDeviceInformation = async () => {
      const {uniqueId} = await deviceInformation();
      setUniqueId(uniqueId);
    };
    getDeviceInformation();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'center',
        alignSelf: 'center',
        width: wp('100%'),
        marginBottom: hp('5%'),
      }}>
      <View>
        <UserSettingsSignedIn uniqueId={uniqueId} />
      </View>
    </View>
  );
}

export const settingsStyles = StyleSheet.create({
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    margin: hp('3%'),
  },
  image: {
    height: hp('8%'),
    width: hp('8%'),
    borderRadius: 20,
  },
  header: {
    ...globalTextStyles.italicTitleText,
    alignSelf: 'center',
    marginBottom: hp('0.5%'),
  },
  text: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 15,
    alignSelf: 'flex-start',
    color: PRIMARY_DARK_GREY,
  },
  textEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: wp('80%'),
    height: hp('4.5%'),
  },
});
