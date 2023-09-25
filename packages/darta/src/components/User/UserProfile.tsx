import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {runOnJS} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {DARK_GRAY, MILK, PRIMARY_BLUE} from '@darta-styles';
import {TextElement} from '../Elements/_index';
import {icons} from '../../utils/constants';
import {
  UserRoutesEnum,
  UserRouteStackParamList,
} from '../../typing/routes';
import {StoreContext} from '../../state/Store'
import {globalTextStyles, galleryInteractionStyles} from '../../styles/styles';

type UserScreenNavigationProp = StackNavigationProp<
  UserRouteStackParamList,
  UserRoutesEnum.userSettings
>;

export type PatUserData = {
  profilePicture: string;
  userName: string;
  legalFirstName: string;
  legalLastName: string;
  email: string;
  uniqueId?: string;
};

export function UserProfile({
  localButtonSizes,
  imageWidthInterpolate,
  navigation,
}: {
  localButtonSizes: any;
  imageWidthInterpolate: any;
  navigation: UserScreenNavigationProp;
}) {
  const userProfileStyles = StyleSheet.create({
    image: {
      height: imageWidthInterpolate,
      width: imageWidthInterpolate,
      borderRadius: 50,
      alignSelf: 'flex-start',
    },
  });
  const navigateToEditUserSettings = () => {
    navigation.navigate(UserRoutesEnum.userSettings);
  };

  const onPressFunction = () => {
    runOnJS(navigateToEditUserSettings)();
  };

  const {state} = useContext(StoreContext);

  const SSUserProfile = StyleSheet.create({
    container: {
      backgroundColor: PRIMARY_BLUE,
      borderRadius: 20,
      padding: hp('1%'),
      height: 'auto',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignContent: 'center',
    },
    textContainer: {
      alignSelf: 'center',
      flexDirection: 'column',
      width: wp('45%'),
    },
    iconStyle: {alignSelf: 'center'},
  });

  return (
    <View style={SSUserProfile.container}>
      <View>
        <Animated.Image
          source={{
            uri: state.userSettings.profilePicture,
          }}
          style={userProfileStyles.image}
        />
      </View>
      <View style={SSUserProfile.textContainer}>
        <View>
          <TextElement
            style={[globalTextStyles.titleText, {color: MILK}]}
            numberOfLines={1}>
            {state.userSettings.userName}
          </TextElement>
        </View>
      </View>
      <View style={SSUserProfile.iconStyle}>
        <IconButton
          icon={icons.cog}
          size={localButtonSizes.small}
          style={[galleryInteractionStyles.secondaryButtonBlackButton]}
          iconColor={DARK_GRAY}
          accessibilityLabel="settings"
          testID="settings"
          onPress={onPressFunction}
        />
      </View>
    </View>
  );
}
