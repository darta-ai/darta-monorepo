import {StackNavigationOptions, TransitionSpecs} from '@react-navigation/stack';

// LOL GPT wrote this

export function createOpeningTransition(): StackNavigationOptions {
  return {
    gestureDirection: 'horizontal-inverted',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: ({current, layouts}): any => {
      const {progress} = current;
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
      });

      const rotateY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['90deg', '0deg'],
      });

      const opacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      return {
        cardStyle: {
          transform: [{translateX}, {rotateY}],
          opacity,
        },
        overlayStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      };
    },
    animationEnabled: true,
    animationTypeForReplace: 'push',
    cardOverlayEnabled: true,
  };
}
