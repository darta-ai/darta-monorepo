import React, {useEffect} from 'react';
import {runOnJS} from 'react-native-reanimated';
import {View, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalText} from '../../GlobalElements/GlobalText';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {globalTextStyles} from '../../styles';
import {IconButton} from 'react-native-paper';
import {icons} from '../../globalVariables';
import {galleryInteractionStyles} from '../../Gallery/galleryStyles';
import {DARK_GRAY, MILK, PRIMARY_BLUE} from '../../../assets/styles';
import {UserRoutesEnum} from '../userRoutes.d';
import {UserRouteStackParamList} from '../userRoutes.d';
import {StackNavigationProp} from '@react-navigation/stack';

type UserScreenNavigationProp = StackNavigationProp<
  UserRouteStackParamList,
  UserRoutesEnum.userSettings
>;

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
  const navigateTo = () => {
    navigation.navigate(UserRoutesEnum.userSettings);
  };

  const onPressFunction = () => {
    runOnJS(navigateTo)();
  };
  return (
    <View
      style={{
        backgroundColor: PRIMARY_BLUE,
        borderRadius: 20,
        padding: hp('1%'),
        height: 'auto',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
      }}>
      <TouchableOpacity>
        <Animated.Image
          source={{
            uri: 'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
          }}
          style={userProfileStyles.image}
        />
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'column',
          width: wp('45%'),
        }}>
        <View>
          <GlobalText
            style={[
              globalTextStyles.titleText,
              {alignSelf: 'center', color: MILK},
            ]}
            numberOfLines={1}>
            User#12321
          </GlobalText>
        </View>
      </View>
      <View
        style={{
          alignSelf: 'center',
        }}>
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
