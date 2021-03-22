import React, {Component} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import SQLite from 'react-native-sqlite-storage';

import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {loadAll} from "../FileStorage/DBManager";
import {getAllRecipes} from "../FileStorage/Database";

let db;

export default class RecipeListRoute extends Component{
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
    db = SQLite.openDatabase("pogFit", this.onDBOpenSuccess.bind(this), this.onDBOpenFailure);
  }

  onDBOpenSuccess() {
    console.log("\n\n\n\n\n\n\n\n\n\n\n 2 \n\n\n\n\n\n\n\n\n\n\n\n");
    db.transaction((tx) => {
      tx.executeSql(`
          SELECT * 
          FROM recipes;
      `, 
      [],
      (tx, recipeResultSet) => { 
          this.state.recipes = recipeResultSet;
      },
      (tx, error) => {
          console.log(error);
      });
    },
    (error) => {
        console.log(error);
    });
  }

  onDBOpenFailure(error) {
    console.log("\n\n\n\n\n\n\n\n\n\n\n 2 \n\n\n\n\n\n\n\n\n\n\n\n");
    console.log(error);
  }

  render() {
    <React.Fragment>
      <Appbar.Header>
        <Appbar.Content title="Recipes"/>
      </Appbar.Header>
      <SearchBar />
      <ScrollView>
        {/* {recipes.map(function(recipe) {
          if (recipe.id == 0) 
            return;
          return <CustomCard
            navigation = {props.navigation}
            recipe = {recipe}
            key={recipe.id}
            title={recipe.title}
            uri={recipe.uri}
          />
        })} */}
      </ScrollView>
    </React.Fragment>
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