import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Provider as PaperProvider, Dialog, Paragraph, Button, Portal } from 'react-native-paper';
import Navigation from './navigation';
import { Splash } from './screens/splash'
import { AuthContext } from "./context";
import { lightTheme, darkTheme } from './theme'
import { ScreenContainer } from './ScreenContainer'
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const androidName = Device.deviceName

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState(androidName)
  const [theme, setTheme] = React.useState(lightTheme);
  const [userToken, setUserToken] = React.useState(null);
  const [userType, setUserType] = React.useState(null);
  const [userClassName, setUserClassName] = React.useState(null);
  const [userName, setUserName] = React.useState(null);
  const [userNameLogin, setUserNameLogin] = React.useState(null)
  const [userID, setUserID] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(null);
  const [adminMode, setAdminMode] = React.useState(false);
  const [isSupervisor, setIsSupervisor] = React.useState(null);
  const [isManager, setIsManager] = React.useState(null);
  const [dateGlobal, setDateGlobal] = React.useState(null);
  const [jwt, setJwt] = React.useState(null);
  const [authNFC, setAuthNFC] = React.useState(null);
  const [updateError, setUpdateError] = React.useState('')
  const [updateError2, setUpdateError2] = React.useState('')
  const ClearProfile = () => {
    setJwt('')
    setUserToken('')
    setAuthNFC('')
    setUserType('')
    setUserName('')
    setDateGlobal('')
    setUserID('')
    setUserNameLogin('')
  }
  const updateAuth = React.useCallback((user, userToken, userType) => {
    setUserToken(null);
    setJwt(null);
    let data = {
      method: 'POST',
      mode: "cors", // no-cors, cors, *same-origin *=default
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": user,
        "auth_key": userToken,
        "updateAuth": true,
        "user_type": userType,
        "deviceID": deviceId
      })
    };
    console.log(data)
    return fetch('https://api-veen-e.ewipro.com/v1/authenticate/', data)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((responseData) => {
        // let loginURL = Linking.createURL('/', {
        //   queryParams: { authKey: userToken, userType: userType, user: user },
        // });
        setUserType(responseData.token.data.user_type)
        setUserName(responseData.namesurname)
        setUserNameLogin(user)
        setUserID(responseData.user_id)
        //setAuthNFC(loginURL)
        setJwt(responseData.jwt)
        setUserToken(userToken)
        setIsAdmin(responseData.token.data.administrator)
        setIsSupervisor(responseData.token.data.supervisor)
        setIsManager(responseData.token.data.manager)
        setUserClassName(responseData.token.data.user_class_name)
        setIsLoading(false)
        saveAuth(userToken, responseData.token.data.user_type, user)
        setAdminMode(false)
      })
      .catch((error) => {
        alert("Unable to log in - " + error.toString());
      });
  }, [deviceId])
  const saveAuth = async (auth_key, userName) => {
    try {
      await AsyncStorage.setItem("@auth_token", auth_key)
      await AsyncStorage.setItem("@username", userName)
      console.log("saved",userName, auth_key)
    } catch (e) {
      alert('Failed to save session storage'+e)
    }
  }

  const authContext = React.useMemo(() => {
    return {
      Profile: {
        jwt: jwt,
        userToken: userToken,
        NFC: authNFC,
        userType: userType,
        name: userName,
        date: dateGlobal,
        id: userID,
        userName: userNameLogin,
        deviceId: deviceId,
        isAdmin: isAdmin,
        isSupervisor: isSupervisor,
        isManager: isManager,
        adminMode: adminMode,
        updateError: updateError,
        updateError2: updateError2,
        userClassName:userClassName,
      },
      toggleThemeGlobal: (status) => {
        if (status == "checked") {
          setTheme(darkTheme)
        }
        if (status == "unchecked") {
          setTheme(lightTheme)
        }
      },
      toggleAdmin: (currentMode) => {
        setAdminMode(!currentMode)
      },
      setRelog: (relog) => {
        setNeedsRelog(relog)
      },
      signIn: (auth_key, jwt, userType, userName, name, id, isAdmin, isSupervisor, isManager, userClassName) => {
        console.log(auth_key)
        console.log(userName)
        setUserToken(auth_key);
        setUserType(userType)
        setJwt(jwt);
        setUserID(id)
        setUserNameLogin(userName)
        setIsAdmin(isAdmin)
        setIsSupervisor(isSupervisor)
        setIsManager(isManager)
        saveAuth(auth_key, userName)
        setUserName(name)
        setAdminMode(false)
        setUserClassName(userClassName)
      },
      expireJWT: (jwt) => {
        setJwt(jwt)
      },
      updateAuthGlobal: (user_name, user_token, user_type) => {
        updateAuth(user_name, user_token, user_type)
        setUserToken(user_token);
        setUserType(user_type)
        setUserNameLogin(user_name)
      },
      signOut: () => {
        setUserToken(null);
        setJwt(null);
        clearStorage();
        ClearProfile();
      },
      setDate: (date) => {
        setDateGlobal(date)
      },
    }
  }, [jwt, userToken, authNFC, userType, userName, dateGlobal, userID, userNameLogin, deviceId, isAdmin, isSupervisor, isManager, adminMode, updateError, updateError2, userClassName, updateAuth]);




  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <Splash />
      </PaperProvider>
    )
  }


  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <StatusBar hidden={true} />
        <Navigation />
      </PaperProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
