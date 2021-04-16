import * as React from "react";
import { Text } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import ProfileView from '../ProfileScreenViews/ProfileView';

const Stack = createStackNavigator();

export default function ProfileScreen(props) {
    return (
        <NavigationContainer>
            <React.Fragment>
                <Stack.Navigator initialRouteName="My Profile" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="My Profile">
                        {(props) => <ProfileView {... props}/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </React.Fragment>
        </NavigationContainer>
    );
};