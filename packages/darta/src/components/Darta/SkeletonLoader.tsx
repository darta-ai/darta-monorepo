import React from 'react';
import { View, StyleSheet, Animated} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Colors from '@darta-styles';


export const SkeletonLoader = ({height, width}: {height: number | undefined, width: number | undefined}) => {

    const shimmerAnimation = React.useRef(new Animated.Value(0)).current;


    const styles = StyleSheet.create({
        skeleton: {
        width,
        height: 5,
        overflow: 'hidden', // Ensures the shimmer doesn't overflow
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        },
        shimmerContainer: {
        flex: 1,
        justifyContent: 'center',
        },
        shimmer: {
        width: 200, // Width of the shimmer effect
        height: '100%',
        },
    });
  

    React.useEffect(() => {
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000, // Duration of the shimmer effect
          useNativeDriver: true,
        })
      ).start();
    }, [shimmerAnimation]);
  
    const translateX = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, 200], // Adjust the range for the movement of the shimmer
    });
    
    return (
    <View style={styles.skeleton}>
        <Animated.View style={{ ...styles.shimmerContainer, transform: [{ translateX }] }}>
          <LinearGradient
            colors={[Colors.PRIMARY_100, Colors.PRIMARY_500, Colors.PRIMARY_100]} // Shimmer colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmer}
          />
        </Animated.View>
      </View>
    )
};
