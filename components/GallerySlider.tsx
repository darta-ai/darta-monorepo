import React from 'react';
import {
  SafeAreaView, ScrollView, Text, View, StyleSheet,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { GlobalText } from './GlobalElements/index';

const borderWidth = 4;
const trackMarkStyles = StyleSheet.create({
  activeMark: {
    borderColor: 'red',
    borderWidth,
    left: -borderWidth / 2,
  },
  inactiveMark: {
    borderColor: 'grey',
    borderWidth,
    left: -borderWidth / 2,
  },
  sliderContainer: {
    paddingVertical: 16,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function SliderContainer(props: {
    caption: string;
    children: React.ReactElement;
    sliderValue?: Array<number>;
    trackMarks?: Array<number>;
    vertical?: boolean;
}) {
  const { caption, sliderValue, trackMarks } = props;
  const [value, setValue] = React.useState(
    sliderValue,
  );
  let renderTrackMarkComponent: React.ReactNode;

  if (trackMarks?.length && (!Array.isArray(value) || value?.length === 1)) {
    renderTrackMarkComponent = (index: number) => {
      const currentMarkValue = trackMarks[index];
      const currentSliderValue = value || (Array.isArray(value) && value[0]) || 0;
      const style = currentMarkValue > Math.max(currentSliderValue)
        ? trackMarkStyles.activeMark
        : trackMarkStyles.inactiveMark;
      return <View style={style} />;
    };
  }

  const renderChildren = () => React.Children.map(
    props.children,
    (child: React.ReactElement) => {
      if (!!child && child.type === Slider) {
        return React.cloneElement(child, {
          onValueChange: setValue,
          renderTrackMarkComponent,
          trackMarks,
          value,
        });
      }

      return child;
    },
  );

  return (
    <View style={trackMarkStyles.sliderContainer}>
      <View style={trackMarkStyles.titleContainer}>
        <GlobalText>{caption}</GlobalText>
        <GlobalText>{Array.isArray(value) ? value.join(' - ') : value}</GlobalText>
      </View>
      {renderChildren()}
    </View>
  );
}

export { SliderContainer };
