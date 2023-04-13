import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {GlobalText} from '../../../GlobalElements';
import {globalTextStyles} from '../../../styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {DARK_GRAY, MILK} from '../../../../assets/styles';
import {DEFAULT_Gallery_Image} from '../../../globalVariables';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const defaultImage = DEFAULT_Gallery_Image;

export function CarouselCardItem({item, index}: {item: any; index: number}) {
  return (
    <TouchableOpacity>
      <View style={styles.container} key={index}>
        <View style={styles.fieldSet}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginBottom: hp('1%'),
            }}>
            <View style={{flex: 1}}>
              <Image
                source={{uri: item.logo ?? defaultImage}}
                style={{
                  width: hp('4%'),
                  height: hp('4%'),
                }}
              />
            </View>
            <View style={{alignSelf: 'flex-end'}}>
              <GlobalText style={styles.legend}>{item.type}</GlobalText>
            </View>
          </View>

          <Image source={{uri: item.preview}} style={styles.image} />
          <GlobalText
            style={[
              globalTextStyles.boldTitleText,
              {
                paddingTop: hp('2%'),
                paddingLeft: hp('2%'),
              },
            ]}>
            {item.name}
          </GlobalText>
          <GlobalText
            style={[
              globalTextStyles.baseText,
              {
                paddingTop: hp('2%'),
                paddingLeft: hp('2%'),
              },
            ]}>
            {item.details}
          </GlobalText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH,
    height: hp('30%'),
  },
  body: {
    color: '#222',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
  },
  fieldSet: {
    margin: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  legend: {
    borderRadius: 20,
    top: -10,
    fontFamily: 'EB Garamond',
  },
});
