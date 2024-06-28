import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {Animated, ImageURISource, StyleSheet, View} from 'react-native';


import {TextElement} from '../Elements/_index';
import {
  UserRoutesEnum,
  UserRouteStackParamList,
} from '../../typing/routes';
import {globalTextStyles} from '../../styles/styles';
import { UserStoreContext } from '../../state/UserStore';
import * as Colors from '@darta-styles';

type UserScreenNavigationProp = StackNavigationProp<
  UserRouteStackParamList,
  UserRoutesEnum.userSettings
>;

export function UserProfile({
  imageWidthInterpolate,
  imageHeightInterpolate,
}: {
  imageWidthInterpolate: any;
  imageHeightInterpolate: any;
}) {
  const userProfileStyles = StyleSheet.create({
    image: {
      height: imageHeightInterpolate,
      width: imageWidthInterpolate,
      borderRadius: 100,
      alignSelf: 'flex-start',
      resizeMode: 'contain',
      borderWidth: 2,
      borderColor: Colors.PRIMARY_950,
    },
  });

  const {userState} = useContext(UserStoreContext);


  const [userProfilePic, setUserProfilePic] = React.useState<ImageURISource>('' as any);
  const [userName, setUsername] = React.useState<string>(userState?.user?.userName ? userState?.user?.userName : "");
  const [fullName, setFullName] = React.useState<string>('');

  React.useEffect(() => {
    const defaultImage = require('../../assets/darta-android-icon.png');
    const userProfileURL = userState?.user?.profilePicture?.value;
    
    let imageSource: any;
    if (typeof userProfileURL === 'string') {
        imageSource = { uri: userProfileURL };
    } else {
        imageSource = defaultImage;
    }
    
    setUserProfilePic(imageSource);
    
    const firstName = userState?.user?.legalFirstName ? userState?.user?.legalFirstName : "Art"
    const lastName = userState?.user?.legalLastName ? userState?.user?.legalLastName : "Enthusiast"
    const userName = userState?.user?.userName ? userState?.user?.userName : "Art Enthusiast"
    setUsername(userName)
    setFullName(`${firstName} ${lastName}`)

    }, [, userState?.user]);

  const SSUserProfile = StyleSheet.create({
    container: {
      gap: 24,
      height: 'auto',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    textContainer: {
      alignSelf: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      width: '100%',
    }
  });

  return (
    <View style={SSUserProfile.container}>
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
            style={globalTextStyles.sectionHeaderTitle}
            numberOfLines={1}>
            {fullName}
          </TextElement>
          <TextElement
            style={globalTextStyles.paragraphText}
            numberOfLines={1}>
            {userName}
          </TextElement>
        </View>
      </View>
    </View>
  );
}
