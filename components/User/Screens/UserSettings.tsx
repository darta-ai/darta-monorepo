import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {globalTextStyles} from '../../styles';
import {UserSettingsSignedIn} from '../UserComponents/UserSettings/SignedInUserSettings';
import {useForm} from 'react-hook-form';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {deviceInformation} from '../../../App';
import {PRIMARY_DARK_GREY} from '../../../assets/styles';

export function UserSettings() {
  const onSubmit = (data: any) => console.log(data);

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
    height: hp('3%'),
    marginBottom: hp('0.5%'),
  },
  text: {
    ...globalTextStyles.boldTitleText,
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
