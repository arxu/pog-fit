import * as React from "react";
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import WorkoutView from '../WorkoutScreenViews/WorkoutView';
import WorkoutListView from '../WorkoutScreenViews/WorkoutListView';

const Stack = createStackNavigator();

export default function RecipeScreen(props) {
  return (
      <NavigationContainer>
        <React.Fragment>
            <Stack.Navigator initialRouteName="Workout List" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Workout List">
                    {props => <WorkoutListView {...props} />}
                </Stack.Screen>
                <Stack.Screen 
                    name="Workout" 
                    component={WorkoutView}
                />
            </Stack.Navigator>
        </React.Fragment>
      </NavigationContainer>
    
    
  );
};