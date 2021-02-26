import * as React from "react";
import {createStackNavigator} from '@react-navigation/stack';
import {Appbar} from 'react-native-paper';

import RecipeEditRoute from '../RecipeScreenViews/EditRecipeView';
import RecipeViewRoute from '../RecipeScreenViews/RecipeView';
import RecipeListRoute from '../RecipeScreenViews/RecipeListView';

const Stack = createStackNavigator();

const RecipeScreen = (props) => {
  return (
    <React.Fragment>
      <Stack.Navigator initialRouteName="Recipe List" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Recipe List">
          {props => <RecipeListRoute {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Edit Recipe" component={RecipeEditRoute}/>
        <Stack.Screen 
          name="Recipe" 
          component={RecipeViewRoute}
        />
      </Stack.Navigator>
    </React.Fragment>
    
  );
};

export default RecipeScreen;