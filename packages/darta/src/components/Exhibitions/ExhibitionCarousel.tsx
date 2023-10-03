import * as React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Button} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { TextElement } from '../Elements/TextElement';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
  } from "react-native-reanimated";
  
  import { SBItem } from "./SBs/SBItem";
  import { PRIMARY_100, PRIMARY_50 } from '@darta-styles';
  

const carouselStyle = StyleSheet.create({
    heroImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
})

const WIDTH = wp('80%');

interface ItemProps {
  animationValue: Animated.SharedValue<number>
  index: number
  item: {
    imageUrl: string
    title: string
  }
}
const CustomItem: React.FC<ItemProps> = ({ item, animationValue, index }) => {
  const maskStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      [PRIMARY_100, PRIMARY_100, PRIMARY_100],
    );
    

    return {
      backgroundColor,
    };
  }, [animationValue]);

  return (
    <View style={{ flex: 1 }}>
      <SBItem style={{ borderRadius: 0 }} />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          maskStyle,
        ]}
      >
        <Image 
        source={{uri: item.imageUrl}} 
        style={carouselStyle.heroImage} 
        />
        <TextElement>{item.title}</TextElement>
        </Animated.View>
    </View>
  );
};
export function ExhibitionCarousel({images} : {images: {imageUrl: string, title: string}[]}) {
  const animationStyle: any = React.useCallback(
    (value: number) => {
      "worklet";

      const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
      const translateX = interpolate(
        value,
        [-2, 0, 1],
        [-WIDTH, 0, WIDTH],
      );

      return {
        transform: [{ translateX }],
        zIndex,
      };
    },
    [],
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = React.useRef<any>(null);

  const prevSlide = () => {
    carouselRef.current?.prev();
  };

  const nextSlide = () => {
    carouselRef.current?.next();
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={prevSlide}>
        <Text>{"<"}</Text>
      </TouchableOpacity>
      <Carousel
        ref={carouselRef}
        loop={true}
        autoPlay={false}
        width={WIDTH}
        data={images}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        scrollAnimationDuration={100}
        renderItem={({ item, animationValue, index}) => {
        return (
            <CustomItem
              key={item.title}
              index={index}
              item={item}
              animationValue={animationValue}
            />
          );
        }}
        customAnimation={animationStyle}
      />
      <TouchableOpacity onPress={nextSlide}>
        <Text>{">"}</Text>
    </TouchableOpacity>
    </View>
  );
}
