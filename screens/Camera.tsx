import React from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DEMO from '../assets/data/demo';
import styles, { DARK_GRAY } from '../assets/styles';
import { Icon, Message } from '../components';
import { CameraPage } from '../components/Camera/CameraPage';
import { CameraRequest } from '../components/Camera/CameraRequest';
import { GlobalText } from '../components/GlobalElements';

function Camera() {
  return (

    <CameraPage />

  );
}

export default Camera;
