import React from 'react';
import {
  ImageBackground,
  ScrollView,
} from 'react-native';

import styles from '../assets/styles';
import { GlobalText } from '../components/GlobalElements';

function Profile() {
  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.bg}
    >
      <ScrollView style={styles.containerProfile} />
      <GlobalText>Profile</GlobalText>
    </ImageBackground>
  );
}

export default Profile;
