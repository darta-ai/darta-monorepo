import React, {useEffect} from 'react';
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
import {DARK_BLUE, DARK_GRAY, MILK} from '../../../assets/styles';

export function UserProfile({
  localButtonSizes,
  imageWidthInterpolate,
  imagePositionInterpolate,
  isScrolled,
}: {
  localButtonSizes: any;
  imageWidthInterpolate: any;
  imagePositionInterpolate: any;
  isScrolled: boolean;
}) {
  useEffect(() => {
    console.log({isScrolled});
  }, [isScrolled]);
  const styles = StyleSheet.create({
    image: {
      height: imageWidthInterpolate,
      width: imageWidthInterpolate,
      borderRadius: 50,
      alignSelf: isScrolled ? 'flex-start' : 'center',
    },
  });
  return (
    <View
      style={{
        backgroundColor: DARK_GRAY,
        borderRadius: 20,
        padding: hp('1%'),
        height: 'auto',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'center',
      }}>
      <TouchableOpacity>
        <Animated.Image
          source={{
            uri: 'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
          }}
          style={[styles.image]}
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
        <View>
          {!isScrolled && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: hp('3%'),
                }}>
                <View>
                  <IconButton
                    icon={icons.save}
                    mode="contained-tonal"
                    size={localButtonSizes.mediumSmall}
                    style={galleryInteractionStyles.secondaryButtonBlackButton}
                    iconColor={DARK_GRAY}
                    accessibilityLabel="view tombstone"
                    testID="tombstone"
                    onPress={() => console.log('Pressed')}
                  />
                  <GlobalText
                    style={[globalTextStyles.centeredText, {color: MILK}]}>
                    saved
                  </GlobalText>
                </View>
                <View>
                  <IconButton
                    icon={icons.inquire}
                    mode="contained"
                    size={localButtonSizes.mediumSmall}
                    style={galleryInteractionStyles.secondaryButtonBlackButton}
                    iconColor={DARK_GRAY}
                    accessibilityLabel="view tombstone"
                    testID="tombstone"
                    onPress={() => console.log('Pressed')}
                  />
                  <GlobalText
                    style={[globalTextStyles.centeredText, {color: MILK}]}>
                    inquired
                  </GlobalText>
                </View>
              </View>
            </>
          )}
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
          onPress={() => console.log('Pressed')}
        />
      </View>
    </View>
  );
}
