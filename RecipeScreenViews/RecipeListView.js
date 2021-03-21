import React, {useState, useEffect, useRef} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {loadAll} from "../FileStorage/DBManager";
import {createDefaultTables, testQuery} from "../FileStorage/Database";


const RecipeListRoute = (props) => {
  let [recipes, setRecipes] = useState([]);
  createDefaultTables();
  
  // WARNING: the contents of the array passed into useEffect are compared to their previous state.
  // The function is called only when there is a change to the contents (I think) of the array.
  // This may result in the recipe list not showing new/modified recipes.
  useEffect( () => { 
    loadAll("recipes", setRecipes); 
  }, []);

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Content title="Recipes"/>
      </Appbar.Header>
      <SearchBar />
      <ScrollView>
        {recipes.map(function(recipe) {
          if (recipe.id == 0) 
            return;
          return <CustomCard
            navigation = {props.navigation}
            recipe = {recipe}
            key={recipe.id}
            title={recipe.title}
            uri={recipe.uri}
          />
        })}
      </ScrollView>
    </React.Fragment>
  );
}

export default RecipeListRoute;