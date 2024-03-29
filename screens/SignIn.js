import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, Image, ImageBackground, KeyboardAvoidingView, StyleSheet } from "react-native";
import { AuthContext } from "../context";
import { useTheme, TextInput, Button, IconButton, Portal, Modal, Subheading, ActivityIndicator } from 'react-native-paper';
import { ScreenContainer } from "../ScreenContainer";
import styles from '../styles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRScanner = ({visible, dismiss}) => {

  const {updateAuthGlobal} = React.useContext(AuthContext)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const containerStyle = { backgroundColor: 'white', padding: 0, margin: 10, display:"flex", height:300};
  React.useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let data2 = (data.split("-"))
    updateAuthGlobal(data2[2],data2[0],data2[1])
    dismiss();
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
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </Modal>
      </Portal>
  );
}


export const SignIn = () => {
  const { signInGlobal, updateAuthGlobal, setRelog } = React.useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setuserType] = useState('5');
  const [QR, setQR] = useState('');
  const {colors} = useTheme();

  const [devSignInHit, setDevSignIn] = useState(false)
  const [QRSignInHit, setQRSignInHit] = useState(false)

  const [visible, setVisible] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const ref_input = useRef();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 5, margin: 10, display:"flex", height:300};
  const {Profile} = React.useContext(AuthContext)
  const hideQR = () => setQRSignInHit(false);

  const devSignIn = React.useCallback(() => {
    setUserName("sawan")
    setPassword("Sa2022!!")
    setDevSignIn(true)
  },[])

  React.useEffect(() =>{
    if (devSignInHit == true){
    getAuth()
    }
  },[devSignInHit, getAuth])


  const getAuth = React.useCallback(() => {
    let data = {
      method: 'POST',
      mode: "cors", // no-cors, cors, *same-origin *=default
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username":userName,
      "password":password,
      "updateAuth":false,
      "user_type":userType,
      "deviceID": Profile.deviceId
    })
    };
    return fetch('https://api-veen-e.ewipro.com/v1/authenticate/', data)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((responseData) => {
        signInGlobal(responseData);
      })
      .catch((error) => {
        alert("Unable to log in - " + error.toString());
      });
  },[Profile.deviceId, password, setRelog, signInGlobal, userName, userType])


  const startScan = () => {
    setQRSignInHit(true)
  }


  return (
    <ScreenContainer nomargin={true}>
      <ImageBackground source={require('../assets/loginBG.png')} style={styles.BGimage}>
      <IconButton
        icon="card-bulleted-off"
        style={{ position: "absolute", top: 0, margin: 20, right:0, padding:0, width:50, height:50 }}
        containerColor={colors.primary}
        iconColor={colors.white}
        size={30}
        onPress={() => showModal()}
      />
        {(Constants.appOwnership == "expo" || Constants.experienceUrl == "http://localhost:19006") && <IconButton
        icon="auto-fix"
        style={{ position: "absolute", top: 0, margin: 20, left:0, padding:0, width:50, height:50 }}
        containerColor={colors.primary}
        iconColor={colors.white}
        size={30}
        onPress={() => devSignIn()}
      />
    }
          <IconButton
        icon="barcode-scan"
        style={{ position: "absolute", top: 0, margin: 20, right:100, padding:0, width:50, height:50 }}
        containerColor={colors.primary}
        iconColor={colors.white}
        size={30}
        onPress={() => startScan()}
      />
      <Image
           style={styles.SignInLogo}
           source={require('../assets/prologo.png')}
           resizeMode={"contain"}
      />
{!isLoading &&
            <View style={{ alignSelf: "center", alignContent: "center", display: "flex" }}><TextInput
            mode="flat"
            underlineColor={"#eee"}
            style={[styles.logInInput, {marginTop:10}]}
              placeholder="Username"
              placeholderTextColor="#CECECE"
              onChangeText={text => setUserName(text)}
              value={userName} />
            <TextInput
                  underlineColor={"#eee"}
            mode="flat"
                  style={styles.logInInput}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#CECECE"
              onChangeText={text => setPassword(text)}
              value={password}/>
                    <Button mode="contained" style={styles.logInButton} labelStyle={{color:colors.white, textAlignVertical:"center"}} onPress={() => getAuth()}>LOGIN</Button>
            </View>}
            <QRScanner visible={QRSignInHit} dismiss={hideQR}/>
</ImageBackground>
    </ScreenContainer>
  );
};
