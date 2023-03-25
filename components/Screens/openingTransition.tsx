import {StackNavigationOptions} from '@react-navigation/stack';
import {TransitionSpecs} from '@react-navigation/stack';
import {useMemo} from 'react';

//LOL GPT wrote this

export function createOpeningTransition(): StackNavigationOptions {
  const config = {
    duration: 3000,
  };

  return {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: ({current, next, layouts}): any => {
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
    animation: 'timing',
    animationConfig: {
      ...config,
    },
  };
}
