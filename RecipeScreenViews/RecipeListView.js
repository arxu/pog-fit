import React, {Component} from 'react';
import { ScrollView } from "react-native";
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Appbar, Card, List, Button} from "react-native-paper";

import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {getAllRecipes} from "../FileStorage/Database";

export default class RecipeListView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      breakfasts: [],
      lunches: [],
      dinners: [],
      snacks: []
    };
    getAllRecipes((error, result) => {
      if (error) {
        console.log(error);
      }
      else {
        let breakfasts = [], lunches = [], dinners = [], snacks = [];
        for (let i = 0; i < result.length; i++){
          switch (result[i].category){
            case "Breakfast":
              breakfasts.push(result[i]);
              break;
            case "Lunch":
              lunches.push(result[i]);
              break;
            case "Dinner":
              dinners.push(result[i]);
              break;
            case "Snack":
              snacks.push(result[i]);
              break;
          }
        }
        this.setState({
          breakfasts: breakfasts, 
          lunches: lunches, 
          dinners: dinners, 
          snacks: snacks
        });
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
          <CardCategory 
            meals={this.state.breakfasts} 
            navigation={this.props.navigation}
            title="Breakfasts"
          />
          <CardCategory
            meals={this.state.lunches}
            navigation={this.props.navigation}
            title="Lunches"
          />
          <CardCategory
            meals={this.state.dinners}
            navigation={this.props.navigation}
            title="Dinners"
          />
          <CardCategory
            meals={this.state.snacks}
            navigation={this.props.navigation}
            title="Snacks"
          />
        </ScrollView>
      </React.Fragment>
    );
    
  }
}

class CardCategory extends Component {
  constructor(props){
    super(props);
    this.state = {
      unveiled: false
    }
  }

  render() {
    return (
        <Card>
          <TouchableWithoutFeedback onPress={() => {this.setState({unveiled: !this.state.unveiled});}}>
            <Card.Title title={this.props.title}></Card.Title>
          </TouchableWithoutFeedback>
            {this.state.unveiled ? 
              this.props.meals.map((recipe) => {
                return <CustomCard
                  navigation = {this.props.navigation}
                  data = {recipe}
                  pushViewTitle = 'Recipe'
                  key={recipe.id}
                  title={recipe.title}
                  uri={recipe.uri}
                />
              })
              :
              null
            }
        </Card>
    );
  }
}