import * as React from "react";
import { ScrollView } from "react-native";
import {createStackNavigator} from '@react-navigation/stack';

import RecipeEditRoute from './EditRecipeScreen';
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import Elements from "../CustomProperties/Elements";

const Stack = createStackNavigator();

const RecipeList = (props) => {
  return (
    <React.Fragment>
      <SearchBar />
      <ScrollView>
        {Elements.map((e) => (
          <CustomCard
            navigation = {props.navigation}
            eventTest = {props.eventTest /* for testing events */}
            key={e.id}
            title={e.title}
            content={e.content}
            uri={e.uri}
            comment={e.comment}
            shares={e.shares}
            views={e.views}
            likes={e.likes}
          />
        ))}
      </ScrollView>
    </React.Fragment>
  );
}

const RecipeScreen = (props) => {
  return (
    <Stack.Navigator initialRouteName="Recipe List">
      <Stack.Screen name="Recipe List">
        {props => <RecipeList {...props} eventTest={() => alert("button pressed")} />}
      </Stack.Screen>
      <Stack.Screen name="Edit Recipe" component={RecipeEditRoute}/>
    </Stack.Navigator>
    
  );
};

export default RecipeScreen;