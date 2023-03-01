/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ArtworkPortrait } from '../Tombstone/TombstonePortrait';
import { DataT } from '../../types';
import { GlobalText } from '../GlobalElements';
import { globalTextStyles } from '../styles';

export function GalleryActionSheet(
  props: SheetProps<{ artOnDisplay: DataT, isPortrait: boolean}>,
) {
  const { sheetId } = props;
  const artOnDisplay = props.payload?.artOnDisplay;
  return (
    <ActionSheet id={sheetId}>
      <View style={{
        height: hp('80%'),
        width: wp('100%'),
        backgroundColor: '#fff',
      }}
      >
        {artOnDisplay ? (
          <ArtworkPortrait
            artOnDisplay={artOnDisplay}
          />
        )
          : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" />
              <GlobalText style={globalTextStyles.boldTitleText}>Working on it</GlobalText>
              <GlobalText style={globalTextStyles.boldTitleText}>🤦💻</GlobalText>
            </View>
          )}
      </View>
    </ActionSheet>
  );
}
