import React from 'react';
import { View, StyleSheet, Animated} from 'react-native';
import * as Colors from '@darta-styles';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY_50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24
  },
  dartaContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    height: '80%',
  },
  header: {
    fontFamily: 'DMSans_400Regular', 
    fontSize: 24
  },
  artHeader: {
    fontFamily: 'DMSans_700Bold', 
    fontSize: 24,
    fontWeight: 'bold'
  },
  subHeader: {
    fontSize: 16, 
    fontFamily: 'DMSans_400Regular', 
    color: Colors.PRIMARY_950
  }
});

export function GenericLoadingScreen() {


  const dAnim = React.useRef(new Animated.Value(0)).current;
  const a1Anim = React.useRef(new Animated.Value(0)).current;
  const rAnim = React.useRef(new Animated.Value(0)).current;
  const tAnim = React.useRef(new Animated.Value(0)).current;
  const a2Anim = React.useRef(new Animated.Value(0)).current;


  React.useEffect(() => {
    dAnim.addListener(() => {})
    a1Anim.addListener(() => {})
    rAnim.addListener(() => {})
    tAnim.addListener(() => {})
    a2Anim.addListener(() => {})
  }, [])

  const sineWaveAnimation = (animatedValue, delay) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 10, // Amplitude of the wave
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
  };
  
  
  
  React.useEffect(() => {
  
    const cycleDuration = 5000; // Total duration for each letter's full cycle
    const animations = [
      sineWaveAnimation(dAnim, 0),
      sineWaveAnimation(a1Anim, cycleDuration / 5 * 1),
      sineWaveAnimation(rAnim, cycleDuration / 5 * 2),
      sineWaveAnimation(tAnim, cycleDuration / 5 * 3),
      sineWaveAnimation(a2Anim, cycleDuration / 5 * 4),
    ];
  
    // Start all animations
    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop()); // Cleanup
  }, []);
  

  
  return (
    <View 
        style={{
        height: hp('100%'),
        width: '100%',
        backgroundColor: Colors.PRIMARY_50,
        display: 'flex',
        alignItems: 'center',
        }}>  
          <View style={styles.dartaContainer}>
            <Animated.Text style={{ transform: [{ translateY: dAnim }], ...styles.header }}>
              d
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: a1Anim }], ...styles.header }}>
              a
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: rAnim }], ...styles.header}}>
              r
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: tAnim }], ...styles.header }}>
              t
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: a2Anim }], ...styles.header }}>
              a
            </Animated.Text>
          </View>
    </View>     
  );
}
