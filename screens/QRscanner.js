import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Portal, Modal} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRScanner = ({visible, dismiss}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const containerStyle = { backgroundColor: 'white', padding: 5, margin: 10, display:"flex", height:300};
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Portal>
    <Modal visible={visible} onDismiss={dismiss} contentContainerStyle={containerStyle}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </Modal>
      </Portal>
  );
}

export default QRScanner;