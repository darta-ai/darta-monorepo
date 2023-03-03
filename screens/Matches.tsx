import React from 'react';
// import Orientation from 'react-native-orientation-locker';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import { CardItem, Icon } from '../components';
import DEMO from '../assets/data/demo';
import styles, { DARK_GRAY } from '../assets/styles';
import { GlobalText } from '../components/GlobalElements/index';

function Matches() {
  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.bg}
    >
      <View style={styles.containerMatches}>
        <View style={styles.top}>
          <GlobalText style={styles.title}>Matches</GlobalText>
          <TouchableOpacity>
            <Icon name="ellipsis-vertical" color={DARK_GRAY} size={20} />
          </TouchableOpacity>
        </View>

        <FlatList
          numColumns={2}
          data={DEMO}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <CardItem
                image={item.image}
                name={item.name}
                isOnline={item.isOnline}
                hasVariant
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

export default Matches;
