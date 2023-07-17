// import { useIsFocused } from '@react-navigation/core';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import React from 'react';
// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import {
//   Image, StyleSheet, View,
// } from 'react-native';
// import {
//   PinchGestureHandler,
//   PinchGestureHandlerGestureEvent,
// } from 'react-native-gesture-handler';
// import { Button } from 'react-native-paper';

// import {
//   Camera,
//   CameraRuntimeError,
//   PhotoFile,
//   useCameraDevices,
//   VideoFile,
// } from 'react-native-vision-camera';

// import { icons } from '../globalVariables';
// import { CONTENT_SPACING, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from './Constants';
// import { useIsForeground } from './hooks';
// import type { Routes } from './Routes';
// import { CaptureButton } from './views/CaptureButton';
// import { StatusBarBlurBackground } from './views/StatusBarBlurBackground';

// const SCALE_FULL_ZOOM = 3;
// const BUTTON_SIZE = 40;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: 'black',
//   },
//   captureButton: {
//     position: 'absolute',
//     alignSelf: 'center',
//     bottom: SAFE_AREA_PADDING.paddingBottom,
//   },
//   button: {
//     marginBottom: CONTENT_SPACING,
//     width: BUTTON_SIZE,
//     height: BUTTON_SIZE,
//     borderRadius: BUTTON_SIZE / 2,
//     backgroundColor: 'rgba(140, 140, 140, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rightButtonRow: {
//     position: 'absolute',
//     right: SAFE_AREA_PADDING.paddingRight,
//     top: SAFE_AREA_PADDING.paddingTop,
//   },
//   text: {
//     color: 'white',
//     fontSize: 11,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
// Reanimated.addWhitelistedNativeProps({
//   zoom: true,
// });

// type Props = NativeStackScreenProps<Routes, 'CameraPage'>;
// export function CameraPage({ navigation }: Props): React.ReactElement {
//   const [mediaCaptured, setMediaCaptured] = useState<string | boolean>('');
//   const camera = useRef<Camera>(null);
//   const [isCameraInitialized, setIsCameraInitialized] = useState(false);
//   const zoom = useSharedValue(0);
//   const isPressingButton = useSharedValue(false);

//   // check if camera page is active
//   const isFocussed = useIsFocused();
//   const isForeground = useIsForeground();
//   const isActive = isFocussed && isForeground;

//   const enableHdr = true;

//   // camera format settings
//   const devices = useCameraDevices();
//   const device = devices.back;

//   // #region Animated Zoom
//   // This just maps the zoom factor to a percentage value.
//   // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
//   const minZoom = device?.minZoom ?? 1;
//   const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

//   const cameraAnimatedProps = useAnimatedProps(() => {
//     const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
//     return {
//       zoom: z,
//     };
//   }, [maxZoom, minZoom, zoom]);
//   // #endregion

//   // #region Callbacks
//   const setIsPressingButton = useCallback(
//     (_isPressingButton: boolean) => {
//       isPressingButton.value = _isPressingButton;
//     },
//     [isPressingButton],
//   );
//   // Camera callbacks
//   const onError = useCallback((error: CameraRuntimeError) => {
//     console.error(error);
//   }, []);
//   const onInitialized = useCallback(() => {
//     console.log('Camera initialized!');
//     setIsCameraInitialized(true);
//   }, []);
//   const onMediaCaptured = useCallback(
//     (media: PhotoFile | VideoFile) => {
//       console.log(`Media captured! ${JSON.stringify(media)}, ${Object.keys(media)}`);
//       setMediaCaptured(media.path);
//     },
//     [navigation],
//   );

//   // #region Effects
//   const neutralZoom = device?.neutralZoom ?? 1;
//   useEffect(() => {
//     // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
//     zoom.value = neutralZoom;
//   }, [neutralZoom, zoom]);

//   // #endregion

//   // #region Pinch to Zoom Gesture
//   // The gesture handler maps the linear pinch gesture (0 - 1)
//   // to an exponential curve since a camera's zoom
//   // function does not appear linear to the user.
//   // (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
//   const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent,
//   { startZoom?: number }>({
//     onStart: (_, context) => {
//       context.startZoom = zoom.value;
//     },
//     onActive: (event, context) => {
//       // we're trying to map the scale gesture to a linear zoom here
//       const startZoom = context.startZoom ?? 0;
//       const scale = interpolate(
//         event.scale,
//         [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
//         [-1, 0, 1],
//         Extrapolate.CLAMP,
//       );
//       zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
//     },
//   });
//   // #endregion

//   return (
//     <View style={styles.container}>
//       {mediaCaptured ? (
//         <View
//           // style={StyleSheet.absoluteFill}
//           style={{
//             borderColor: 'red',
//             position: 'absolute',
//             borderWidth: 2,
//             height: '100%',
//             width: '100%',
//           }}
//         >
//           <Image
//             source={{
//               uri: mediaCaptured,
//             }}
//             style={{
//               position: 'absolute',
//               // zIndex: 2,
//               borderWidth: 2,
//               height: '100%',
//               width: '100%',
//             }}
//           />
//           <Button
//             icon={icons.back}
//             style={{
//               position: 'absolute',
//               top: '1%',
//               opacity: 0.7,
//               backgroundColor: '#FFF',
//             }}
//             accessibilityLabel="Navigate To Gallery Selector"
//             testID="galleryBack"
//             onPress={() => setMediaCaptured('')}
//             children={undefined}
//           />
//         </View>
//       )
//         : (
//           <>
//             {device != null && (
//             <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
//               <Reanimated.View style={StyleSheet.absoluteFill}>
//                 <ReanimatedCamera
//                   ref={camera}
//                   style={StyleSheet.absoluteFill}
//                   device={device}
//                   hdr={enableHdr}
//                   lowLightBoost={device.supportsLowLightBoost}
//                   isActive={isActive}
//                   onInitialized={onInitialized}
//                   onError={onError}
//                   enableZoomGesture
//                   animatedProps={cameraAnimatedProps}
//                   photo
//                   orientation="portrait"
//                   frameProcessorFps={1}
//                 />
//               </Reanimated.View>
//             </PinchGestureHandler>
//             )}

//             <CaptureButton
//               style={styles.captureButton}
//               camera={camera}
//               onMediaCaptured={onMediaCaptured}
//               cameraZoom={zoom}
//               minZoom={minZoom}
//               maxZoom={maxZoom}
//               flash={device?.hasFlash ? 'on' : 'off'}
//               enabled={isCameraInitialized && isActive}
//               setIsPressingButton={setIsPressingButton}
//             />
//             <StatusBarBlurBackground />
//           </>
//         )}
//     </View>
//   );
// }
