import { NavigationContainer, useNavigationState, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StatusBar, View, Image, ImageBackground, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import styles from './styles'
import { useContext, useRef, useState, useEffect } from 'react';
import { AuthContext } from './context';
import { IconButton, useTheme, Text, Avatar, Modal, Portal, TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, AppState } from 'react-native';
import { FindProjects, SiteInspection } from './screens/FindProject';
import { PullOut } from './screens/PullOut';
import { SiteVisit } from './screens/SiteVisit';
import { HomeScreen } from './screens/Home';
import { SignIn } from './screens/SignIn';
import * as Device from 'expo-device';
import { Splash } from './screens/splash';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProjectDetails } from './screens/ProjectDetails';
import { CreateForm } from './screens/CreateForm';
import { MakeCardScreen } from './screens/MakeCard';



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
function RootNavigator(props) {

    const [isLoading, setIsLoading] = React.useState(true);


    return (
        <RootStack.Navigator headerMode={false}>
            {(props.props.loading == true && !props.props.userToken && !props.props.jwt) ? (
                <RootStack.Screen
                    name="Splash"
                    component={Splash}
                    options={{
                        animationEnabled: true,
                        headerShown: false
                    }}
                />
            ) :
                (props.props.userToken && props.props.jwt) ? (
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
const DrawerStackScreen = () => {
    const { signOutGlobal, Profile } = React.useContext(AuthContext)

    return (
        <DrawerStack.Navigator initialRouteName="Home" drawerContent={props => {
            return (
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                    <DrawerItem label="Log Out" onPress={() => signOutGlobal()} />
                </DrawerContentScrollView>
            )
        }}
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#263C19',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerRight: () => <Image resizeMethod='resize' resizeMode='contain' style={{ height: 30, width: 150, marginRight: 10 }} source={require("./assets/logowhite.png")} />,
            }}
        >
            <DrawerStack.Screen name="Home" component={HomeStackScreen} />
            <DrawerStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
        </DrawerStack.Navigator>

    )
};

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const HomeStack = createBottomTabNavigator();

const HomeStackScreen = () => {
    const { colors } = useTheme();
    const { Profile } = React.useContext(AuthContext);

    console.log(Profile)

    return (
        <HomeStack.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                switch (route.name) {
                    case 'Dashboard':
                        iconName = focused
                            ? 'account'
                            : 'account-outline';
                        break;
                    case 'Projects':
                        iconName = focused
                            ? 'briefcase'
                            : 'briefcase-outline';
                        break;
                    case 'Pull Out Test':
                        iconName = focused
                            ? 'arrow-down-bold-circle'
                            : 'arrow-down-bold-circle-outline';
                        break;
                    case 'Site Visit':
                        iconName = focused
                            ? 'briefcase'
                            : 'briefcase-outline';
                        break;
                        case 'Make Cards':
                            iconName = focused
                                ? 'card-account-details'
                                : 'card-account-details-outline';
                            break;
                    default:
                        iconName = focused
                            ? 'alpha'
                            : 'alpha-a-box-outline';
                }

                // You can return any component that you like here!
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: 'gray',
            tabBarItemStyle: { marginBottom: 5 },
        })}
        >
            <HomeStack.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false, }} />
            {Profile.userClassName == "User" &&
                <HomeStack.Screen name="Projects" component={FindProjectsStackScreen} options={{ headerShown: false }} />
            }
            {Profile.userClassName == "Packer" &&
                <HomeStack.Screen name="Packer" component={FindProjectsStackScreen} options={{ headerShown: false }} />
            }
            {Profile.id == "154" &&
                <HomeStack.Screen name="Make Cards" component={MakeCardScreen} options={{ headerShown: false }} />
            }
        </HomeStack.Navigator>
    );
}

const FindProjectsStack = createNativeStackNavigator();
const FindProjectsStackScreen = () => (
    <FindProjectsStack.Navigator>
        <FindProjectsStack.Screen
            name="Find Projects"
            component={FindProjects}
            options={{ headerShown: false }}
        />
        <FindProjectsStack.Screen
            name="Project Details"
            component={ProjectDetails}
            options={{ headerShown: true }}
        />
        <FindProjectsStack.Screen
            name="Create Form"
            component={CreateForm}
            options={({ route }) => ({ headerShown: true, headerTitle: route.params.props.title })}
        />
    </FindProjectsStack.Navigator>
);
