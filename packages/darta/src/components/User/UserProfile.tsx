import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {Animated, ImageURISource, StyleSheet, View} from 'react-native';
import * as Colors from '@darta-styles';
import {IconButton} from 'react-native-paper';
import {runOnJS} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

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

export function UserProfile({
  localButtonSizes,
  imageWidthInterpolate,
  imageHeightInterpolate,
  navigation,
}: {
  localButtonSizes: any;
  imageWidthInterpolate: any;
  imageHeightInterpolate: any;
  navigation: UserScreenNavigationProp;
}) {
  const userProfileStyles = StyleSheet.create({
    image: {
      height: imageHeightInterpolate,
      width: imageWidthInterpolate,
      borderRadius: 20,
      alignSelf: 'flex-start',
      resizeMode: 'contain',
    },
  });
  const navigateToEditUserSettings = () => {
    navigation.navigate(UserRoutesEnum.userSettings);
  };

  const {state} = useContext(StoreContext);


  const [userProfilePic, setUserProfilePic] = React.useState<ImageURISource>('' as any);
  const [userName, setUserName] = React.useState<string>('');
  const [fullName, setFullName] = React.useState<string>('');

  React.useEffect(() => {
    const defaultImage = require('../../assets/dartahousewhite.png');
    const userProfileURL = state?.user?.profilePicture?.value;
    
    let imageSource: any;
    if (typeof userProfileURL === 'string') {
        imageSource = { uri: userProfileURL };
    } else {
        imageSource = defaultImage;
    }
    
    setUserProfilePic(imageSource);
    
    const name = state?.user?.userName ? state?.user?.userName : "darta user"
    setUserName(name)
    const firstName = state?.user?.legalFirstName ? state?.user?.legalFirstName : ""
    const lastName = state?.user?.legalLastName ? state?.user?.legalLastName : ""
    setFullName(`${firstName} ${lastName}`)

    }, [, state?.user]);

  const onPressFunction = async () => {
    runOnJS(navigateToEditUserSettings)();
  };

  const SSUserProfile = StyleSheet.create({
    container: {
      backgroundColor: Colors.PRIMARY_950,
      borderRadius: 20,
      padding: hp('1%'),
      gap: hp('3%'),
      height: 'auto',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1, 
      alignContent: 'center',
    },
    textContainer: {
      alignSelf: 'center',
      flexDirection: 'column',
      width: wp('40%'),
    },
    iconStyle: {
      position: 'absolute', 
      right: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={SSUserProfile.container}>
      <View style={SSUserProfile.iconStyle}>
        <IconButton
          icon={icons.cog}
          size={localButtonSizes.small}
          style={galleryInteractionStyles.secondaryButtonBlackButton}
          iconColor={Colors.PRIMARY_900}
          accessibilityLabel="settings"
          testID="settings"
          onPress={onPressFunction}
        />
      </View>
      <View>
        {userProfilePic && (
            <Animated.Image
                source={userProfilePic}
                style={userProfileStyles.image}
            />
        )}
      </View>
      <View style={SSUserProfile.textContainer}>
        <View>
          <TextElement
            style={[globalTextStyles.titleText, {color: Colors.PRIMARY_50}]}
            numberOfLines={1}>
            {fullName}
          </TextElement>
          <TextElement
            style={[globalTextStyles.titleText, {color: Colors.PRIMARY_50}]}
            numberOfLines={1}>
            {userName}
          </TextElement>
        </View>
      </View>
    </View>
  );
}
