import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { Divider } from 'react-native-paper';
import { IconButtonElement } from '../../components/Elements/IconButtonElement';
import * as SVGs from '../../assets/SVGs';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { ETypes, StoreContext } from '../../state';

const screenHeight = Dimensions.get('window').height;

interface PanGestureContext {
  startY: number;
  
}


export const BottomSheetNavigation = ({ navigation }) => {
  const translateY = useSharedValue(0);
  const { state, dispatch} = React.useContext(StoreContext);

  const handleShowSaved = () => {
    dispatch({
      type: ETypes.isViewingSaved,
      isViewingSaved: !state.isViewingSaved
    })
  } 

  const panGestureEvent = useAnimatedGestureHandler<any, any>({
    onStart: (_, context: PanGestureContext) => {
      context.startY = translateY.value;
    },
    onActive: (event: any, context: PanGestureContext) => {
      const newY = event.translationY + context.startY;
      // Prevent moving the bottom sheet up
      if (newY < 0) return; 
      translateY.value = newY;
    },
    onEnd: () => {
      runOnJS(navigation.goBack)();
      }
    });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
        {/* <View style={styles.blackTab}/> */}
        {/* <View style={styles.bottomSheet}> */}
            <TextElement>Filters</TextElement>
            <Divider/>
                <IconButtonElement 
                inUse={!state.isViewingSaved}
                IconInUse={<SVGs.HeartFill />}
                IconNotInUse={<SVGs.HeartEmpty />}
                onPress={handleShowSaved}
                text={"Saved"}
              />
              <Divider/>
          {/* </View> */}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blackTab: {
    backgroundColor: Colors.PRIMARY_950,
    height: 5,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    opacity: 0.5,
  },
  bottomSheet: {
    backgroundColor: Colors.PRIMARY_50,
    height: screenHeight * 0.15, // 50% of the screen height
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  },
});