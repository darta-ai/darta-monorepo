import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {
  Camera,
  CameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';

import {useIsForeground} from './hooks';

export function CameraRequest() {
  const [useCamera, setUserCamera] = useState<boolean>(false);
  const [device, setDevice] = useState<CameraDevice>({});

  const isAppForeground = useIsForeground();
  const onCameraInitialized = useCallback(
    () => console.log('camera initialized'),
    [],
  );

  const checkPermissionsCamera = async (): Promise<any> => {
    try {
      const result = await check(PERMISSIONS.IOS.CAMERA);
      console.log({result});
      switch (result) {
        case RESULTS.UNAVAILABLE:
          return {needRequest: false, isAvailable: false};
        case RESULTS.DENIED:
          return {needRequest: true, isAvailable: false};
        case RESULTS.LIMITED:
          return {needRequest: false, isAvailable: true};
        case RESULTS.GRANTED:
          return {needRequest: false, isAvailable: true};
        case RESULTS.BLOCKED:
          return {needRequest: false, isAvailable: false};
        default:
          return {needRequest: false, isAvailable: false};
      }
    } catch (error) {
      console.log('ERRORED', {error});
    }
    return {needRequest: false, isAvailable: false};
  };

  useEffect(() => {
    const asyncCheck = async () => {
      const {needRequest, isAvailable} = await checkPermissionsCamera();
      if (needRequest) {
        await request(PERMISSIONS.IOS.CAMERA)
          .then((res: any) => {
            console.log({res});
          })
          .catch(error => console.log({error}));
      }
      if (isAvailable) {
        setUserCamera(true);
        const devices = useCameraDevices();
        if (devices && devices?.back) {
          setDevice(devices.back);
        }
      }
    };
    asyncCheck();
  }, []);
  if (device && useCamera) {
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        photo
        onInitialized={onCameraInitialized}
        isActive={isAppForeground}
        preset="medium"
      />
    );
  }
}
