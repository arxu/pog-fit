import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';

import CalendarListView from '../CalendarScreenViews/CalendarListView';
import WorkoutView from '../WorkoutScreenViews/WorkoutView';
import RecipeView from '../RecipeScreenViews/RecipeView';

const Stack = createStackNavigator();

export default function CalendarScreen(props) {
    return (
        <NavigationContainer>
            <React.Fragment>
                <Stack.Navigator initialRouteName="Calendar List" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Calendar List">
                        {(props) => <CalendarListView {...props}/>}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Workout" 
                        component={WorkoutView}
                    />
                    <Stack.Screen
                        name="Recipe" 
                        component={RecipeView}
                    />
                </Stack.Navigator>
            </React.Fragment>
        </NavigationContainer>
    );
};
