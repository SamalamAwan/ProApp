import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StatusBar, View, Image, ImageBackground, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import styles from './styles'
import { useContext, useRef, useState, useEffect } from 'react';
import { AuthContext } from './context';
import { IconButton, useTheme, Text, Avatar, Modal, Portal, TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, AppState } from 'react-native';
import { SiteInspection } from './screens/SiteInspection';
import { PullOut } from './screens/PullOut';
import { SiteVisit } from './screens/SiteVisit';
import { HomeScreen } from './screens/Home';
import { SignIn } from './screens/SignIn';
import * as Device from 'expo-device';
import { Splash } from './screens/splash';

import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Navigation(props) {

    // eslint-disable-next-line no-unused-vars
    return (
        <NavigationContainer>
            <StatusBar />
            <RootNavigator props={props} />
        </NavigationContainer>
    );
}


const RootStack = createNativeStackNavigator();
function RootNavigator() {

    const [isLoading, setIsLoading] = React.useState(true);
    const { Profile } = React.useContext(AuthContext)
    const { updateAuthGlobal } = React.useContext(AuthContext);

    const getAuth = async () => {
        try {
            const authToken = await AsyncStorage.getItem('@auth_token')
            const username = await AsyncStorage.getItem('@username')
            if (authToken !== null && username !== null) {
                return ([username, authToken])
            }
            setIsLoading(false)
        } catch (e) {
            alert(e)
        }
    }


    React.useEffect(() => {
        console.log("hello this happens")
        if (isLoading) {
            console.log("so does this")
            getAuth().then((data) => {
                console.log(data[0], data[1])
                updateAuthGlobal(data[0].toString(), data[1].toString(), Profile.userType)
                setIsLoading(false)
            })
        }
    }, [])

    return (
        <RootStack.Navigator headerMode={false}>
            {(isLoading) ? (
                <RootStack.Screen
                    name="Splash"
                    component={Splash}
                    options={{
                        animationEnabled: true,
                        headerShown: false
                    }}
                />
            ) :
                (Profile.userToken && Profile.jwt) ? (
                    <RootStack.Screen
                        name="App"
                        component={DrawerStackScreen}
                        options={{
                            animationEnabled: true,
                            headerShown: false,
                        }}
                    />
                ) : (
                    <RootStack.Screen
                        name="Auth"
                        component={AuthStackScreen}
                        options={{
                            animationEnabled: false,
                            headerShown: false,
                        }}
                    />
                )
            }

        </RootStack.Navigator>
    );
}

const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
        />
    </AuthStack.Navigator>
);

const DrawerStack = createDrawerNavigator();
const DrawerStackScreen = () => (
    <DrawerStack.Navigator initialRouteName="Home">
        <DrawerStack.Screen name="Home" component={HomeStackScreen} options={{ headerShown: true }} />
        <DrawerStack.Screen name="Forms" component={FormsTabs} options={{ headerShown: true }} />
        <DrawerStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
    </DrawerStack.Navigator>
);

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const FormsTabsNav = createBottomTabNavigator();

const FormsTabs = () => {
    return (
        <FormsTabsNav.Navigator>
            <FormsTabsNav.Screen name="Site Inspection" component={SiteInspection} options={{ headerShown: false }} />
            <FormsTabsNav.Screen name="Pull Out Test" component={PullOut} options={{ headerShown: false }} />
            <FormsTabsNav.Screen name="Site Visit" component={SiteVisit} options={{ headerShown: false }} />
        </FormsTabsNav.Navigator>
    );
}


const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
    const { header } = useTheme();
    return (
        <HomeStack.Navigator initialRouteName="Dashboard" >
            <HomeStack.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false, }} />
        </HomeStack.Navigator>
    )
};
