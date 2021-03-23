import React, {Component} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";

import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {getAllRecipes} from "../FileStorage/Database";

export default class RecipeListRoute extends Component{
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
    getAllRecipes((error, result) => {
      if (error) {
        console.log(eror);
      }
      else {
        //this.state.recipes = result;
        //console.log(this.state.recipes); // Expected output
        this.setState({recipes: result})
      }
    });
  }
  
  render() {
    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Recipes"/>
        </Appbar.Header>
        <SearchBar />
        <ScrollView>
          {this.state.recipes.map((recipe) => {
            return <CustomCard
              navigation = {this.props.navigation}
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
}
/*
export default function RecipeListRoute(props) {
  
  // WARNING: the contents of the array passed into useEffect are compared to their previous state.
  // The function is called only when there is a change to the contents (I think) of the array.
  // This may result in the recipe list not showing new/modified recipes.
  // useEffect( () => { 
  //   loadAll("recipes", setRecipes); 
  // }, []);

  getAllRecipes((error, result) => {
      if (error) {
          console.log(error);
      }
      else {
          console.log(result);
      }
  });

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Content title="Recipes"/>
      </Appbar.Header>
      <SearchBar />
      <ScrollView>
        {{recipes.map(function(recipe) {
          if (recipe.id == 0) 
            return;
          return <CustomCard
            navigation = {props.navigation}
            recipe = {recipe}
            key={recipe.id}
            title={recipe.title}
            uri={recipe.uri}
          />
        })} }
      </ScrollView>
    </React.Fragment>
  );
}
*/