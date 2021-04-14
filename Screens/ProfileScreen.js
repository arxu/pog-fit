import * as React from "react";
import { Text } from "react-native-paper";

const ProfileScreen = () => <Text>Profile</Text>;

export default function ProfileScreen(props) {
    return (
        <NavigationContainer>
            <React.Fragment>
                <Stack.Navigator initialRouteName="My Profile" screenOptions={{headerShown: false}}>
                    {/* <Stack.Screen name="My Profile">
                        {(props) => <ProfileView {...props}/>}
                    </Stack.Screen> */}
                </Stack.Navigator>
            </React.Fragment>
        </NavigationContainer>
    );
};