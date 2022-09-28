import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, Image, ImageBackground, KeyboardAvoidingView } from "react-native";
import { AuthContext } from "../context";
import { useTheme, TextInput, Button, IconButton, Portal, Modal, Subheading, ActivityIndicator } from 'react-native-paper';
import { ScreenContainer } from "../ScreenContainer";
import styles from '../styles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

export const SignIn = () => {
  const { signIn, updateAuthGlobal, setRelog } = React.useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setuserType] = useState('');
  const [QR, setQR] = useState('');
  const {colors} = useTheme();

  const [devSignInHit, setDevSignIn] = useState(false)

  const [visible, setVisible] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const ref_input = useRef();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 5, margin: 10, display:"flex", height:300};
  const {Profile} = React.useContext(AuthContext)


  const devSignIn = React.useCallback(() => {
    setUserName("sawan")
    setPassword("Sa2022??")
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
        console.log(responseData)
        signIn(responseData.auth_key, responseData.jwt, responseData.token.data.user_type, responseData.username, responseData.namesurname, responseData.user_id, responseData.token.data.administrator,responseData.token.data.supervisor, responseData.token.data.manager, responseData.token.data.user_class_name);
      })
      .catch((error) => {
        alert("Unable to log in - " + error.toString());
      });
  },[Profile.deviceId, password, setRelog, signIn, userName, userType])

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
          {isLoading &&
            <ActivityIndicator animating={true} size="large" />
          }
</ImageBackground>
    </ScreenContainer>
  );
};
