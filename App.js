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


export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [theme, setTheme] = React.useState(lightTheme);
  const [jwt, setJwt] = React.useState("tesasft");
  const authContext = React.useMemo(() => {
    return {
      Profile: {
        jwt: jwt,
      },
    }
  }, [jwt]);



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
