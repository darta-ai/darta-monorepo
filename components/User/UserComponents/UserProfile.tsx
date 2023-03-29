import React from 'react';
import {SafeAreaView, View, ScrollView, Image} from 'react-native';
import {GlobalText} from '../../GlobalElements/GlobalText';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {globalTextStyles} from '../../styles';
import {IconButton} from 'react-native-paper';
import {icons} from '../../globalVariables';
import {galleryInteractionStyles} from '../../Gallery/galleryStyles';
import {LIGHT_GREY, DARK_GREY} from '../../../assets/styles';

export function UserProfile({localButtonSizes}: {localButtonSizes: any}) {
  return (
    <View
      style={{
        marginBottom: hp('2%'),
      }}>
      <Image
        source={{
          uri: 'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
        }}
        style={{
          height: hp('10%'),
          width: hp('10%'),
          borderRadius: 50,
          alignSelf: 'center',
          borderWidth: 1,
          marginBottom: hp('1%'),
        }}
      />
      <GlobalText style={[globalTextStyles.titleText, {alignSelf: 'center'}]}>
        User#102123
      </GlobalText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: hp('3%'),
        }}>
        <View>
          <IconButton
            icon={icons.cog}
            mode="contained-tonal"
            size={localButtonSizes.mediumSmall}
            style={galleryInteractionStyles.secondaryButtonBlackButton}
            iconColor={DARK_GREY}
            accessibilityLabel="view tombstone"
            testID="tombstone"
            onPress={() => console.log('Pressed')}
          />
          <GlobalText style={globalTextStyles.centeredText}>
            settings
          </GlobalText>
        </View>
        <View>
          <IconButton
            icon={icons.save}
            mode="contained-tonal"
            size={localButtonSizes.mediumSmall}
            style={galleryInteractionStyles.secondaryButtonBlackButton}
            iconColor={DARK_GREY}
            accessibilityLabel="view tombstone"
            testID="tombstone"
            onPress={() => console.log('Pressed')}
          />
          <GlobalText style={globalTextStyles.centeredText}>saved</GlobalText>
        </View>
        <View>
          <IconButton
            icon={icons.inquire}
            mode="contained"
            size={localButtonSizes.mediumSmall}
            style={galleryInteractionStyles.secondaryButtonBlackButton}
            iconColor={DARK_GREY}
            accessibilityLabel="view tombstone"
            testID="tombstone"
            onPress={() => console.log('Pressed')}
          />
          <GlobalText style={globalTextStyles.centeredText}>
            inquired
          </GlobalText>
        </View>
      </View>
    </View>
  );
}
