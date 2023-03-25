// import React, { useCallback, useMemo, useRef } from 'react';
// import { StyleSheet, View, ViewProps } from 'react-native';
// import {
//   PanGestureHandler,
//   PanGestureHandlerGestureEvent,
//   State,
//   TapGestureHandler,
//   TapGestureHandlerStateChangeEvent,
// } from 'react-native-gesture-handler';

// import type {
//   Camera, PhotoFile, TakePhotoOptions, TakeSnapshotOptions, VideoFile,
// } from 'react-native-vision-camera';

// import { CAPTURE_BUTTON_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';

// const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
// const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

// const START_RECORDING_DELAY = 200;
// const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//   },
//   shadow: {
//     position: 'absolute',
//     width: CAPTURE_BUTTON_SIZE,
//     height: CAPTURE_BUTTON_SIZE,
//     borderRadius: CAPTURE_BUTTON_SIZE / 2,
//     backgroundColor: '#e34077',
//   },
//   button: {
//     width: CAPTURE_BUTTON_SIZE,
//     height: CAPTURE_BUTTON_SIZE,
//     borderRadius: CAPTURE_BUTTON_SIZE / 2,
//     borderWidth: BORDER_WIDTH,
//     borderColor: 'white',
//   },
// });

// interface Props extends ViewProps {
//   camera: React.RefObject<Camera>;
//   // eslint-disable-next-line no-unused-vars
//   onMediaCaptured: (media: PhotoFile | VideoFile,
//      // eslint-disable-next-line no-unused-vars
//      type: 'photo' | 'video') => void;

//   minZoom: number;
//   maxZoom: number;
//   cameraZoom: Reanimated.SharedValue<number>;

//   flash: 'off' | 'on';

//   enabled: boolean;
// }

// // eslint-disable-next-line no-underscore-dangle
// const _CaptureButton: React.FC<Props> = ({
//   camera,
//   onMediaCaptured,
//   minZoom,
//   maxZoom,
//   cameraZoom,
//   flash,
//   enabled,
//   style,
//   ...props
// }): React.ReactElement => {
//   const pressDownDate = useRef<Date | undefined>(undefined);
//   const recordingProgress = useSharedValue(0);
//   const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
//     () => ({
//       photoCodec: 'jpeg',
//       qualityPrioritization: 'speed',
//       flash,
//       quality: 90,
//       skipMetadata: true,
//     }),
//     [flash],
//   );
//   const isPressingButton = useSharedValue(false);

//   // #region Camera Capture
//   const takePhoto = useCallback(async () => {
//     try {
//       if (camera.current == null) throw new Error('Camera ref is null!');

//       console.log('Taking photo...');
//       const photo = await camera.current.takePhoto(takePhotoOptions);
//       onMediaCaptured(photo, 'photo');
//     } catch (e) {
//       console.error('Failed to take photo!', e);
//     }
//   }, [camera, onMediaCaptured, takePhotoOptions]);

//   // #region Tap handler
//   const tapHandler = useRef<TapGestureHandler>();
//   const onHandlerStateChanged = useCallback(
//     async ({ nativeEvent: event }: TapGestureHandlerStateChangeEvent) => {
//       switch (event.state) {
//         case State.END:
//         case State.FAILED:
//         case State.CANCELLED: {
//           try {
//             if (pressDownDate.current == null) {
//               throw new Error('PressDownDate ref .current was null!');
//             }
//             await takePhoto();
//             break;
//           } catch (e) {
//             console.log({ e });
//           }
//         }
//           break;
//         default:
//           break;
//       }
//     },
//     [isPressingButton, recordingProgress,
//       takePhoto],
//   );
//   // #endregion
//   // #region Pan handler
//   const panHandler = useRef<PanGestureHandler>();
//   const onPanGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent,
//   { offsetY?: number; startY?: number }>({
//     onStart: (event, context) => {
//       context.startY = event.absoluteY;
//       const yForFullZoom = context.startY * 0.7;
//       const offsetYForFullZoom = context.startY - yForFullZoom;

//       // extrapolate [0 ... 1] zoom -> [0 ... Y_FOR_FULL_ZOOM] finger position
//       context.offsetY = interpolate(
//         cameraZoom.value,
//         [minZoom, maxZoom],
//         [0, offsetYForFullZoom],
//         Extrapolate.CLAMP,
//       );
//     },
//     onActive: (event, context) => {
//       const offset = context.offsetY ?? 0;
//       const startY = context.startY ?? SCREEN_HEIGHT;
//       const yForFullZoom = startY * 0.7;

//       cameraZoom.value = interpolate(
//         event.absoluteY - offset,
//         [yForFullZoom, startY],
//         [maxZoom, minZoom],
//         Extrapolate.CLAMP,
//       );
//     },
//   });
//   // #endregion

//   const shadowStyle = useAnimatedStyle(
//     () => ({
//       transform: [
//         {
//           scale: withSpring(isPressingButton.value ? 1 : 0, {
//             mass: 1,
//             damping: 35,
//             stiffness: 300,
//           }),
//         },
//       ],
//     }),
//     [isPressingButton],
//   );
//   const buttonStyle = useAnimatedStyle(() => {
//     let scale: number;
//     if (enabled) {
//       if (isPressingButton.value) {
//         scale = withRepeat(
//           withSpring(1, {
//             stiffness: 100,
//             damping: 1000,
//           }),
//           -1,
//           true,
//         );
//       } else {
//         scale = withSpring(0.9, {
//           stiffness: 500,
//           damping: 300,
//         });
//       }
//     } else {
//       scale = withSpring(0.6, {
//         stiffness: 500,
//         damping: 300,
//       });
//     }

//     return {
//       opacity: withTiming(enabled ? 1 : 0.3, {
//         duration: 100,
//         easing: Easing.linear,
//       }),
//       transform: [
//         {
//           scale,
//         },
//       ],
//     };
//   }, [enabled, isPressingButton]);

//   return (
//     <TapGestureHandler
//       enabled={enabled}
//       ref={tapHandler}
//       onHandlerStateChange={onHandlerStateChanged}
//       shouldCancelWhenOutside={false}
//       maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to
//       // State.FAILED when the user moves his finger outside of the child view (to zoom)
//       simultaneousHandlers={panHandler}
//     >
//       <Reanimated.View {...props} style={[buttonStyle, style]}>
//         <PanGestureHandler
//           enabled={enabled}
//           ref={panHandler}
//           failOffsetX={PAN_GESTURE_HANDLER_FAIL_X}
//           activeOffsetY={PAN_GESTURE_HANDLER_ACTIVE_Y}
//           onGestureEvent={onPanGestureEvent}
//           simultaneousHandlers={tapHandler}
//         >
//           <Reanimated.View style={styles.flex}>
//             <Reanimated.View style={[styles.shadow, shadowStyle]} />
//             <View style={styles.button} />
//           </Reanimated.View>
//         </PanGestureHandler>
//       </Reanimated.View>
//     </TapGestureHandler>
//   );
// };

// export const CaptureButton = React.memo(_CaptureButton);
