import React, {Component} from 'react';
import { ScrollView} from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Appbar, Card, Menu, Dialog, Portal, Button, TextInput, RadioButton, Text, HelperText } from "react-native-paper";


import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {getAllRecipes, addRecipe, updateRecipe, del} from "../FileStorage/Database";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

// added

export default class RecipeListView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      breakfasts: [],
      lunches: [],
      dinners: [],
      snacks: [],
      dialogVisible: false,
      newTitle: "Test",
      tempTitle: "",
      categoryVis: false,
      check: "Breakfast",
      ingrVis: false,
      ingr:"",
      nutVis: false,
      fat: "",
      protein: "",
      carbs: "",
      sugar: "",
      dis1: true,
      dis2: true,
      dis3: true,
      dis4: true,
      methodVis: false,
      method:""
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

          {/* Menu option */}
          <Menu
            visible={this.state.menuVisible}
            onDismiss={()=> {this.setState({menuVisible: false})}}
            anchor={<Appbar.Action icon={MORE_ICON} color="white" onPress={() => {this.setState({menuVisible: true})}} />}>
            
            {/* Pressing an item will create a pop up and hide the menu */}
            <Menu.Item onPress={() => {this.setState({dialogVisible: true, menuVisible: false})}} title="Add Recipe" />

          </Menu>

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

        <Portal>

          {/* Pop up for add recipe */}
          <Dialog visible={this.state.dialogVisible} onDismiss={()=> {this.setState({dialogVisible: false, newTitle:""})}}>
            <Dialog.Title>Add</Dialog.Title>
            <Dialog.Content>
              <TextInput
              label="Recipe Name"
              value= {this.state.newTitle}
              onChangeText={text => this.setState({newTitle: text, tempTitle: text})}
              />
              
            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({dialogVisible: false, newTitle:""})}}>Cancel</Button>
              <Button disabled={this.state.newTitle.length < 1 ? true : false} onPress={()=>{this.setState({dialogVisible: false, categoryVis: true}), addRecipe(this.state.newTitle)}}>Next</Button>
            </Dialog.Actions>
          </Dialog>

          {/* Pop up to select category */}
          <Dialog visible={this.state.categoryVis} onDismiss={()=> {this.setState({categoryVis: false, newTitle: ""}), del(this.state.tempTitle)}}>
            <Dialog.Title>Category</Dialog.Title>
            <RadioButton.Group
            onValueChange={check => this.setState({ check })}
            value={this.state.check}>
              <RadioButton.Item label="Breakfast" value="Breakfast" color="blue"/>
              <RadioButton.Item label="Lunch" value="Lunch" color="blue"/> 
              <RadioButton.Item label="Dinner" value="Dinner" color="blue"/>
              <RadioButton.Item label="Snack" value="Snack" color="blue"/>
            </RadioButton.Group>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({categoryVis: false, newTitle:"", check:"Breakfast"}), del(this.state.tempTitle)}}>Cancel</Button>
              <Button onPress={()=>{this.setState({categoryVis: false, ingrVis: true})}}>Next</Button>
            </Dialog.Actions>
          </Dialog>

          {/* Pop up to add ingredients */}
          <Dialog visible={this.state.ingrVis} onDismiss={()=> {this.setState({ingrVis: false, newTitle:"", check:"Breakfast", ingr:""})}}>
            <Dialog.Title>Ingredients</Dialog.Title>
            <Dialog.Content>
              <TextInput
              label="Ingredients"
              value= {this.state.ingr}
              onChangeText={text => this.setState({ingr: text})}
              />
            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({ingrVis: false, newTitle:"", check:"Breakfast", ingr: ""})}}>Cancel</Button>
              <Button onPress={()=>{this.setState({ingrVis: false, nutVis: true})}}>Next</Button>
            </Dialog.Actions>
          </Dialog>

          {/* Pop up to add nutrition */}
          <Dialog visible={this.state.nutVis} onDismiss={()=> {this.setState({nutVis: false, newTitle:"", check:"Breakfast", ingr:"", fat: "", protein: "", carbs: "", sugar: "", dis1: true, dis2: true, dis3: true, dis4: true})}}>
            <Dialog.Title>Nutrition</Dialog.Title>
            <Dialog.Content>

              <TextInput
              keyboardType={'number-pad'}
              label="Fat"
              value= {this.state.fat}
              placeholder="0"
              onChangeText={text => this.setState({fat: text}, Number(text) ? this.setState({dis1: false})  : this.setState({dis1: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.fat) && this.state.fat.length > 1 ? true: false}>
                Not a number!
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Protein"
              value= {this.state.protein}
              placeholder="0"
              onChangeText={text => this.setState({protein: text}, Number(text) ? this.setState({dis2: false})  : this.setState({dis2: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.protein) && this.state.protein.length > 1 ? true: false}>
                Not a number!
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Carbohydrates"
              value= {this.state.carbs}
              placeholder="0"
              onChangeText={text => this.setState({carbs: text}, Number(text) ? this.setState({dis3: false})  : this.setState({dis3: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.carbs) && this.state.carbs.length > 1 ? true: false}>
                Not a number!
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Sugar"
              value= {this.state.sugar}
              placeholder="0"
              onChangeText={text => this.setState({sugar: text}, Number(text) ? this.setState({dis4: false})  : this.setState({dis4: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.sugar) && this.state.sugar.length > 1 ? true: false}>
                Not a number!
              </HelperText>

            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({nutVis: false, newTitle:"", check:"Breakfast", ingr: "", fat: "", protein: "", carbs: "", sugar: "", dis1: true, dis2: true, dis3: true, dis4: true})}}>Cancel</Button>
              {/* <Button disabled={(this.state.fat.length && this.state.protein.length && this.state.carbs.length && this.state.sugar.length) < 1  ? true : false}   */}
              <Button disabled={this.state.dis1 || this.state.dis2 || this.state.dis3 || this.state.dis4  ? true : false}  
              onPress={()=>{this.setState({nutVis: false, methodVis: true})}}>Next</Button>
            </Dialog.Actions>
          </Dialog>

          {/* Pop up to add method */}
          <Dialog visible={this.state.methodVis} onDismiss={()=> {this.setState({methodVis: false, newTitle:"", check:"Breakfast", ingr:"", fat: "", protein: "", carbs: "", sugar: "", method: "", dis1: true, dis2: true, dis3: true, dis4: true})}}>
            <Dialog.Title>Method</Dialog.Title>
            <Dialog.Content>
              <TextInput
              label="Method"
              value= {this.state.method}
              placeholder="Step by step instructions"
              multiline={true}
              numberOfLines={4}
              onChangeText={text => this.setState({method: text})}
              />
              <HelperText type="info" visible={true}>
                Optional. You can add the method later.
              </HelperText>

            </Dialog.Content>
            
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({methodVis: false, newTitle:"", check:"Breakfast", ingr: "", fat: "", protein: "", carbs: "", sugar: "", method: "", dis1: true, dis2: true, dis3: true, dis4: true})}}>Cancel</Button>
              <Button 
                onPress={()=>{this.setState({methodVis: false, newTitle:"", check:"Breakfast", ingr: "", fat: "", protein: "", carbs: "", sugar: "", method: "", dis1: true, dis2: true, dis3: true, dis4: true}, 
                  updateRecipe(this.state.newTitle, this.state.check, this.state.fat, this.state.protein, this.state.carbs, this.state.sugar, this.state.method))}
                }>Next</Button>

            </Dialog.Actions>
          </Dialog>

        </Portal>

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
