import React, {Component} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";

import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {getAllRecipes} from "../FileStorage/Database";

export default class RecipeListView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
    getAllRecipes((error, result) => {
      if (error) {
        console.log(error);
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
              data = {recipe}
              pushViewTitle = 'Recipe'
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