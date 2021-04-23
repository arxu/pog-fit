import React, {Component} from "react";
import {createStackNavigator} from '@react-navigation/stack';

import RecipeView from '../RecipeScreenViews/RecipeView';
import RecipeListView from '../RecipeScreenViews/RecipeListView';
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default class RecipeScreen extends Component {
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== nextState;
  }

  render() {
    return (
      <NavigationContainer>
        <React.Fragment>
          <Stack.Navigator initialRouteName="Recipe List" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Recipe List">
              {props => <RecipeListView {...props} />}
            </Stack.Screen>
            <Stack.Screen 
              name="Recipe" 
              component={RecipeView}
            />
          </Stack.Navigator>
        </React.Fragment>
      </NavigationContainer>
    );
  }
};