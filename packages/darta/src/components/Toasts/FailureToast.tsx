import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { TextElement } from '../Elements/_index';

export const FailureToast = ({visible, setVisible, message} : {visible: boolean, setVisible: (arg0: boolean) => void, message: string}) => {

  const onDismissSnackBar = () => setVisible(false);
  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}>
        <TextElement>{message}</TextElement>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    zIndex: 100,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'red',
    width: '100%',
    height: 500,
    display: 'flex',
    justifyContent: 'space-between',
  },
});