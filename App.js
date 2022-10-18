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
import jwt_decode from "jwt-decode";


const androidName = Device.deviceName

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
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
  const [userClass, setUserClass] = React.useState(null)
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
    //console.log(data)
    return fetch('https://api-veen-e.ewipro.com/v1/authenticate/', data)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((responseData) => {
        signIn(responseData)
      })
      .catch((error) => {
        alert("Unable to log in - " + error.toString());
      });
  }, [deviceId])
  const saveAuth = async (userName, auth_key, userType) => {
    try {
      const login = JSON.stringify({user:userName, token:auth_key, type:userType})
      await AsyncStorage.setItem("@login", login)
      //console.log("saved",login)
    } catch (e) {
      alert('Failed to save session storage'+e)
    }
  }
  const getAuth = async () => {
    try {
        const login = await AsyncStorage.getItem('@login')
        if (login !== null) {
            return JSON.parse(login)
        }
        else{
            return "no"
        }
    } catch (e) {
        alert(e)
    }
}

const signIn = (data) => {
  //console.log(data)
const token = data.jwt;
var decoded = jwt_decode(token);
//console.log(decoded)
setUserToken(data.auth_key);
 setUserType(decoded.data.user_type)
setJwt(token);
setUserID(decoded.data.id)
setUserNameLogin(data.username)
saveAuth(data.username, data.auth_key, decoded.data.user_type)
setUserName(decoded.data.name)
        setUserClassName(decoded.data.user_class_name)
        setUserClass(decoded.data.userClass)
        setIsLoading(false)
}

const deleteAuth = async () => {
  try {
    await AsyncStorage.removeItem('@login')
  } catch(e) {
    // remove error
  }

  //console.log('Done.')
}

const signOut = () =>{
  deleteAuth();
  setJwt('');
  setUserToken('')
  setUserType('')
  setUserName('')
  setUserID('')
  setUserNameLogin('')
  setUserClass('')
  setUserClassName('')
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
      signOutGlobal: () => {
        signOut()
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
      signInGlobal: (data) => {
        //auth_key, jwt, userType, userName, name, id, isAdmin, isSupervisor, isManager, userClassName
        //console.log(data)
        signIn(data)
        // setUserToken(auth_key);
        // setUserType(userType)
        // setJwt(jwt);
        // setUserID(id)
        // setUserNameLogin(userName)
        // setIsAdmin(isAdmin)
        // setIsSupervisor(isSupervisor)
        // setIsManager(isManager)
        // saveAuth(userName, auth_key, userType)
        // setUserName(name)
        // setAdminMode(false)
        // setUserClassName(userClassName)
      },
      expireJWT: (jwt) => {
        setJwt(jwt)
      },
      updateAuthGlobal: (user_name, user_token, user_type) => {
        updateAuth(user_name, user_token, user_type)
        setUserToken(user_token)
        setUserType(user_type)
        setUserNameLogin(user_name)
      },
      setDate: (date) => {
        setDateGlobal(date)
      },
    }
  }, [jwt, userToken, authNFC, userType, userName, dateGlobal, userID, userNameLogin, deviceId, isAdmin, isSupervisor, isManager, adminMode, updateError, updateError2, userClassName, updateAuth]);


  React.useEffect(() => {
    //console.log("hello this happens")
    if (isLoading) {
        //console.log("so does this")
        getAuth().then((data) => {
          //console.log(data)
          if (data != "no"){
          updateAuth(data.user, data.token, data.type)
          }
          else{
            setIsLoading(false);
          }
      })
    }
}, [])



  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <StatusBar hidden={true} />
        <Navigation jwt={jwt} userToken={userToken} loading={isLoading}/>
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
